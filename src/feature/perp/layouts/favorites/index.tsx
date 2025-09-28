import { FavoriteProps } from "@/models";
import { formatSymbol, getTokenPercentage } from "@/utils/misc";
import { useLocalStorage } from "@orderly.network/hooks";
import Link from "next/link";
import { FaStar } from "react-icons/fa";

export const Favorites = ({ props }: FavoriteProps) => {
  const { data } = props;
  const [values, setValues] = useLocalStorage("FAVORITES", []);
  const favorites = data.filter((entry) => values.includes(entry.symbol));

  const get24hChange = (closePrice: number, openPrice: number) => {
    return ((closePrice - openPrice) / openPrice) * 100;
  };

  return (
    <div className="hidden sm:flex items-center justify-between w-full min-h-[38px] sm:min-h-[41px] relative py-1 border-b border-borderColor ">
      <div className="overflow-x-scroll flex items-center px-3 no-scrollbar">
        <FaStar className="text-yellow-500 text-sm mr-1" />
        <div className="h-full flex items-center whitespace-nowrap overflow-x-scroll no-scrollbar">
          {favorites.map((item, index) => {
            const change = get24hChange(item["24h_close"], item["24h_open"]);
            return (
              <button
                key={index}
                className="text-xs text-white h-[28px] sm:h-[32px] flex items-center rounded px-3 hover:bg-terciary"
              >
                <Link
                  className="flex items-center justify-center"
                  href={`/perp/${item.symbol}`}
                >
                  <span>{formatSymbol(item.symbol)}</span>
                  <span
                    className={`${change > 0 ? "text-green" : "text-red"} ml-2`}
                  >
                    {getTokenPercentage(change)}%
                  </span>
                </Link>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
