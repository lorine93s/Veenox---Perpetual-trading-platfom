"use client";
import { useGeneralContext } from "@/context";
import { EnableTrading } from "@/layouts/enable-trading";
import { FavoriteProps, FuturesAssetProps } from "@/models";
import {
  useCollateral,
  useHoldingStream,
  useMarkets,
  useWalletConnector,
} from "@orderly.network/hooks";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Favorites } from "./layouts/favorites";
import { MobileOpenTrade } from "./layouts/mobile-open-trade";
import { MobilePnL } from "./layouts/mobile-pnl";
import { MobileSectionSelector } from "./layouts/mobile-section-selector";
import { OpenTrade } from "./layouts/open-trade";
import { Orderbook } from "./layouts/orderbook";
import { Position } from "./layouts/position";
import { TokenInfo } from "./layouts/token-info";

const TradingViewChart = dynamic(() => import("./layouts/chart"), {
  ssr: false,
});

type PerpProps = {
  asset: FuturesAssetProps;
};
enum MarketsType {
  FAVORITES = 0,
  RECENT = 1,
  ALL = 2,
}

export const Perp = ({ asset }: PerpProps) => {
  const wallet = useWalletConnector();
  const chartRef = useRef<HTMLDivElement>(null);
  const [colWidths, setColWidths] = useState([8, 2]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [topHeight, setTopHeight] = useState(70);
  const { mobileActiveSection, setIsChartLoading } = useGeneralContext();
  const rowUpRef = useRef<HTMLDivElement>(null);
  const { usdc } = useHoldingStream();
  const orderbookRef = useRef<HTMLDivElement>(null);
  const useParam = useParams();
  const {
    totalCollateral,
    freeCollateral: freeCollat,
    totalValue,
    availableBalance,
    unsettledPnL,
    positions,
    accountInfo,
  } = useCollateral({
    dp: 2,
  });
  const [
    data,
    {
      addToHistory,
      favoriteTabs,
      updateFavoriteTabs,
      updateSymbolFavoriteState,
    },
  ]: any = useMarkets(MarketsType.ALL);

  const handleMouseDown = (index: number, e: any) => {
    if (window.innerWidth < 1268) return;

    const startX = e.clientX;
    const startWidths = [...colWidths];
    const containerWidth = (
      containerRef?.current as any
    ).getBoundingClientRect().width;

    const onMouseMove = (e: any) => {
      const dx = e.clientX - startX;
      const deltaFraction = (dx / containerWidth) * 10;
      const newWidths = [...startWidths];

      if (index === 0) {
        newWidths[0] = Math.max(startWidths[0] + deltaFraction, 1);
        newWidths[1] = Math.max(startWidths[1] - deltaFraction, 1);
      } else if (index === 1) {
        newWidths[1] = Math.max(startWidths[1] + deltaFraction, 1);
        newWidths[2] = Math.max(startWidths[2] - deltaFraction, 1);
      }
      setColWidths(newWidths);
    };

    const onMouseUp = () => {
      (chartRef?.current as any).style.pointerEvents = "auto";
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    (chartRef?.current as any).style.pointerEvents = "none";
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const handleMouse = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (window.innerWidth < 1268) return;
    const startY = e.clientY;
    const containerHeight = (
      containerRef.current as HTMLDivElement
    ).getBoundingClientRect().height;
    const startTopHeight = (topHeight / 100) * containerHeight;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = e.clientY - startY;
      const newTopHeight = startTopHeight + deltaY;
      const newTopHeightPercent = (newTopHeight / containerHeight) * 100;
      let rowUpHeight = rowUpRef.current?.clientHeight || 0;

      if (rowUpHeight > 720) {
        setTopHeight(Math.max(Math.min(newTopHeightPercent, 90), 10));
      } else {
        const isMovingDown = deltaY > 0;
        if (isMovingDown)
          setTopHeight(Math.max(Math.min(newTopHeightPercent, 90), 10));
      }
    };

    const handleMouseUp = () => {
      (chartRef?.current as any).style.pointerEvents = "auto";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    (chartRef?.current as any).style.pointerEvents = "none";
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    setTimeout(() => setIsChartLoading(false), 3000);
    const handleResize = () => {
      if (window.innerWidth <= 600) {
        setColWidths([1, 1]);
      } else if (window.innerWidth <= 1200) {
        setColWidths([3, 1]);
      } else {
        setColWidths([8, 2]);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [widths, setWidths] = useState([90, 10]);
  const resizerRef = useRef(null);

  const handleLastBoxResize = (e: any) => {
    e.preventDefault();
    document.addEventListener("mousemove", handleLastBoxMove);
    document.addEventListener("mouseup", handleMLastBoxouseUp);
  };

  const handleLastBoxMove = (e: any) => {
    const container = containerRef.current;
    const resizer = resizerRef.current;
    if (!container || !resizer) return;

    const containerRect = container.getBoundingClientRect();

    const newWidth1 =
      ((e.clientX - containerRect.left) / containerRect.width) * 100;
    const newWidth2 = 100 - newWidth1;

    if (newWidth1 >= 10 && newWidth1 <= 90 && newWidth2 <= 25) {
      setWidths([newWidth1, newWidth2]);
    }
  };

  const handleMLastBoxouseUp = () => {
    document.removeEventListener("mousemove", handleLastBoxMove);
    document.removeEventListener("mouseup", handleMLastBoxouseUp);
  };

  const params = {
    addToHistory,
    data,
    favoriteTabs,
    updateFavoriteTabs,
    updateSymbolFavoriteState,
  };

  return (
    <div ref={containerRef} className="container  w-full max-w-full">
      <EnableTrading />
      {/* <AdvancedChart symbol={asset?.symbol} /> */}
      <div className="w-full flex h-full">
        <div
          style={{
            width: window.innerWidth > 1168 ? `${widths[0]}%` : "100%",
          }}
        >
          <div
            ref={rowUpRef}
            className="relative w-full border-b border-borderColor topPane md:flex-grow "
            style={{
              height: `${window.innerWidth < 1168 ? "auto" : topHeight}%`,
              zIndex: 1,
            }}
          >
            <div
              className="grid h-full"
              style={{
                gridTemplateColumns: colWidths.map((w) => `${w}fr`).join(" "),
              }}
            >
              <div
                className="border-r border-borderColor overflow-x-hidden no-scrollbar md:min-w-[400px] lg:min-w-[700px]"
                ref={chartRef}
              >
                {!mobileActiveSection ? (
                  <>
                    <Favorites props={params as FavoriteProps as never} />
                    <TokenInfo params={params} asset={asset} />
                    <MobilePnL />
                    <MobileSectionSelector />
                    <TradingViewChart
                      params={useParam}
                      asset={asset}
                      className={""}
                    />
                  </>
                ) : (
                  <>
                    <TokenInfo params={params} asset={asset} />
                    <MobilePnL />
                    <MobileSectionSelector />
                    <div
                      className={`${
                        mobileActiveSection === "Chart" || !mobileActiveSection
                          ? "block"
                          : "hidden"
                      } bg-green`}
                    >
                      <TradingViewChart
                        params={useParam}
                        asset={asset}
                        className={""}
                      />
                    </div>
                    <div
                      className={`${
                        mobileActiveSection !== "Chart" ? "block" : "hidden"
                      }`}
                    >
                      <Orderbook asset={asset} isMobile />
                    </div>
                  </>
                )}
              </div>
              <div
                className="hidden md:block h-full relative"
                ref={orderbookRef}
              >
                <Orderbook asset={asset} />{" "}
                {window.innerWidth >= 1268 &&
                  colWidths.slice(0, -1).map((_, index) => (
                    <div
                      key={index}
                      className="absolute top-0 bottom-0 w-[10px] resizer z-10"
                      style={{
                        left: "0%",
                      }}
                      onMouseDown={(e) => handleMouseDown(index, e)}
                    />
                  ))}
              </div>
            </div>
          </div>
          <div className="resizerY hidden md:flex" onMouseDown={handleMouse} />
          <div className=" w-full h-auto bottomPane">
            <div className="overflow-x-hidden no-scrollbar">
              <Position asset={asset} />
            </div>
          </div>
        </div>

        <div
          style={{ width: `${widths[1]}%` }}
          className="hidden md:block h-full min-w-[300px] max-w-[500px]  border-l relative border-borderColor "
        >
          {window.innerWidth >= 1268 && (
            <div
              className="resizer hidden md:flex"
              style={{ left: 0 }}
              ref={resizerRef}
              onMouseDown={(e) => handleLastBoxResize(e)}
            />
          )}
          <OpenTrade asset={asset} holding={usdc?.holding} />
        </div>
      </div>

      <MobileOpenTrade asset={asset} holding={usdc?.holding} />
    </div>
  );
};
