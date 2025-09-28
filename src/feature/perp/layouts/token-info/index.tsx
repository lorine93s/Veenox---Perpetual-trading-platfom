import { Popover, PopoverContent, PopoverTrigger } from "@/lib/shadcn/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/lib/shadcn/tooltip";
import { FavoriteProps, FuturesAssetProps } from "@/models";
import {
  formatSymbol,
  get24hChange,
  getFormattedAmount,
  getRemainingTime,
  getTokenPercentage,
} from "@/utils/misc";
import { useTickerStream } from "@orderly.network/hooks";
import { useEffect, useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { PairSelector } from "./tooltip";

type TokenInfoProps = {
  asset: FuturesAssetProps;
  params: FavoriteProps;
};

export const TokenInfo = ({ asset: assetBuffer, params }: TokenInfoProps) => {
  const marketInfo = useTickerStream(assetBuffer?.symbol);

  const [lastPriceInfo, setLastPriceInfo] = useState({
    last_price: assetBuffer?.mark_price,
    price_color: "text-white",
  });

  const handleLastPriceUpdate = () => {
    if (marketInfo.mark_price > lastPriceInfo.last_price) {
      setLastPriceInfo((prev) => ({
        ...prev,
        price_color: "text-green",
      }));
      setTimeout(
        () =>
          setLastPriceInfo((prev) => ({
            ...prev,
            price_color: "text-white",
          })),
        1000
      );
    } else if (marketInfo.mark_price < lastPriceInfo.last_price) {
      setLastPriceInfo((prev) => ({
        ...prev,
        price_color: "text-red",
      }));
      setTimeout(
        () =>
          setLastPriceInfo((prev) => ({
            ...prev,
            price_color: "text-white",
          })),
        1000
      );
    }
  };

  useEffect(() => {
    if (!marketInfo?.mark_price) return;
    handleLastPriceUpdate();
    if (marketInfo?.mark_price !== lastPriceInfo.last_price) {
      setLastPriceInfo((prev) => ({
        ...prev,
        last_price: marketInfo?.mark_price,
      }));
    }
  }, [marketInfo]);

  const priceChange = get24hChange(
    marketInfo?.["24h_open"],
    marketInfo?.["24h_close"]
  );
  const fundingChange = get24hChange(
    marketInfo?.est_funding_rate,
    marketInfo?.last_funding_rate
  );

  const pred_funding_rate =
    ((marketInfo?.last_funding_rate + marketInfo?.est_funding_rate) / 2) *
      100 || 0;

  const getColorFromChangePercentage = (
    percentage: string,
    isTest: boolean
  ) => {
    if (percentage > "0") return "text-green";
    else if (percentage < "0") {
      return "text-red";
    } else "text-white";
  };
  const colorPriceChange = getColorFromChangePercentage(
    priceChange.formatPercentage,
    false
  );
  const colorFundingChange = getColorFromChangePercentage(
    JSON.stringify(pred_funding_rate),
    true
  );

  return (
    <div className="flex items-center w-full h-[55px] sm:h-[65px] px-3 border-b border-borderColor whitespace-nowrap overflow-x-scroll no-scrollbar">
      <div className="flex items-center gap-3 relative text-white h-full">
        <Popover>
          <PopoverTrigger className="h-full min-w-fit">
            <div className="flex items-center mr-1 whitespace-nowrap w-fit min-w-fit border-r border-borderColor h-full cursor-pointer">
              <img
                className="sm:w-[28px] sm:h-[28px] w-[22px] h-[22px] bg-gray-500 rounded-full"
                src={`https://oss.orderly.network/static/symbol_logo/${formatSymbol(
                  assetBuffer?.symbol,
                  true
                )}.png`}
              />
              <p className="text-white text-base sm:text-lg ml-2 sm:ml-3">
                {formatSymbol(assetBuffer.symbol)}
              </p>
              <IoChevronDown className="text-white text-base sm:text-lg min-w-[18px] ml-1" />
              <div className="w-3 min-w-3 md:w-4 md:min-w-4 h-full" />
            </div>
          </PopoverTrigger>
          <PopoverContent
            sideOffset={0}
            className="md:transform-x-[10px] w-[330px] md:w-[550px] bg-secondary border border-borderColor shadow-2xl "
          >
            <PairSelector params={params as FavoriteProps as never} />
          </PopoverContent>
        </Popover>
        <div className="flex items-center overflow-x-scroll no-scrollbar min-w-[800px]">
          <p
            className={`${lastPriceInfo.price_color} transition-color duration-200 ease-in-out text-base sm:text-lg mr-4`}
          >
            {getFormattedAmount(marketInfo?.mark_price) || "Loading..."}
          </p>
          <div className="flex gap-6">
            <div>
              <p className="text-xs text-font-60">24h Change </p>
              <span className="text-xs flex items-center mt-1 text-font-60 font-medium">
                <p className={`${colorPriceChange} `}>
                  {getFormattedAmount(priceChange.difference) || "0.00"}
                </p>
                <p className="mx-0.5">/</p>

                <p className={`${colorPriceChange}`}>
                  {priceChange.formatPercentage || "0.00"}%
                </p>
              </span>
            </div>
            <div>
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <div className="flex items-center text-xs text-font-60">
                      <p className="underline">Mark</p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="h-fit overflow-clip max-w-[220px] w-full p-2 bg-secondary border border-borderColor shadow-xl whitespace-pre-wrap"
                  >
                    Used for margining, computing unrealized PnL, liquidations,
                    and triggering TP/SL orders.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <p className="text-xs mt-1 text-white font-medium">
                {marketInfo?.mark_price}
              </p>
            </div>
            {/* 
Open interest = The total outstanding position of all users on this contract
Funding rate =

Used for margining, computing unrealized PnL, liquidations, and triggering TP/SL orders. */}
            <div>
              <p className="text-xs text-font-60">Index</p>
              <p className="text-xs mt-1 text-white font-medium">
                {marketInfo?.index_price}
              </p>
            </div>
            <div className="relative">
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <div className="flex items-center text-xs text-font-60">
                      <p className="underline">24h Volume</p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="h-fit overflow-clip w-[180px] p-2 bg-secondary border border-borderColor shadow-xl whitespace-pre-wrap"
                  >
                    24 hour total trading volume on the Orderly Network.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span className="flex items-center mt-1">
                <img
                  className="h-[13px] w-[13px] mr-1.5"
                  src="/logo/orderly.svg"
                  alt="Orderly Network logo"
                />
                <p className="text-xs  text-white font-medium">
                  {getFormattedAmount(marketInfo?.["24h_amount"])}
                </p>
              </span>
            </div>
            <div>
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <div className="flex items-center text-xs text-font-60">
                      <p className="underline">Pred. funding rate</p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="h-fit overflow-clip max-w-[220px] w-full p-2 bg-secondary border border-borderColor shadow-xl whitespace-pre-wrap"
                  >
                    The funding rate is the rate at which long positions pay
                    short positions, or vice versa, to maintain balance between
                    supply and demand in the derivatives market.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span className="text-xs box-border h-fit flex items-center mt-1 font-medium">
                <p className={colorFundingChange}>
                  {getTokenPercentage(pred_funding_rate) || "0.00"}%
                </p>
                <p className="mx-0.5 text-font-60">/</p>
                <p className="text-white">
                  {getRemainingTime(marketInfo?.next_funding_time) ||
                    "00:00:00"}
                </p>
              </span>
            </div>
            <div>
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <div className="flex items-center text-xs text-font-60">
                      <p className="underline">Open interest </p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="h-fit overflow-clip max-w-[220px] w-full p-2 bg-secondary border border-borderColor shadow-xl whitespace-pre-wrap"
                  >
                    The total outstanding position of all users on this contract
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <p className="text-xs mt-1 text-white">
                {getFormattedAmount(marketInfo?.open_interest)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
