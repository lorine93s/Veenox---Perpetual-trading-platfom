"use client";
import { OrderlyConfigProvider } from "@orderly.network/hooks";

type OrderlyProviderProps = {
  children: React.ReactNode;
};

export default function OrderlyProvider({ children }: OrderlyProviderProps) {
  return (
    <OrderlyConfigProvider brokerId="veeno_dex" networkId="mainnet">
      {children}
    </OrderlyConfigProvider>
  );
}
