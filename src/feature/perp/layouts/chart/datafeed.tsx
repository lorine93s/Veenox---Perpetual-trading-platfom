import { fetchMarketHistory } from "@/api/fetchMarketHistory";
import {
  BarsSymbolInfoProps,
  CustomBarProps,
  FuturesAssetProps,
} from "@/models";
import { getNextBarTime, resolutionToTimeframe } from "@/utils/misc";
import { WS } from "@orderly.network/net";
import { Dispatch, SetStateAction } from "react";

export const supportedResolutions = [
  "1",
  "3",
  "5",
  "15",
  "60",
  "120",
  "240",
  "1D",
  "7D",
  "1M",
];

const sockets = new Map<string, WS>();
const lastBarsCache = new Map();
const initialDataLoadedMap: Record<string, boolean> = {};

export const Datafeed = (
  asset: FuturesAssetProps,
  ws: WS,
  setIsChartLoading: Dispatch<SetStateAction<boolean>>
) => ({
  onReady: (callback: Function) => {
    callback({ supported_resolutions: supportedResolutions });
  },
  resolveSymbol: (symbolName: string, onResolve: Function) => {
    const price = asset?.mark_price || 1;
    const params = {
      name: symbolName,
      description: "",
      type: "crypto",
      session: "24x7",
      ticker: asset?.symbol,
      minmov: 1,
      pricescale: Math.min(
        10 ** String(Math.round(10000 / price)).length,
        10000000000000000
      ),
      has_intraday: true,
      intraday_multipliers: ["1", "5", "15", "30", "60"],
      supported_resolution: supportedResolutions,
      volume_precision: 8,
      data_status: "streaming",
    };
    onResolve(params);
  },
  getBars: async (
    symbolInfo: BarsSymbolInfoProps,
    resolution: string,
    periodParams: { from: number; to: number; firstDataRequest: boolean },
    onResult: Function
  ) => {
    const { from, to, firstDataRequest } = periodParams;

    const params = {
      symbol: symbolInfo.ticker,
      timeframe: resolution,
      from: from,
      to: to,
    };
    const data = await fetchMarketHistory(params);

    if (data && data.s === "ok" && data.o) {
      const bars = data.t.map((timestamp: number, index: number) => {
        return {
          time: timestamp * 1000,
          open: data.o[index],
          high: data.h[index],
          low: data.l[index],
          close: data.c[index],
          volume: data.v[index],
        };
      });

      onResult(bars, { noData: false });
      if (firstDataRequest) {
        lastBarsCache.set(symbolInfo.ticker, { ...bars[bars.length - 1] });
      }
    } else {
      onResult([], { noData: true });
    }
  },
  searchSymbols: () => {},
  subscribeBars: (
    symbolInfo: BarsSymbolInfoProps,
    resolution: string,
    onRealtimeCallback: (bar: CustomBarProps) => void,
    subscriberUID: any
  ) => {
    try {
      const timeframe = resolutionToTimeframe(resolution);

      const unsubscribe = ws.subscribe(
        {
          id: `${symbolInfo.ticker}@kline_${timeframe}`,
          topic: `${symbolInfo.ticker}@kline_${timeframe}`,
          event: "subscribe",
        },
        {
          onMessage: (data: any) => {
            if (data) {
              const currentTimeInMs = Date.now();
              const price = parseFloat(data.close);
              let lastDailyBar: CustomBarProps = lastBarsCache.get(
                symbolInfo.ticker
              );
              const nextDailyBarTime = getNextBarTime(
                resolution,
                lastDailyBar.time
              );
              let bar: CustomBarProps;
              const initialDataLoaded =
                initialDataLoadedMap[symbolInfo.ticker] || false;

              if (initialDataLoaded && data.endTime >= nextDailyBarTime) {
                bar = {
                  time: currentTimeInMs,
                  open: price,
                  high: price,
                  low: price,
                  close: price,
                  volume: data.volume,
                };
                lastBarsCache.set(symbolInfo.ticker, bar);
              } else {
                bar = {
                  ...lastDailyBar,
                  high: Math.max(lastDailyBar.high, price),
                  low: Math.min(lastDailyBar.low, price),
                  close: price,
                  volume: data.volume,
                };
                lastBarsCache.set(symbolInfo.ticker, bar);
              }

              initialDataLoadedMap[symbolInfo.ticker] = true;

              onRealtimeCallback(bar);
            }
          },
        }
      );
      if (unsubscribe)
        sockets.set(
          symbolInfo.name + "-" + subscriberUID,
          unsubscribe as never
        );

      return () => {
        if (unsubscribe) unsubscribe();
        sockets.delete(`${symbolInfo.name}@kline_${timeframe}`);
      };
    } catch (e) {}
  },
  unsubscribeBars: () => {},
  getMarks: () => ({}),
  getTimeScaleMarks: () => ({}),
  getServerTime: () => ({}),
});
