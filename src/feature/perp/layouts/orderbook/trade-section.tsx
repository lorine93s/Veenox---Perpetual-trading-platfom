import { FuturesAssetProps, TradeExtension } from "@/models";
import { getFormattedAmount, getFormattedDate } from "@/utils/misc";

type TradeSectionProps = {
  asset: FuturesAssetProps;
  trades: TradeExtension[];
  isLoading?: boolean;
};

export const TradeSection = ({
  asset,
  trades,
  isLoading,
}: TradeSectionProps) => {
  return (
    <div className="h-[467px] md:h-calc-full-button overflow-y-scroll no-scrollbar relative">
      {!trades?.length ? (
        <div className="w-full h-[450px] md:h-full flex items-center justify-center">
          <img src="/loader/loader.gif" className="w-[150px]" />
        </div>
      ) : (
        <table className="w-full h-full">
          <thead>
            <tr className="text-font-60 text-xs font-normal sticky top-0 bg-secondary border-b border-borderColor-DARK ">
              <th className="pl-2.5 text-start py-1 font-normal">Price</th>
              <th className="text-end font-normal">Size</th>
              <th className="pr-2.5 text-end font-normal">Time</th>
            </tr>
          </thead>
          <tbody>
            {trades?.map((trade, i: number) => (
              <tr key={i} className="text-font-80 text-xs ">
                <td
                  className={`pl-2.5 ${
                    trade.side === "BUY" ? "text-green" : "text-red"
                  }`}
                >
                  {getFormattedAmount(trade.price)}
                </td>
                <td
                  className={`text-end ${
                    trade.side === "BUY" ? "text-green" : "text-red"
                  }`}
                >
                  {trade.size}
                </td>
                <td className="text-end pr-2.5">
                  {getFormattedDate(trade.ts)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
