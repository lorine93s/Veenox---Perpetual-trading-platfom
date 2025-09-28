import { useGeneralContext } from "@/context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/lib/shadcn/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/lib/shadcn/popover";
import { triggerAlert } from "@/lib/toaster";
import { useOrderStream, useTPSLOrder } from "@orderly.network/hooks";
import { useState } from "react";
import { GrPowerReset } from "react-icons/gr";
import { IoChevronDown } from "react-icons/io5";
import { Oval } from "react-loader-spinner";

export const TPSLModal = ({ order }: any) => {
  const [activePnlOrOffset, setActivePnlOrOffset] = useState("$");
  const [error, setError] = useState([""]);
  const [loading, setLoading] = useState(false);
  const { TPSLOpenOrder, setTPSLOpenOrder } = useGeneralContext();
  const position = {
    symbol: TPSLOpenOrder.symbol,
    average_open_price: TPSLOpenOrder.average_open_price,
    position_qty: TPSLOpenOrder.position_qty,
    tp_trigger_price: TPSLOpenOrder.tp_trigger_price,
    sl_trigger_price: TPSLOpenOrder.sl_trigger_price,
    quantity: String(Math.abs(TPSLOpenOrder.position_qty)),
  };
  const [algoOrder, { setValue, submit, errors }] = useTPSLOrder(position, {
    defaultOrder: TPSLOpenOrder.algo_order,
  });
  const [
    orders,
    { cancelAllTPSLOrders, cancelTPSLChildOrder, updateTPSLOrder },
  ] = useOrderStream(TPSLOpenOrder);
  const { setOrderPositions } = useGeneralContext();

  const handleSubmit = async () => {
    setLoading(true);
    if (errors) {
      for (let i = 0; i < Object.entries(errors)?.length; i++) {
        setError((prev) => [
          ...prev,
          Object.entries(errors)?.[i]?.[1]?.message,
        ]);
      }
      setLoading(false);
      return;
    } else setError([""]);
    // const orderId = orders?.find(
    //   (entry) =>
    //     entry.average_executed_price === order.average_open_price &&
    //     entry.quantity === Math.abs(order.position_qty)
    // )?.order_id;
    try {
      await submit();
      triggerAlert("Success", `Your TP/SL has been placed`);
      setTPSLOpenOrder(null);
      setOrderPositions([]);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la soumission de l'ordre:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveTPSL = async (): Promise<void> => {
    try {
      await cancelAllTPSLOrders();
      triggerAlert("Success", "TP/SL has been reset");
      setOrderPositions([]);
      setTPSLOpenOrder(null);
    } catch (e) {
      triggerAlert("Error", "An error happened during cancel tp/sl order");
      setTPSLOpenOrder(null);
    }
  };

  const handleChange = (field: string, value: string): void => {
    if (error) setError([""]);
    setValue(field, value);
  };

  return (
    <Dialog open={TPSLOpenOrder}>
      <DialogContent
        close={() => setTPSLOpenOrder(null)}
        className="max-w-[440px] w-[90%] h-auto max-h-auto flex flex-col gap-0"
      >
        <DialogHeader>
          <DialogHeader>
            <DialogTitle className="pb-5">Edit TP/SL</DialogTitle>
          </DialogHeader>
        </DialogHeader>
        <div className="flex items-center justify-between">
          <p className="text-sm text-white mb-2">Take profit:</p>
          {order?.tp_trigger_price || order?.sl_trigger_price ? (
            <button
              className="flex items-center font-medium justify-center text-xs text-white"
              onClick={handleRemoveTPSL}
            >
              <GrPowerReset className="mr-1" />
              Reset TP/SL
            </button>
          ) : null}
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex px-2.5 w-full items-center bg-terciary border border-borderColor rounded h-[35px] text-sm">
            <input
              type="number"
              className="h-full w-full"
              placeholder="TP Price"
              value={algoOrder.tp_trigger_price}
              onChange={(e) => handleChange("tp_trigger_price", e.target.value)}
            />
          </div>
          <div className="flex pl-2.5 items-center bg-terciary border border-borderColor rounded h-[35px] text-sm">
            <input
              type="number"
              className={`h-full w-full ${
                Number(algoOrder.tp_pnl) > 0
                  ? "text-green"
                  : Number(algoOrder.tp_pnl) < 0
                  ? "text-red"
                  : "text-font-80"
              }`}
              placeholder="Gain"
              value={
                activePnlOrOffset === "$"
                  ? algoOrder.tp_pnl
                  : (Number(algoOrder.tp_offset_percentage) * 100).toFixed(2)
              }
              onChange={(e) =>
                handleChange(
                  activePnlOrOffset === "$" ? "tp_pnl" : "tp_offset_percentage",
                  e.target.value
                )
              }
            />
            <Popover>
              <PopoverTrigger className="h-full min-w-fit">
                <div className="w-fit px-2.5 h-full flex items-center justify-center ">
                  <p>{activePnlOrOffset}</p>
                  <IoChevronDown className="ml-1" />
                </div>
              </PopoverTrigger>
              <PopoverContent
                sideOffset={0}
                className="md:transform-x-[10px] flex flex-col w-fit p-2.5  bg-secondary border border-borderColor shadow-2xl "
              >
                <button
                  onClick={() => setActivePnlOrOffset("$")}
                  className="text-sm text-white mb-1"
                >
                  $
                </button>
                <button
                  onClick={() => setActivePnlOrOffset("%")}
                  className="text-sm text-white"
                >
                  %
                </button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        {error && error.find((entry) => entry.includes("TP")) ? (
          <p className="text-xs text-red mt-2">
            {error.find((entry) => entry.includes("TP"))}
          </p>
        ) : null}
        <p className="text-sm text-white mb-2 mt-2.5">Stop loss:</p>
        <div className="flex items-center justify-between gap-2">
          <div className="flex px-2.5 w-full items-center bg-terciary border border-borderColor rounded h-[35px] text-sm">
            <input
              type="number"
              className="h-full w-full"
              placeholder="SL Price"
              value={algoOrder.sl_trigger_price}
              onChange={(e) => handleChange("sl_trigger_price", e.target.value)}
            />
          </div>
          <div className="flex pl-2.5 items-center bg-terciary border border-borderColor rounded h-[35px] text-sm">
            <input
              type="number"
              className={`h-full w-full ${
                Number(algoOrder.sl_pnl) > 0
                  ? "text-green"
                  : Number(algoOrder.sl_pnl) < 0
                  ? "text-red"
                  : "text-font-80"
              }`}
              placeholder="Loss"
              value={
                activePnlOrOffset === "$"
                  ? algoOrder.sl_pnl
                  : (Number(algoOrder.sl_offset_percentage) * 100).toFixed(2)
              }
              onChange={(e) =>
                handleChange(
                  activePnlOrOffset === "$" ? "sl_pnl" : "sl_offset_percentage",
                  e.target.value
                )
              }
            />
            <Popover>
              <PopoverTrigger className="h-full min-w-fit">
                <div className="w-fit px-2.5 h-full flex items-center justify-center ">
                  <p>{activePnlOrOffset}</p>
                  <IoChevronDown className="ml-1" />
                </div>
              </PopoverTrigger>
              <PopoverContent
                sideOffset={0}
                className="md:transform-x-[10px] flex flex-col w-fit p-2.5  bg-secondary border border-borderColor shadow-2xl "
              >
                <button
                  onClick={() => setActivePnlOrOffset("$")}
                  className="text-sm text-white mb-1"
                >
                  $
                </button>
                <button
                  onClick={() => setActivePnlOrOffset("%")}
                  className="text-sm text-white"
                >
                  %
                </button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        {error && error.find((entry) => entry.includes("SL")) ? (
          <p className="text-xs text-red mt-2">
            {error.find((entry) => entry.includes("SL"))}
          </p>
        ) : null}

        {/* Ajoutez d'autres champs pour TP, SL, etc. */}
        <div className="flex items-center w-full gap-2.5 mt-5">
          <button
            className="border-base_color border w-full rounded flex items-center justify-center h-[40px] text-sm text-white"
            onClick={handleSubmit}
          >
            {loading && (
              <Oval
                visible={true}
                height="18"
                width="18"
                color="#FFF"
                secondaryColor="rgba(255,255,255,0.6)"
                ariaLabel="oval-loading"
                strokeWidth={6}
                strokeWidthSecondary={6}
                wrapperStyle={{
                  marginRight: "8px",
                }}
                wrapperClass=""
              />
            )}
            Create TP & SL Order
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
