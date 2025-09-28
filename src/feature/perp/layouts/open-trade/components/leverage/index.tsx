"use client";
import { triggerAlert } from "@/lib/toaster";
import { useLeverage, useMarginRatio } from "@orderly.network/hooks";
import { useRef } from "react";
import { LeverageEditor } from "./editor";

export const Leverage = () => {
  const { currentLeverage } = useMarginRatio();
  const [maxLeverage, { update, config: leverageLevers, isMutating }] =
    useLeverage();
  const nextLeverage = useRef(maxLeverage ?? 0);

  const onSave = async (value: { leverage: number }) => {
    if (value.leverage === maxLeverage) return;
    update({ leverage: value.leverage }).then(
      () => {
        triggerAlert("Success", "Max leverage has been updated successfully");
      },
      (error: { message: string }) => {
        triggerAlert("Error", error.message);
      }
    );
    return Promise.resolve().then(() => {
      nextLeverage.current = value.leverage;
    });
  };

  return (
    <div className="flex flex-col p-4 border-b border-borderColor">
      <p className="text-xs text-font-60 mb-1">Max account leverage</p>
      <LeverageEditor
        maxLeverage={maxLeverage}
        leverageLevers={leverageLevers}
        onSave={onSave}
      />
    </div>
  );
};
