import { API, OrderEntity } from "@orderly.network/types";

export interface FuturesAssetFetchProps {
  success: boolean;
  timestamp: number;
  data: {
    rows: [
      {
        symbol: string;
        index_price: number;
        mark_price: number;
        sum_unitary_funding: number;
        est_funding_rate: number;
        last_funding_rate: number;
        next_funding_time: number;
        open_interest: string;
        "24h_open": number;
        "24h_close": number;
        "24h_high": number;
        "24h_low": number;
        "24h_amount": number;
        "24h_volume": number;
      }
    ];
  };
}

export interface FuturesAssetProps {
  symbol: string;
  index_price: number;
  mark_price: number;
  sum_unitary_funding: number;
  est_funding_rate: number;
  last_funding_rate: number;
  next_funding_time: number;
  open_interest: string;
  "24h_open": number;
  "24h_close": number;
  "24h_high": number;
  "24h_low": number;
  "24h_amount": number;
  "24h_volume": number;
}

export interface MarketTickerProps extends FuturesAssetProps {
  "24h_volumn": number;
  change: number;
  isFavorite: boolean;
  leverage: number;
  tabs: string[];
}

export interface TradesProps {
  side: string;
  price: number;
  size: number;
  ts: number;
}

export interface CustomBarProps {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface BarsSymbolInfoProps {
  base_name: string[];
  data_status: string;
  description: string;
  exchange: string | undefined;
  full_name: string;
  has_intraday: boolean;
  intraday_multipliyers: string[];
  legs: string[];
  minmov: number;
  name: string;
  pricescale: number;
  pro_name: string;
  session: string;
  supported_resolution: string[];
  ticker: string;
  type: string;
  volume_precision: number;
}

export interface TradeExtension extends API.Trade {
  price: number;
  size: number;
}

export type ContextTradeInfo = {
  type: string;
  side: string;
  size: number;
  price: number | null;
  reduce_only: boolean;
  tp_sl: boolean;
  tp: number | null;
  sl: number | null;
  leverage: number;
};

export type MobileActiveSectionType = "Chart" | "Orderbook" | "Trades" | null;

export type FavoriteProps = {
  [key: string]: {
    addToHistory: () => void;
    data: MarketTickerProps[];
    favortieTabs: { name: string; id: number }[];
    updateFavoriteTabs: () => void;
    updateSymbolFavoriteState: () => void;
  };
};

export interface OrderEntryReturn {
  onSubmit: (values: OrderEntity) => Promise<any>;
  maxQty: number;
  freeCollateral: number;
  markPrice: number;
  estLiqPrice?: number | null;
  estLeverage?: number | null;

  symbolConfig: API.SymbolExt;
  helper: {
    calculate: (
      values: Partial<OrderEntity>,
      field: keyof OrderEntity,
      value: any
    ) => Partial<OrderEntity>;
    validator: (values: any) => any;
  };
}

export type Inputs = {
  direction: "BUY" | "SELL";
  type: "MARKET" | "LIMIT" | "STOPLIMIT";
  triggerPrice?: string;
  price?: string;
  quantity?: string;
  reduce_only: boolean;
  tp_trigger_price?: string;
  sl_trigger_price?: string;
};
