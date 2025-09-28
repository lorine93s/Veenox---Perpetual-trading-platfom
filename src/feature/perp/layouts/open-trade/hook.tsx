import { FuturesAssetProps } from "@/models";
import { useMaxQty } from "@orderly.network/hooks";
import { OrderSide } from "@orderly.network/types";

type CreateOrder = {
  asset: FuturesAssetProps;
};

export const CreateOrder = ({ asset }: CreateOrder) => {
  const maxQty: number = useMaxQty(asset?.symbol, OrderSide.BUY);

  return <>IEDIEIDE</>;
};
