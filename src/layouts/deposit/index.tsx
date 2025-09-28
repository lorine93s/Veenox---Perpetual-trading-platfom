import { useGeneralContext } from "@/context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/lib/shadcn/dialog";
import { triggerAlert } from "@/lib/toaster";
import { supportedChainIds } from "@/utils/network";
import {
  useChains,
  useDeposit,
  useAccount as useOrderlyAccount,
  useWalletConnector,
  useWithdraw,
} from "@orderly.network/hooks";
import { API } from "@orderly.network/types";
import { FixedNumber } from "ethers";
import { useMemo, useState } from "react";
import { FaArrowDownLong } from "react-icons/fa6";
import { Oval } from "react-loader-spinner";
import { useAccount, useSwitchChain } from "wagmi";
import { TemplateDisplay } from "./components/template-display";

export const Deposit = () => {
  const { connectedChain } = useWalletConnector();
  const { address, chainId, chain } = useAccount();
  const { state } = useOrderlyAccount();
  const [amount, setAmount] = useState<FixedNumber>();
  const [open, setOpen] = useState(false); // Manage popup state
  const [disabled, setDisabled] = useState(true);
  const [mintedTestUSDC, setMintedTestUSDC] = useState(false);
  const [newWalletBalance, setNewWalletBalance] = useState<FixedNumber>();
  const [newOrderlyBalance, setNewOrderlyBalance] = useState<FixedNumber>();
  const [isApprovalDepositLoading, setIsApprovalDepositLoading] =
    useState<boolean>(false);
  const [isDepositSuccess, setIsDepositSuccess] = useState(false);
  const [isWithdrawSuccess, setIsWithdrawSuccess] = useState(false);
  const { setIsWalletConnectorOpen, isDeposit, setIsDeposit } =
    useGeneralContext();
  const networkIdSupported = [42161, 421614, 8453, 84532, 10, 11155420];
  const isSupportedChain = networkIdSupported.includes(chainId as number);

  const [chains] = useChains("mainnet", {
    filter: (item: API.Chain) =>
      supportedChainIds.includes(item.network_infos?.chain_id),
  });

  const token = useMemo(() => {
    return Array.isArray(chains)
      ? chains
          .find((chain) => chain.network_infos.chain_id === chainId)
          ?.token_infos.find((t) => t.symbol === "USDC")
      : undefined;
  }, [chains, connectedChain]);
  const {
    withdraw,
    isLoading: isWithdrawLoading,
    availableWithdraw,
    unsettledPnL,
  } = useWithdraw();
  const {
    dst,
    balance,
    allowance,
    approve,
    deposit,
    isNativeToken,
    balanceRevalidating,
    depositFee,
    quantity,
    setQuantity,
    fetchBalance,
  } = useDeposit({
    address: token?.address,
    decimals: token?.decimals,
    srcToken: token?.symbol,
    srcChainId: Number(chainId),
  });
  const { switchChain } = useSwitchChain();
  const handleClick = async () => {
    if (unsettledPnL !== 0) {
      triggerAlert("Error", "Settle PnL first.");
      return;
    }
    if (isSupportedChain) {
      if (isDeposit) {
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
          triggerAlert("Error", "Invalid amount.");
          return;
        }
        if (parseFloat(amount as never) > parseFloat(balance)) {
          triggerAlert("Error", "Amount exceed your holdings");
          return;
        }
        const amountNumber = Number(amount);
        const allowanceNumber = Number(allowance);

        if (allowanceNumber < amountNumber) {
          try {
            setIsApprovalDepositLoading(true);
            await approve(amount.toString());
            setIsApprovalDepositLoading(false);
          } catch (err) {
            setIsApprovalDepositLoading(false);
          }
        } else {
          setIsApprovalDepositLoading(true);
          try {
            await deposit();
            setIsDepositSuccess(true);
            setIsApprovalDepositLoading(false);
            setAmount(undefined);
            setNewWalletBalance(undefined);
            setNewOrderlyBalance(undefined);
            setTimeout(() => {
              setOpen(false);
              setTimeout(() => {
                setIsDepositSuccess(false);
              }, 1000);
              triggerAlert(
                "Information",
                "Deposit is processing... Your funds will appear in your VeenoX account shortly. "
              );
            }, 2000);
          } catch (err) {
            triggerAlert("Error", "Error while depositing on Veeno.");
            setIsApprovalDepositLoading(false);
          }
        }
      } else {
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
          triggerAlert("Error", "Invalid amount.");
          return;
        }
        try {
          if (parseFloat(amount.toString()) <= availableWithdraw) {
            await withdraw({
              chainId: chainId as number,
              amount: amount.toString(),
              token: "USDC",
              allowCrossChainWithdraw: true,
            });
            setIsWithdrawSuccess(true);
            setAmount(undefined);
            setNewWalletBalance(undefined);
            setNewOrderlyBalance(undefined);
            setTimeout(() => {
              setOpen(false);
              setTimeout(() => {
                setIsWithdrawSuccess(false);
              }, 1000);
              triggerAlert(
                "Information",
                "Withdrawal is processing... Your funds will appear in your wallet shortly."
              );
            }, 2000);
          }
        } catch (e) {}
      }
    } else {
      switchChain({ chainId: 42161 }); // Default switch to Arbitrum
    }
  };

  const getButtonState = (): string => {
    if (isSupportedChain) {
      if (unsettledPnL !== 0 && !isDeposit) return "Settle PnL First";
      if (isDeposit) {
        if (amount != null && Number(allowance) < Number(amount))
          return "Approve";
        else if (isDepositSuccess) return "Deposit Successfull";
        else return "Deposit";
      }
      if (isWithdrawSuccess) return "Successfully withdraw";

      return "Withdraw";
    }
    return "Switch Network";
  };

  const buttonState = getButtonState();

  return (
    <>
      <Dialog open={open}>
        <DialogTrigger
          onClick={() => {
            if (state.status >= 2) setOpen(true);
            else setIsWalletConnectorOpen(true);
          }}
        >
          <button
            className="text-white bg-terciary border border-base_color text-bold font-poppins text-xs
            h-[30px] sm:h-[35px] px-2.5 rounded sm:rounded-md mr-2.5 flex items-center
        "
          >
            Deposit
          </button>
        </DialogTrigger>
        <DialogContent
          close={() => setOpen(false)}
          className="w-full max-w-[475px] h-auto max-h-auto flex flex-col gap-0"
        >
          <DialogHeader>
            <div className="w-full mb-5">
              <div className="flex items-center w-full h-[34px] relative">
                <button
                  className={`${
                    isDeposit ? "text-white" : "text-font-60"
                  } w-1/2 h-fit pb-4 text-base font-medium transition-all duration-200 ease-in-out`}
                  onClick={() => setIsDeposit(true)}
                >
                  Deposit
                </button>
                <button
                  className={`${
                    !isDeposit ? "text-white" : "text-font-60"
                  } w-1/2 h-fit pb-4 text-base font-medium transition-all duration-200 ease-in-out`}
                  onClick={() => setIsDeposit(false)}
                >
                  Withdraw
                </button>
              </div>
              <div className="bg-terciary h-[1px] w-full relative">
                <div
                  className={`h-[1px] w-1/2 bottom-0 transition-all duration-200 ease-in-out bg-font-80 absolute ${
                    isDeposit ? "left-0" : "left-1/2"
                  } `}
                />
              </div>
            </div>
          </DialogHeader>
          <TemplateDisplay
            balance={isDeposit ? balance : availableWithdraw.toString()}
            amount={amount}
            setAmount={setAmount}
            setQuantity={setQuantity}
            depositFee={depositFee}
            unsettledPnL={unsettledPnL}
          >
            <div className="h-[20px] w-full flex items-center justify-center my-5">
              <div className="h-0.5 w-full bg-borderColor-DARK" />
              <FaArrowDownLong className="text-white text-2xl mx-2" />
              <div className="h-0.5 w-full bg-borderColor-DARK" />
            </div>
          </TemplateDisplay>
          <button
            onClick={handleClick}
            className={`${
              isDepositSuccess || isWithdrawSuccess
                ? "bg-green"
                : "bg-base_color"
            } w-full h-[40px] rounded px-2.5 text-white text-sm flex items-center justify-center transition-all duration-200 ease-in-out`}
          >
            {isApprovalDepositLoading ? (
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
            ) : null}
            {buttonState}
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
};
