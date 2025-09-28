import { toast } from "react-toastify";

type TypeProps = "Error" | "Warning" | "Success" | "Information";
type ToastType = {
  Success: () => void;
  Error: () => void;
  Information: () => void;
  Warning: () => void;
};

export const triggerAlert = (type: TypeProps, text: string) => {
  const Msg = () => (
    <div className="flex flex-col items-start text-white text-sm font-bold  w-full h-full pb-1 pl-1">
      <p className="text-[15px]">{type}</p>
      <p className="text-sm text-font-60 font-medium mt-1">{text}</p>
    </div>
  );

  const progressBar = {
    progressStyle: { position: "absolute", top: 0, height: "4px" },
  };

  const toastType: ToastType = {
    Success: () => toast.success(<Msg />, progressBar as never),
    Error: () => toast.error(<Msg />, progressBar as never),
    Information: () => toast.info(<Msg />, progressBar as never),
    Warning: () => toast.warning(<Msg />, progressBar as never),
  };

  toastType[type]();
};
