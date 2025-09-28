export const MobilePnL = () => {
  return (
    <div className="w-full h-[50px] border-b border-borderColor flex items-center px-2.5 md:hidden">
      <div className="flex items-center justify-between w-full whitespace-nowrap overflow-x-scroll no-scrollbar">
        <div className="flex items-center">
          <div className="pr-2">
            <p className="text-xs text-font-60 ">Tot. value</p>
            <p className="text-xs text-white font-medium">0.00</p>
          </div>
          <div className="px-2 border-x border-borderColor">
            <p className="text-xs text-font-60">Unreal PnL</p>
            <p className="text-xs text-white font-medium text-end">
              0.00 (0.00%)
            </p>
          </div>
          <div className="px-2">
            <p className="text-xs text-font-60">Unset. PnL</p>
            <div className="flex items-center">
              <p className="text-xs text-white font-medium">0.00</p>
              <button className="flex items-center px-2 text-xs text-blue-400">
                <span>Settle PnL</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex pl-2.5 bg-secondary">
        <button className="flex bg-terciary border border-borderColor-DARK rounded py-1 px-2.5 items-center text-xs text-white">
          <span className="whitespace-nowrap">Close</span>
        </button>{" "}
      </div>
    </div>
  );
};
