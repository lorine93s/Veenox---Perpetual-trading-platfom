import { TradingView } from "@orderly.network/trading-view";
import { FC } from "react";

export const AdvancedChart: FC<{ symbol: string }> = ({ symbol }) => {
  return (
    <div className="w-full min-h-[35rem] [&_iframe]:min-h-[35rem]">
      <TradingView
        symbol={symbol}
        libraryPath="/static/charting_library/"
        tradingViewScriptSrc="/static/charting_library/charting_library.js"
        tradingViewCustomCssUrl="/static/pro.css"
        loadingElement={
          <div className="w-full h-full bg-secondary flex items-center justify-center">
            <img src="/loader/loader.gif" className="w-[150px]" />
          </div>
        }
        overrides={{
          "mainSeriesProperties.candleStyle.borderDownColor": "#DC2140",
          "mainSeriesProperties.candleStyle.borderUpColor": "#1F8040",

          "mainSeriesProperties.candleStyle.downColor": "#DC2140",
          "mainSeriesProperties.candleStyle.upColor": "#1F8040",

          "mainSeriesProperties.candleStyle.wickDownColor": "#DC2140",
          "mainSeriesProperties.candleStyle.wickUpColor": "#1F8040",

          "paneProperties.background": "#101418",
          "paneProperties.backgroundType": "solid",
          "paneProperties.separatorColor": "#164165",

          "paneProperties.horzGridProperties.color": "#161B22",
          "paneProperties.vertGridProperties.color": "#161B22",
          "paneProperties.legendProperties.showSeriesTitle": "false",
        }}
      />
    </div>
  );
};
