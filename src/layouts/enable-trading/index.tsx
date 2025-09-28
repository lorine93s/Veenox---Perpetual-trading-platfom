import { useGeneralContext } from "@/context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/lib/shadcn/dialog";
import { useAccount as useOrderlyAccount } from "@orderly.network/hooks";
import { useState } from "react";

export const EnableTrading = () => {
  const { state, createOrderlyKey, createAccount } = useOrderlyAccount();
  const { isEnableTradingModalOpen, setIsEnableTradingModalOpen } =
    useGeneralContext();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCreateAccount = async () => {
    try {
      if (state.status === 2) await createAccount();
      await createOrderlyKey(true);
      setIsSuccess(true);
      setTimeout(() => {
        setIsEnableTradingModalOpen(false);
        setTimeout(() => {
          setIsSuccess(false);
        }, 1000);
      }, 3000);
    } catch (e) {}
  };
  return (
    <Dialog open={isEnableTradingModalOpen}>
      <DialogContent
        close={() => setIsEnableTradingModalOpen(false)}
        className="w-full flex flex-col max-w-[475px] h-auto max-h-auto"
      >
        <DialogHeader>
          <DialogTitle>Enable trading</DialogTitle>
          <DialogDescription className="text-font-60 mb-5">
            Sign two requests to verify ownership of your wallet and enable
            trading. Signing is free.
          </DialogDescription>
          <span className="h-1.5" />
          <div className="flex flex-col bg-terciary p-5 rounded">
            <div className="flex items-center mb-5">
              <span
                className={`w-8 h-8 min-w-8 rounded-full text-sm mr-4 ${
                  state.status === 2 ? "bg-base_color" : "bg-secondary"
                } flex items-center text-white justify-center transition-all duration-200 ease-in-out`}
              >
                1
              </span>
              <span
                className={`${
                  state.status === 2 ? "opacity-100" : "opacity-40"
                } `}
              >
                <p className="text-sm text-white font-medium">Sign in</p>
                <p className="text-sm text-font-60 font-medium">
                  Confirm you are the owner of the wallet.
                </p>
              </span>
            </div>
            <div className="flex items-center">
              <span
                className={`w-8 h-8 min-w-8 rounded-full text-sm mr-4 ${
                  state.status >= 3 ? "bg-base_color" : "bg-secondary"
                } flex items-center text-white justify-center transition-all duration-200 ease-in-out`}
              >
                2
              </span>
              <span
                className={`${
                  state.status >= 3 ? "opacity-100" : "opacity-40"
                } `}
              >
                <p className="text-sm text-white font-medium">Enable Trading</p>
                <p className="text-sm text-font-60 font-medium">
                  Enable secure access to lightning-fast trading
                </p>
              </span>
            </div>
          </div>
          <span className="h-0" />
          <button
            className={`${
              isSuccess ? "bg-green" : "bg-base_color"
            } w-full  h-[40px] rounded px-2.5 text-white text-sm
             flex items-center justify-center transition-all duration-200 ease-in-out`}
            onClick={handleCreateAccount}
          >
            {isSuccess
              ? "Successfully enable trading"
              : state.status === 2
              ? "Sign in"
              : "Enable trading"}
          </button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
