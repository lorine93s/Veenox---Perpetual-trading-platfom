"use client";

import { cn } from "@/utils/cn";
import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";

type SliderProps = React.ComponentPropsWithoutRef<
  typeof SliderPrimitive.Root
> & {
  isBuy: boolean;
};

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, isBuy, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-terciary">
      <SliderPrimitive.Range
        className={cn(
          "absolute h-full transition-colors duration-150 ease-in-out",
          isBuy ? "bg-green" : "bg-red"
        )}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className={`block h-3 w-3 rounded-full border ${
        isBuy ? "border-green" : "border-red"
      } bg-terciary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 transition-all duration-150 ease-in-out`}
    />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
