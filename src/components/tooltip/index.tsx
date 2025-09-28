import { cn } from "@/utils/cn";

type TooltipProps = {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
};

export const Tooltip = ({ isOpen, className, children }: TooltipProps) => {
  return (
    <div
      className={cn(
        `${
          isOpen
            ? "opacity-100"
            : "opacity-0 scale-95 translate-y-2 pointer-events-none"
        } p-5 shadow-2xl text-white border border-borderColor-DARK bg-terciary rounded-md absolute top-[110%] left-1/2 -translate-x-1/2 transition-all duration-200 z-10 ease-in-out`,
        className
      )}
    >
      {children}
    </div>
  );
};
