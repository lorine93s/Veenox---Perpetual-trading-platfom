"use client";
import { useWS } from "@orderly.network/hooks";
import { useEffect } from "react";
import { FaWifi } from "react-icons/fa6";

export const Footer = () => {
  const ws = useWS();

  useEffect(() => {
    const unsubscribe = ws.subscribe(
      {
        id: "maintenance_status",
        topic: "maintenance_status",
        event: "subscribe",
      },
      {
        onMessage: (data: any) => {
          console.log("datadata", data);
        },
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [ws]);
  return (
    <footer className="h-[35px] max-h-[35px] sm:max-h-[40px] sm:h-[40px] flex items-center justify-between w-full bg-secondary border-t border-borderColor">
      <div className="flex items-center px-2.5">
        <FaWifi className="text-green text-sm mr-2 font-bold" />
        <p className="text-green text-xs sm:text-sm font-bold">Operational</p>
        <div className="h-[30px] w-[1px] bg-borderColor mx-5 sm:block hidden" />
        <p className="text-font-60 text-xs hidden sm:block">
          Join our community
        </p>
      </div>
      <div className="flex items-center px-2.5">
        <p className="text-font-60 text-xs whitespace-nowrap">Powered by</p>
        <img
          className="ml-2"
          src="/logo/orderly-powered.svg"
          alt="Orderly network logo"
        />
      </div>
    </footer>
  );
};
