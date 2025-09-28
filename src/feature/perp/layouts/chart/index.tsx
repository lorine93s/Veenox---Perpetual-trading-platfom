import { useGeneralContext } from "@/context";
import { FuturesAssetProps } from "@/models";
import { cn } from "@/utils/cn";
import { formatSymbol } from "@/utils/misc";
import {
  useOrderStream,
  usePositionStream,
  useWS,
} from "@orderly.network/hooks";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Bar,
  ChartingLibraryWidgetOptions,
  HistoryMetadata,
  IBasicDataFeed,
  IChartingLibraryWidget,
  LanguageCode,
  LibrarySymbolInfo,
  ResolutionString,
  SearchSymbolResultItem,
  Timezone,
} from "../../../../../public/static/charting_library/charting_library";
import { DISABLED_FEATURES, ENABLED_FEATURES } from "./constant";
import { Datafeed } from "./datafeed";
import { widgetOptionsDefault } from "./helper";
import { overrides } from "./theme";

interface TradingViewChartProps {
  asset: FuturesAssetProps;
  mobile?: boolean;
  custom_css_url?: string;
  className?: string;
  params: any;
}

interface ChartElement {
  id: string;
  name: string;
  [key: string]: any;
}

interface ChartState {
  drawings: ChartElement[];
  studies: ChartElement[];
  symbol: string;
  interval: string;
}

interface IChartWidgetApi {
  onDataLoaded(): ISubscription;
  onSymbolChanged(): ISubscription;
  onIntervalChanged(): ISubscription;
}

interface ISubscription {
  unsubscribeAll(obj?: object): void;
}
interface CustomDatafeed extends IBasicDataFeed {
  onReady: (
    callback: (configuration: {
      supported_resolutions: ResolutionString[];
    }) => void
  ) => void;
  resolveSymbol: (
    symbolName: string,
    onResolve: (symbolInfo: LibrarySymbolInfo) => void,
    onError: (reason: string) => void
  ) => void;
  getBars: (
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    periodParams: { from: number; to: number; firstDataRequest: boolean },
    onResult: (bars: Bar[], meta: HistoryMetadata) => void,
    onError: (reason: string) => void
  ) => void;
  searchSymbols: (
    userInput: string,
    exchange: string,
    symbolType: string,
    onResult: (result: SearchSymbolResultItem[]) => void
  ) => void;
  subscribeBars: (
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    onRealtimeCallback: (bar: Bar) => void,
    subscriberUID: string,
    onResetCacheNeededCallback: () => void
  ) => void;
  unsubscribeBars: (subscriberUID: string) => void;
}

interface WidgetOptions extends ChartingLibraryWidgetOptions {
  symbol: string;
  interval: ResolutionString;
  datafeed: CustomDatafeed;
  locale: LanguageCode;
  enabled_features: string[];
  disabled_features: string[];
  fullscreen: boolean;
  autosize: boolean;
  theme: "Light" | "Dark";
  loading_screen: { backgroundColor: string };
  timezone: "exchange" | Timezone;
}

type WidgetInstance = IChartingLibraryWidget;

