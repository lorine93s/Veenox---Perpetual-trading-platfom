import { useGeneralContext } from "@/context";
import { Popover, PopoverContent, PopoverTrigger } from "@/lib/shadcn/popover";
import { FuturesAssetProps, TradeExtension } from "@/models";
import { cn } from "@/utils/cn";
import { getFormattedAmount, getStyleFromDevice } from "@/utils/misc";
import {
  useMarketTradeStream,
  useOrderbookStream,
} from "@orderly.network/hooks";
import { useRef, useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { TradeSection } from "./trade-section";

enum OrderbookSection {
  ORDERBOOK,
  TRADE_HISTORY,
}

type OrderbookProps = {
  asset: FuturesAssetProps;
  isMobile?: boolean;
  isMobileOpenTrade?: boolean;
};

type AsksBidsType = "asks" | "bids";

export const Orderbook = ({
  asset,
  isMobile = false,
  isMobileOpenTrade = false,
}: OrderbookProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { mobileActiveSection, setMobileActiveSection } = useGeneralContext();
  const [activeOrderbookSymbol, setActiveOrderbookSymbol] = useState("USD");
  const [activeSection, setActiveSection] = useState(
    OrderbookSection.ORDERBOOK
  );

  const [data, { isLoading, onDepthChange, depth, allDepths }] =
    useOrderbookStream(asset?.symbol, undefined, {
      level:
        isMobileOpenTrade || isMobile
          ? 8
          : (sectionRef?.current?.clientHeight as number) > 950
          ? 18
          : (sectionRef?.current?.clientHeight as number) > 900
          ? 16
          : (sectionRef?.current?.clientHeight as number) > 800
          ? 14
          : 12,
      padding: false,
    });
  const bestBid: number | undefined = (data?.bids as [number[]])[0]?.[0];
  const bestAsk = (data?.asks as [])[(data.asks as []).length - 1]?.[0];
  const spread = bestAsk - bestBid;

  const getWidthFromVolume = (type: AsksBidsType): number[] => {
    const is_asks = type === "asks";
    const typeData = data[type];
    if (typeData) {
      const arr = [];
      const maxValue = typeData?.[is_asks ? 0 : typeData.length - 1]?.[3];
      for (let i = 0; i < typeData.length; i++) {
        const [, , , totalUSDC] = typeData[i];
        const widthPercentage = (totalUSDC / maxValue) * 100;
        arr.push(widthPercentage);
      }
      return arr;
    }
    return [];
  };
  const asksWidth = getWidthFromVolume("asks");
  const bidsWidth = getWidthFromVolume("bids");

  const { data: trades, isLoading: isTradesLoading } = useMarketTradeStream(
    asset?.symbol
  );

  return (
    <section
      ref={sectionRef}
      className={`w-full md:max-h-full ${
        isMobileOpenTrade ? "h-auto max-h-full" : "h-[450px] max-h-[450px]"
      } md:h-full  overflow-y-hidden md:min-w-[250px] `}
    >
      {isMobileOpenTrade || isMobile ? null : (
        <>
          <div className="flex items-center w-full h-[44px] relative">
            <button
              className="w-1/2 h-full text-white text-sm"
              onClick={() => setActiveSection(0)}
            >
              Orderbook
            </button>
            <button
              className="w-1/2 h-full text-white text-sm"
              onClick={() => setActiveSection(1)}
            >
              Trade History
            </button>
          </div>
          <div className="bg-terciary h-[1px] w-full relative">
            <div
              className={`h-[1px] w-1/2 bottom-0 transition-all duration-200 ease-in-out bg-font-80 absolute ${
                !activeSection ? "left-0" : "left-1/2"
              }`}
            />
          </div>
        </>
      )}
      {activeSection === OrderbookSection.TRADE_HISTORY ? null : (
        <div className="flex items-center justify-between py-1.5">
          <Popover>
            <PopoverTrigger className="h-full min-w-fit">
              <button
                className="rounded text-[12px] flex items-center
             justify-center min-w-[50px] pl-1 text-white font-medium h-[24px] ml-1 w-fit"
              >
                {depth}
                <IoChevronDown className="text-white text-xs min-w-[18px] ml-[1px]" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              sideOffset={0}
              className="flex flex-col p-1.5 z-[102] w-fit whitespace-nowrap bg-secondary border border-borderColor shadow-xl"
            >
              {allDepths?.map((entry, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (onDepthChange) onDepthChange(entry);
                  }}
                  className={`h-[22px] ${
                    depth === entry ? "text-base_color font-bold" : "text-white"
                  } w-fit px-1 text-xs`}
                >
                  {entry}
                </button>
              ))}
            </PopoverContent>
          </Popover>
        </div>
      )}
      {(activeSection === OrderbookSection.ORDERBOOK &&
        (mobileActiveSection === "Orderbook" || !mobileActiveSection)) ||
      isMobileOpenTrade ? (
        <div
          // max-h-[670px]  overflow-y-scroll
          className={`relative h-full md:h-calc-full-button ${
            isMobileOpenTrade ? "min-w-[140px] w-full" : "w-auto"
          }  sm:w-auto`}
        >
          {!data?.asks?.length && !data?.bids?.length ? (
            <div className="w-full h-full flex items-center justify-center">
              <img src="/loader/loader.gif" className="w-[150px]" />
            </div>
          ) : (
            <table className="w-full h-calc-full-market">
              <thead>
                <tr className="text-font-60 text-xs">
                  <th className="pl-2.5 text-start py-1 font-normal">Price</th>
                  {isMobileOpenTrade ? null : (
                    <th className="text-end font-normal">Size</th>
                  )}
                  <th className="pr-2.5 text-end font-normal"></th>
                  {isMobileOpenTrade ? null : (
                    <th className="pr-2.5 text-end font-normal">Total $</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {(data?.asks || [])?.map((ask: number[], i: number) => {
                  return (
                    <tr key={i} className="text-font-80 text-xs relative">
                      {Array.from({ length: 4 }).map((_, j) => {
                        const className = getStyleFromDevice(j, "");
                        const value =
                          j === 0 ? ask[j] : getFormattedAmount(ask[j]);
                        if (isMobileOpenTrade && (j === 0 || j === 2))
                          return (
                            <td
                              key={j + className}
                              className={cn(
                                className,
                                j === 0 ? "text-red" : ""
                              )}
                            >
                              {value}
                            </td>
                          );
                        if (!isMobileOpenTrade)
                          return (
                            <td
                              key={j + className}
                              className={cn(
                                className,
                                j === 0 ? "text-red" : ""
                              )}
                            >
                              {value}
                            </td>
                          );
                      })}

                      <td
                        className="absolute left-0 h-[90%] max-h-[30px] bg-red-opacity-10 z-0 transition-all duration-150 ease-linear"
                        style={{ width: `${asksWidth[i]}%` }}
                      />
                    </tr>
                  );
                })}
                <tr>
                  <td
                    colSpan={4}
                    className="px-2.5 border-y border-borderColor-DARK bg-terciary"
                  >
                    <div className="whitespace-nowrap flex justify-between items-center">
                      <p className="text-sm text-white font-bold">
                        {getFormattedAmount(data?.middlePrice as any, true) ||
                          0}
                      </p>
                      <span className="text-[13px] text-white hidden sm:flex">
                        Spread
                      </span>
                      <span className="text-xs sm:text-[13px] text-white">
                        {spread.toFixed(3)}
                      </span>
                    </div>
                  </td>
                </tr>
                {(data?.bids || []).map((bid: number[], i: number) => {
                  return (
                    <tr key={i} className="text-font-80 text-xs relative">
                      {Array.from({ length: 4 }).map((_, j) => {
                        const className = getStyleFromDevice(j, "");
                        const value =
                          j === 0 ? bid[j] : getFormattedAmount(bid[j]);
                        if (isMobileOpenTrade && (j === 0 || j === 2))
                          return (
                            <td
                              key={j + className}
                              className={cn(
                                className,
                                j === 0 ? "text-green" : ""
                              )}
                            >
                              {value}
                            </td>
                          );
                        if (!isMobileOpenTrade)
                          return (
                            <td
                              key={j + className}
                              className={cn(
                                className,
                                j === 0 ? "text-green" : ""
                              )}
                            >
                              {value}
                            </td>
                          );
                      })}

                      <td
                        className="absolute left-0 h-[90%] bg-green-opacity-10 z-0 transition-all duration-150 ease-linear"
                        style={{ width: `${bidsWidth[i]}%` }}
                      />
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <TradeSection
          asset={asset}
          trades={
            trades?.filter((e, i) =>
              (sectionRef?.current?.clientHeight as number) > 800
                ? i < 32
                : i < 28
            ) as TradeExtension[]
          }
          isLoading={isTradesLoading}
        />
      )}
    </section>
  );
};
