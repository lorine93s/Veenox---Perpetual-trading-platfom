"use client";
import { GeneralProvider } from "@/context";
import { ReactNode } from "react";
import { IoClose } from "react-icons/io5";
import { ToastContainer } from "react-toastify";

type ProviderType = {
  children: ReactNode;
};

const CloseButton = ({ closeToast }: any) => (
  <IoClose className="text-base text-white" onClick={closeToast} />
);

export const Providers = ({ children }: ProviderType) => {
  return (
    <>
      <ToastContainer
        toastClassName="bg-secondary text-white p-2 rounded shadow-md border border-borderColor relative"
        bodyClassName="bg-secondary text-white"
        closeButton={CloseButton}
      />
      <GeneralProvider>{children}</GeneralProvider>
    </>
  );
};