const TradingViewChart: React.FC<TradingViewChartProps> = ({
  asset,
  mobile = false,
  custom_css_url = "../themed.css",
  className = "",
  params,
}) => {
  const { isChartLoading, setIsChartLoading } = useGeneralContext();
  const ref = useRef<HTMLDivElement>(null);
  const [tvWidget, setTvWidget] = useState<IChartingLibraryWidget | null>(null);
  const ws = useWS();
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  const [chartLines, setChartLines] = useState<{ [key: string]: any }>({});
  const [orders] = usePositionStream();
  const { orderPositions } = useGeneralContext();
  const [isChartReady, setIsChartReady] = useState(false);
  const chartRef = useRef<any>(null);
  const prevPositionsRef = useRef("");
  const [currentInterval, setCurrentInterval] = useState<string>("");
  const order = orders?.rows?.find((entry) => entry.symbol === asset?.symbol);

  const [ordersData] = useOrderStream({ symbol: asset?.symbol });

  const pendingPosition = useMemo(() => {
    return (
      ordersData?.filter(
        (entry) =>
          entry.total_executed_quantity < entry.quantity &&
          entry.type === "LIMIT" &&
          entry.status !== "COMPLETED" &&
          entry.status !== "FILLED" &&
          entry.status !== "CANCELLED"
      ) || []
    );
  }, [ordersData]);

  console.log("ordersDataordersData", pendingPosition);
  const saveChartState = useCallback(
    (chart: any) => {
      if (!isInitialLoadComplete) {
        return;
      }

      const currentState: ChartState = {
        drawings: chart.getAllShapes(),
        studies: chart.getAllStudies(),
        symbol: chart.symbol(),
        interval: chart.resolution(),
      };

      const savedStateString = localStorage.getItem("chartState");
      const savedState: ChartState = savedStateString
        ? JSON.parse(savedStateString)
        : { drawings: [], studies: [], symbol: "", interval: "" };

      const updateElements = (
        currentElements: ChartElement[],
        savedElements: ChartElement[]
      ) => {
        return currentElements.filter((curr) => {
          if (curr.name === "Volume") return false;
          const existingElement = savedElements.find(
            (saved) => saved.name === curr.name
          );
          if (existingElement) {
            return false;
          }
          return true;
        });
      };

      const updatedState: ChartState = {
        drawings: updateElements(currentState.drawings, savedState.drawings),
        studies: updateElements(currentState.studies, savedState.studies),
        symbol: currentState.symbol,
        interval: currentState.interval,
      };
      updatedState.drawings = [
        ...updatedState.drawings,
        ...savedState.drawings.filter((s) =>
          currentState.drawings.some((c) => c.name === s.name)
        ),
      ];
      updatedState.studies = [
        ...updatedState.studies,
        ...savedState.studies.filter((s) =>
          currentState.studies.some((c) => c.name === s.name)
        ),
      ];

      localStorage.setItem("chartState", JSON.stringify(updatedState));
    },
    [isInitialLoadComplete]
  );

  const loadSavedState = async (chart: any) => {
    return new Promise<void>((resolve) => {
      const savedState = localStorage.getItem("chartState");
      if (savedState) {
        const parsedState = JSON.parse(savedState);

        if (typeof chart.setSymbol === "function") {
          try {
            chart.setSymbol(parsedState.symbol, parsedState.interval);
          } catch (error) {
            console.error("Error setting symbol:", error);
          }
        } else {
          console.warn("setSymbol is not available or not a function");
        }

        const promises: Promise<void>[] = [];

        parsedState.drawings.forEach((drawing: any) => {
          try {
            promises.push(chart.createShape(drawing.point, drawing.options));
          } catch (error) {
            console.error("Error creating shape:", error);
          }
        });

        parsedState.studies.forEach((study: any) => {
          if (study.name !== "Volume") {
            try {
              promises.push(
                chart.createStudy(
                  study.name,
                  study.forceOverlay,
                  study.lock,
                  study.inputs,
                  study.overrides,
                  study.options
                )
              );
            } catch (error) {
              console.error("Error creating study:", error);
            }
          }
        });

        Promise.all(promises)
          .then(() => {
            resolve();
          })
          .catch((error) => {
            console.error("Error loading saved items:", error);
            resolve();
          });
      } else {
        resolve();
      }
    });
  };

  const setupChangeListeners = useCallback(
    (widget: IChartingLibraryWidget) => {
      const chart = widget.activeChart();
      chartRef.current = chart;
      const saveState = () => {
        saveChartState(chart);
      };

      try {
        chart.onDataLoaded().subscribe(null, saveState);
        chart.onSymbolChanged().subscribe(null, saveState);
        chart.onIntervalChanged().subscribe(null, () => {
          saveState();
          setCurrentInterval(chart.resolution());
          updatePositions();
        });
      } catch (error) {
        console.error("Error setting up chart listeners:", error);
      }

      const observer = new MutationObserver((mutations) => {
        saveState();
      });

      const config = { attributes: true, childList: true, subtree: true };
      observer.observe(ref.current!, config);

      return () => {
        try {
          chart.onDataLoaded().unsubscribeAll(saveState);
          chart.onSymbolChanged().unsubscribeAll(saveState);
          chart.onIntervalChanged().unsubscribeAll(saveState);
        } catch (error) {
          console.error("Error removing chart listeners:", error);
        }
        observer.disconnect();
      };
    },
    [saveChartState]
  );

  const initChart = useCallback(() => {
    if (!asset || !ref.current) {
      console.warn(
        "Asset or ref is not available. Skipping chart initialization."
      );
      return;
    }

    import("../../../../../public/static/charting_library").then(
      ({ widget: Widget }) => {
        const widgetOptions: WidgetOptions = {
          symbol: formatSymbol(asset?.symbol),
          datafeed: Datafeed(asset, ws, setIsChartLoading) as never,
          container: ref.current as never,
          container_id: ref.current?.id as never,
          locale: "en",
          disabled_features: DISABLED_FEATURES,
          enabled_features: ENABLED_FEATURES,
          fullscreen: false,
          autosize: true,
          theme: "Dark",
          custom_css_url: "/static/pro.css",
          loading_screen: { backgroundColor: "#1B1D22" },

          timezone: Intl.DateTimeFormat().resolvedOptions()
            .timeZone as Timezone,
          ...widgetOptionsDefault,
          studies_overrides: {
            "volume.volume.color.0": "#ea4339",
            "volume.volume.color.1": "#0ECB81",
            "volume.volume.transparency": 50,
          },
          overrides: {
            volumePaneSize: "medium",
          },
        };

        const widgetInstance = new Widget(widgetOptions);

        widgetInstance.onChartReady(async () => {
          widgetInstance.activeChart().getTimeScale().setRightOffset(30);

          widgetInstance.applyOverrides(overrides as any);
          setTvWidget(widgetInstance);
          setIsChartReady(true);

          const chart = widgetInstance.activeChart();
          chartRef.current = widgetInstance;

          try {
            await loadSavedState(chart);
          } catch (error) {
            console.error("Error loading saved state:", error);
          }

          setIsInitialLoadComplete(true);
          const cleanup = setupChangeListeners(widgetInstance);

          updatePositions();

          return cleanup;
        });
      }
    );
  }, [asset, mobile, ws, setupChangeListeners]);

  const relevantPositions = useMemo(() => {
    return (
      orders?.rows?.filter(
        (position: any) => position.symbol === asset?.symbol
      ) || []
    );
  }, [
    order?.sl_trigger_price,
    order?.tp_trigger_price,
    order?.average_open_price,
    orders?.rows?.length,
    asset?.symbol,
  ]);

  const updatePositions = useCallback(() => {
    const chart = chartRef.current;
    if (chart)
      try {
        const hasPositionsChanged =
          relevantPositions.length !== prevPositionsRef.current.length ||
          relevantPositions.some((newPos: any, index: number) => {
            const oldPos: any = prevPositionsRef.current[index];
            return (
              !oldPos ||
              newPos.average_open_price !== oldPos.average_open_price ||
              newPos.tp_trigger_price !== oldPos.tp_trigger_price ||
              newPos.sl_trigger_price !== oldPos.sl_trigger_price ||
              newPos.position_qty !== oldPos.position_qty
            );
          });

        const areLinesMissing = Object.keys(chartLines).length === 0;
        console.log("orderorder", orders);
        if (
          !hasPositionsChanged &&
          !areLinesMissing &&
          Object.keys(chartLines).length === relevantPositions.length
        ) {
          console.log("No changes detected, skipping update");
          return;
        }

        (prevPositionsRef as any).current = relevantPositions;

        Object.values(chartLines).forEach((line: any) => line.remove());

        const newChartLines: { [key: string]: any } = {};

        relevantPositions?.forEach((position: any) => {
          if (position.symbol !== asset?.symbol) return;
          const openPriceLineId = `open_${position?.algo_order?.algo_order_id}`;

          const openPriceLine = chart
            .createOrderLine()
            .setText("Open Price")
            .setPrice(position?.average_open_price || 150)
            .setLineWidth(1)
            .setQuantity(position?.position_qty)
            .setBodyTextColor("#000")
            .setBodyBackgroundColor("#836EF9")
            .setBodyBorderColor("#836EF9")
            .setBodyTextColor("#FFF")
            .setLineColor("#836EF9")
            .setQuantityBackgroundColor("#836EF9")
            .setQuantityBorderColor("#836EF9");
          newChartLines[openPriceLineId] = openPriceLine;

          if (position.tp_trigger_price) {
            const tpLineId = `tp_${position?.algo_order?.algo_order_id}`;
            const tpLine = chart
              .createOrderLine()
              .setText("Take Profit")
              .setPrice(position.tp_trigger_price || 150)
              .setLineWidth(1)
              .setQuantity("")
              .setBodyTextColor("#000")
              .setBodyBackgroundColor("#427af4")
              .setBodyBorderColor("#427af4")
              .setBodyTextColor("#FFF")
              .setLineColor("#427af4");
            newChartLines[tpLineId] = tpLine;
          }

          if (position.sl_trigger_price) {
            const slLineId = `sl_${position?.algo_order?.algo_order_id}`;
            const slLine = chart
              .createOrderLine()
              .setText("Stop Loss")
              .setPrice(position?.sl_trigger_price || 150)
              .setLineWidth(1)
              .setQuantity("")
              .setBodyTextColor("#000")
              .setBodyBackgroundColor("#F5921A")
              .setBodyBorderColor("#F5921A")
              .setBodyTextColor("#FFF")
              .setLineColor("#F5921A");
            newChartLines[slLineId] = slLine;
          }
        });

        if ((pendingPosition?.length as number) > 0) {
          pendingPosition.forEach((entry) => {
            const pendingLineId = `pending_${entry?.order_id}`;
            const pendingLine = chart
              .createOrderLine()
              .setText("Limit order")
              .setPrice(entry?.price || 150)
              .setLineWidth(1)
              .setQuantity("")
              .setBodyTextColor("#000")
              .setBodyBackgroundColor("#1c5e57")
              .setBodyBorderColor("#1c5e57")
              .setBodyTextColor("#FFF")
              .setLineColor("#1c5e57")
              .setLineStyle(1);
            newChartLines[pendingLineId] = pendingLine;
          });
        }

        setChartLines(newChartLines);
      } catch (e) {
        console.error("Error updating chart lines:", e);
      }
  }, [relevantPositions, asset?.symbol, chartLines]);

  useEffect(() => {
    if (chartRef.current && isChartReady) {
      updatePositions();
    }
  }, [
    order?.sl_trigger_price,
    order?.tp_trigger_price,
    order?.average_open_price,
    orders?.rows?.length,
    params?.perp,
    asset?.symbol,
    isChartReady,
    pendingPosition,
  ]);

  useEffect(() => {
    initChart();
    return () => {
      if (chartRef.current) {
        chartRef.current = null;
      }
    };
  }, [asset?.symbol, custom_css_url, mobile, initChart]);

  return (
    <div className="relative w-full chart">
      <div
        className={cn(
          `absolute z-10 bg-secondary w-full transition-all duration-200 ease-in-out h-full`,
          isChartLoading ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="w-full h-full flex items-center justify-center">
          <img src="/loader/loader.gif" className="w-[150px]" alt="Loading" />
        </div>
      </div>
      <div className={cn(`w-full h-full`, className)} ref={ref} />
    </div>
  );
};

export default TradingViewChart;
