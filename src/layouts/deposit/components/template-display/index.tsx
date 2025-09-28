import { useGeneralContext } from "@/context";
import { Popover, PopoverContent, PopoverTrigger } from "@/lib/shadcn/popover";
import { triggerAlert } from "@/lib/toaster";
import {
  ConnectorNameType,
  addressSlicer,
  connectorsToImage,
  getFormattedAmount,
} from "@/utils/misc";
import {
  ChainsImageType,
  getImageFromChainId,
  supportedChains,
} from "@/utils/network";
import { utils } from "@orderly.network/core";
import {
  useAccountInstance,
  useAccount as useOrderlyAccount,
  useSettleSubscription,
} from "@orderly.network/hooks";
import { FixedNumber } from "ethers";
import Image from "next/image";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { Oval } from "react-loader-spinner";
import { useAccount, useSwitchChain } from "wagmi";
import { filterAllowedCharacters } from "../../utils";

type TemplateDisplayProps = {
  balance: string;
  amount: FixedNumber | undefined;
  setAmount: Dispatch<SetStateAction<FixedNumber | undefined>>;
  setQuantity: Dispatch<SetStateAction<string>>;
  children: ReactNode;
  depositFee: BigInt;
  unsettledPnL: number;
};

const InputQuantity = () => {
  const { state } = useOrderlyAccount();
  const { address, chainId, chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const { isDeposit } = useGeneralContext();

  const chainLogo =
    supportedChains.find((entry) => entry.label === (chain?.name as string))
      ?.icon || getImageFromChainId(chainId as ChainsImageType);

  return (
    <div className="w-full flex items-center mb-2">
      <div className="bg-terciary h-[35px]  border rounded w-full border-borderColor-DARK mr-2">
        <input
          type="text"
          readOnly
          placeholder={addressSlicer(address)}
          className="h-full px-2.5 w-full text-xs"
        />
      </div>
      <div className="bg-terciary h-[35px] border rounded border-borderColor-DARK">
        <Popover>
          <PopoverTrigger className="h-full min-w-fit">
            <button className="h-full whitespace-nowrap text-sm px-2.5 text-white w-full flex-nowrap flex items-center justify-center">
              <Image
                src={chainLogo}
                width={18}
                height={18}
                className="ml-2 object-cover rounded-full mr-2"
                alt="Chain logo"
              />
              {chain?.name}
              <IoChevronDown className="min-w-[18px] text-xs ml-[1px] mr-2" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            sideOffset={3}
            className="flex flex-col px-2 py-0.5 rounded z-[102] w-fit whitespace-nowrap bg-primary border border-borderColor-DARK shadow-xl"
          >
            {supportedChains
              ?.filter((item) => item.network !== "testnet")
              .map((supportedChain, i) => (
                <button
                  key={i}
                  className="flex items-center py-1 flex-nowrap"
                  onClick={() =>
                    switchChain({
                      chainId: parseInt(supportedChain.id, 16),
                    })
                  }
                >
                  <Image
                    src={supportedChain.icon}
                    width={20}
                    height={20}
                    className="h-5 w-5 object-cover rounded-full mr-2"
                    alt="Chain logo"
                  />
                  <p
                    className={`w-full text-start text-xs ${
                      parseInt(supportedChain.id, 16) === chainId
                        ? "text-white"
                        : "text-font-60"
                    } `}
                  >
                    {supportedChain.label}
                  </p>
                </button>
              ))}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

type PageContentType = {
  title_top: string;
  image_top: string;
  title_bot: string;
  image_bot: string;
};

export const TemplateDisplay = ({
  balance,
  amount,
  setAmount,
  setQuantity,
  children,
  depositFee,
  unsettledPnL,
}: // dst,
TemplateDisplayProps) => {
  const { state } = useOrderlyAccount();
  const { isDeposit } = useGeneralContext();
  const { address, chainId, chain } = useAccount();
  const accountInstance = useAccountInstance();
  const [isSettleLoading, setIsSettleLoading] = useState(false);

  const getPageContent = (): PageContentType => {
    if (isDeposit)
      return {
        title_top: "Your Wallet",
        image_top:
          connectorsToImage[state?.connectWallet?.name as ConnectorNameType] ||
          "/logo/v.png",
        title_bot: "Your VeenoX account",
        image_bot: "/logo/v.png",
      };
    return {
      title_top: "Your VeenoX account ",
      image_top: "/logo/v.png",
      title_bot: "Your Wallet",
      image_bot:
        connectorsToImage[state?.connectWallet?.name as ConnectorNameType] ||
        "/logo/v.png",
    };
  };

  const pageContent = getPageContent();
  const formattedDepositFee = utils.formatByUnits(
    depositFee as never,
    chain?.nativeCurrency.decimals
  );

  useSettleSubscription({
    onMessage: (data: any) => {
      const { status } = data;
      switch (status) {
        case "COMPLETED":
          triggerAlert("Success", "Settlement has been completed.");
          setIsSettleLoading(false);
          break;
        case "FAILED":
          triggerAlert("Error", "Settlement has failed.");
          setIsSettleLoading(false);
          break;
        default:
          break;
      }
    },
  });

  return (
    <>
      <div className="flex items-center w-full justify-between mb-2">
        <p>{pageContent.title_top}</p>
        <Image
          src={pageContent.image_top}
          height={20}
          width={20}
          alt="Veeno logo"
          className="rounded-full"
        />
      </div>
      {isDeposit ? <InputQuantity /> : null}
      <div className="bg-terciary pb-2.5 px-2.5 py-1 border mt-0 rounded w-full border-borderColor-DARK">
        <div className="w-full flex items-center justify-between">
          <input
            type="number"
            placeholder={amount?.toString() || "Quantity"}
            className="h-[30px] pr-2.5 w-full max-w-[280px] text-sm placeholder:text-white"
            onChange={(e) => {
              const newValue = filterAllowedCharacters(e.target.value);
              setAmount(newValue as any);
              setQuantity(newValue.toString());
            }}
          />
          <div className="flex items-center">
            <button
              className="text-sm font-medium text-base_color uppercase"
              onClick={() => {
                setAmount(balance as never);
                setQuantity(balance.toString());
              }}
            >
              MAX
            </button>
            <div className="flex items-center ml-5">
              <Image
                src="/assets/usdc.png"
                width={17}
                height={17}
                className="object-cover rounded-full mr-1.5 -mt-0.5"
                alt="USDC logo"
              />
              <p className="text-white text-sm ">USDC</p>
            </div>
          </div>
        </div>
        <div className="w-full flex items-center justify-between mt-1.5">
          <p className="text-font-60 text-xs ">${amount?.toString()}</p>
          <div className="flex items-center">
            <div className="flex items-center ml-5">
              <p className="text-font-60 text-xs">
                Available:{" "}
                {parseFloat(balance) > 0 ? getFormattedAmount(balance) : 0} USDC
              </p>
            </div>
          </div>
        </div>
      </div>
      {isDeposit ? null : (
        <div className="w-full flex items-center text-xs justify-between mt-2">
          <p className="text-font-60">
            Unsettled:{" "}
            <span
              className={`font-medium ${
                unsettledPnL > 0
                  ? "text-green"
                  : unsettledPnL < 0
                  ? "text-red"
                  : "text-white"
              }`}
            >
              {unsettledPnL}
            </span>{" "}
            USDC
          </p>
          <button
            onClick={() => {
              if (unsettledPnL !== 0 && accountInstance) {
                setIsSettleLoading(true);
                accountInstance?.settle();
              }
            }}
            className={`${
              unsettledPnL !== 0 ? "" : "opacity-40 pointer-events-none"
            } flex items-center bg-terciary border border-borderColor-DARK rounded px-2 py-1 text-xs text-white`}
          >
            {isSettleLoading ? (
              <Oval
                visible={true}
                height="13"
                width="13"
                color="#FFF"
                secondaryColor="rgba(255,255,255,0.6)"
                ariaLabel="oval-loading"
                strokeWidth={6}
                strokeWidthSecondary={6}
                wrapperStyle={{
                  marginRight: "5px",
                }}
                wrapperClass=""
              />
            ) : null}
            <span>Settle PnL</span>
          </button>
        </div>
      )}
      {children}
      <div className="flex flex-col w-full">
        <div
          className={`flex items-center w-full justify-between ${
            isDeposit ? "mb-0" : "mb-2"
          }`}
        >
          <p>{pageContent.title_bot}</p>
          <Image
            src={pageContent.image_bot}
            height={20}
            width={20}
            alt="Veeno logo"
            className="rounded-full"
          />
        </div>
        {isDeposit ? null : <InputQuantity />}
        <div
          className={`bg-terciary ${
            isDeposit ? "mt-2" : "mt-0"
          } h-[35px] border rounded w-full border-borderColor-DARK mr-2`}
        >
          <input
            type="text"
            readOnly
            placeholder={
              amount ? `${amount?.toString() as string} USDC` : "Quantity"
            }
            className="h-full px-2.5 w-full text-xs placeholder:opacity-100 placeholder:text-white"
          />
        </div>
        <div className="flex text-xs text-white items-center justify-between my-4 ">
          <p className="text-font-60 mr-2">
            {isDeposit ? "Deposit" : "Withdraw"} Fees:
          </p>
          <p>{isDeposit ? getFormattedAmount(formattedDepositFee) : "1.00"}$</p>
        </div>
      </div>
    </>
  );
};
