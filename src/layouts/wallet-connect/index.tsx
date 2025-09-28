"use client";
import { useGeneralContext } from "@/context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/lib/shadcn/dialog";
import { addressSlicer } from "@/utils/misc";
import { useAccount as useOrderlyAccount } from "@orderly.network/hooks";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { IoChevronDown } from "react-icons/io5";
import { TfiWallet } from "react-icons/tfi";
import { useAccount, useConnect } from "wagmi";
import { getActiveStep } from "./constant";

export enum AccountStatusEnum {
  NotConnected = 0,
  Connected = 1,
  NotSignedIn = 2,
  SignedIn = 3,
  DisabledTrading = 4,
  EnableTrading = 5,
}

export const ConnectWallet = () => {
  const [isCopied, setIsCopied] = useState(false);
  const { account } = useOrderlyAccount();
  const { address, isDisconnected, isConnecting, chainId, connector } =
    useAccount();
  const [isActive, setIsActive] = useState(0);
  const { connect, connectors, isPending, isError, isSuccess, data } =
    useConnect();
  const { isWalletConnectorOpen, setIsWalletConnectorOpen } =
    useGeneralContext();
  const [activeConnector, setActiveConnector] = useState<string | null>(null);

  //  useEffect(() => {
  //    if () return;
  //    const switchChain = async () => {
  //      try {
  //        await switchChain(data?.chainId);
  //        console.log(`Switched to chain ${data?.chainId}`);
  //      } catch (error) {
  //        console.log(`Failed to switch chain: `);
  //      }
  //    };

  //    if (isConnected) {
  //      switchChain();
  //    }
  //  }, [data?.chainId, isConnected, switchChain]);

  const getAccount = async () => {
    if (!address) return;
    try {
      const provider = await connector?.getProvider();
      await account.setAddress(address, {
        provider,
        chain: {
          id: chainId as number,
        },
        wallet: {
          name: connector?.name as string,
        },
      });
    } catch (error) {}
  };

  useEffect(() => {
    getAccount();
  }, [address, account]);

  useEffect(() => {
    if (isSuccess && address) {
      const setAccount = async () => {
        try {
          const provider = await connectors[isActive - 1]?.getProvider();
          await account.setAddress(address, {
            provider,
            chain: {
              id: data?.chainId,
            },
            wallet: {
              name: activeConnector as string,
            },
          });
          setActiveConnector(null);
        } catch (e) {}
      };
      setAccount();
    }
  }, [isSuccess, address, account]);

  const handleConnect = (i: number) => {
    connect({ connector: connectors[i] });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(address || "");
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const getImageFromConnector = (
    name: string,
    image: string
  ): string | null => {
    if (name === "Injected") return null;
    else if (name === "Coinbase Wallet") return "/logo/coinbase.png";
    else return image;
  };

  const getConnectorsToShow = (name: string) => {
    switch (name) {
      case "WalletConnect":
        return false;
      case "Web3Modal Auth":
        return false;
      case "SubWallet":
        return false;
      case "Keplr":
        return false;
      default:
        return true;
    }
  };

  useEffect(() => {
    if (isSuccess)
      setTimeout(() => {
        setIsWalletConnectorOpen(false);
      }, 3000);
  }, [isSuccess]);

  return (
    <div className="w-fit h-fit relative">
      <Dialog open={isWalletConnectorOpen}>
        <DialogTrigger>
          <div
            onClick={() => {
              if (address) return;
              setIsWalletConnectorOpen(true);
            }}
            className="text-white bg-base_color border border-borderColor-DARK text-bold font-poppins text-xs
        h-[30px] sm:h-[35px] px-2 sm:px-2.5 flex items-center justify-center rounded sm:rounded-md 
        "
          >
            {isDisconnected || isConnecting ? (
              "Connect"
            ) : (
              <span className="flex items-center w-full h-full">
                <p>{addressSlicer(address)}</p>
                <IoChevronDown className="ml-1" />
              </span>
            )}
          </div>
        </DialogTrigger>
        <DialogContent
          close={() => setIsWalletConnectorOpen(false)}
          className="w-full flex flex-col max-w-[475px] h-auto max-h-auto"
        >
          <DialogHeader>
            <DialogTitle>{getActiveStep(status).title}</DialogTitle>
            <DialogDescription className="text-font-60">
              {getActiveStep(status).description}
            </DialogDescription>
          </DialogHeader>
          {isPending ? (
            <div className="h-[208px] w-full flex flex-col items-center justify-center">
              {getImageFromConnector(
                connectors[isActive - 1].name,
                connectors[isActive - 1].icon as string
              ) ? (
                <img
                  src={
                    getImageFromConnector(
                      connectors[isActive - 1].name,
                      connectors[isActive - 1].icon as string
                    ) as string
                  }
                  height={80}
                  width={80}
                  className="rounded-full animate-pulse-scale"
                />
              ) : (
                <TfiWallet className="text-6xl text-white animate-pulse-scale shadow-xl shadow-slate-800" />
              )}
              <p className="text-white text-sm mt-5">
                {`Connecting to ${connectors[isActive - 1].name}`}
              </p>
            </div>
          ) : isSuccess ? (
            <div className="h-[208px] w-full flex flex-col items-center justify-center">
              <FaCheck className="text-6xl text-green" />
              <p className="text-white mt-5 font-medium">
                Successfully Connected!
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 w-full items-center">
              {connectors?.map((connector, i) => {
                const image = getImageFromConnector(
                  connector.name,
                  connector.icon as string
                );
                const includeWallet = connector.name.includes("Wallet");
                const formatName = includeWallet
                  ? connector.name.split(" Wallet")[0]
                  : connector.name;
                const isToRender = getConnectorsToShow(connector.name);
                if (isToRender)
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        handleConnect(i);
                        setIsActive(i + 1);
                        setActiveConnector(connector.name);
                      }}
                      className={`w-[100px] h-[100px] hover:bg-base_color ${
                        isActive === i + 1 ? "bg-base_color" : "bg-terciary"
                      } transition-all duration-200 ease-in-out rounded border border-borderColor
                     flex items-center flex-col justify-center`}
                    >
                      {image ? (
                        <img
                          src={image}
                          height={40}
                          width={40}
                          className="rounded"
                        />
                      ) : (
                        <TfiWallet className="text-4xl text-white" />
                      )}
                      <p className="text-white text-xs mt-2.5">{formatName}</p>
                    </button>
                  );
                return null;
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
