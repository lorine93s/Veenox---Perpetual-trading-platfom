"use client";
import { ContextTradeInfo, Inputs, MobileActiveSectionType } from "@/models";
import React, {
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";

interface GeneralContextProps {
  showMobileTradeCreator: boolean;
  setShowMobileTradeCreator: Dispatch<SetStateAction<boolean>>;
  tradeInfo: ContextTradeInfo;
  setTradeInfo: Dispatch<SetStateAction<ContextTradeInfo>>;
  mobileActiveSection: MobileActiveSectionType;
  setMobileActiveSection: Dispatch<SetStateAction<MobileActiveSectionType>>;
  isChartLoading: boolean;
  setIsChartLoading: Dispatch<SetStateAction<boolean>>;
  isWalletConnectorOpen: boolean;
  setIsWalletConnectorOpen: Dispatch<SetStateAction<boolean>>;
  isEnableTradingModalOpen: boolean;
  setIsEnableTradingModalOpen: Dispatch<SetStateAction<boolean>>;
  isDeposit: boolean;
  setIsDeposit: Dispatch<SetStateAction<boolean>>;
  TPSLOpenOrder: any;
  setTPSLOpenOrder: Dispatch<SetStateAction<any>>;
  orderPositions: Inputs[];
  setOrderPositions: Dispatch<SetStateAction<Inputs[]>>;
}

const INITIAL_TRADE_INFO = {
  type: "Market",
  side: "Buy",
  size: 100, // Percentage
  price: 0,
  reduce_only: false,
  tp_sl: false,
  tp: 0,
  sl: 0,
  leverage: 1,
};

export const GeneralContext = React.createContext({} as GeneralContextProps);

export const useGeneralContext = () => useContext(GeneralContext);

export const GeneralProvider: FC<PropsWithChildren> = ({ children }) => {
  const [showMobileTradeCreator, setShowMobileTradeCreator] = useState(false);
  const [tradeInfo, setTradeInfo] = useState(INITIAL_TRADE_INFO);
  const [mobileActiveSection, setMobileActiveSection] = useState(null);
  const [isChartLoading, setIsChartLoading] = useState(true);
  const [isWalletConnectorOpen, setIsWalletConnectorOpen] = useState(false);
  const [isDeposit, setIsDeposit] = useState(true);
  const [isEnableTradingModalOpen, setIsEnableTradingModalOpen] =
    useState(false);
  const [orderPositions, setOrderPositions] = useState([]);
  const [TPSLOpenOrder, setTPSLOpenOrder] = useState(null);
  const value = useMemo(
    () => ({
      showMobileTradeCreator,
      setShowMobileTradeCreator,
      tradeInfo,
      setTradeInfo,
      mobileActiveSection,
      setMobileActiveSection,
      isChartLoading,
      setIsChartLoading,
      isWalletConnectorOpen,
      setIsWalletConnectorOpen,
      isEnableTradingModalOpen,
      setIsEnableTradingModalOpen,
      isDeposit,
      setIsDeposit,
      TPSLOpenOrder,
      setTPSLOpenOrder,
      orderPositions,
      setOrderPositions,
    }),
    [
      showMobileTradeCreator,
      isWalletConnectorOpen,
      tradeInfo,
      mobileActiveSection,
      isChartLoading,
      isEnableTradingModalOpen,
      isDeposit,
      TPSLOpenOrder,
      orderPositions,
    ]
  );

  return (
    <GeneralContext.Provider value={value as any}>
      {children}
    </GeneralContext.Provider>
  );
};
