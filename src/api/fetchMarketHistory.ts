type ParamsType = {
  symbol: string;
  timeframe: string;
  from: number;
  to: number;
};

export const fetchMarketHistory = async (params: ParamsType) => {
  const { symbol, timeframe, from, to } = params;
  const query = await fetch(
    `https://api-evm.orderly.org/v1/tv/history?symbol=${symbol}&resolution=${timeframe}&from=${from}&to=${to}`
  );
  const response = await query.json();
  return response;
};
