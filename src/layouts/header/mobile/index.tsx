import Link from "next/link";
import { AiOutlineSwap } from "react-icons/ai";
import { FaRegUser } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { LuBarChart3, LuWallet } from "react-icons/lu";
import { MdOutlineAreaChart } from "react-icons/md";

type MobileModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const MobileModal = ({ isOpen, onClose }: MobileModalProps) => {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed top-0 h-screen w-full z-[100] p-5 left-0 ${
          isOpen ? "opacity-20" : "opacity-0 pointer-events-none"
        } transition-all duration-200 ease-in-out bg-secondary z-30`}
      />
      <div
        className={`fixed top-0 h-screen w-full sm:w-[350px] z-[100] p-5 left-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-all duration-200 ease-in-out bg-secondary sm:border-r sm:border-borderColor shadow-2xl`}
      >
        <div className="flex items-center">
          <img
            src="/logo/v.png"
            alt="Veeno Logo"
            className="h-[30px] w-[30px] max-w-[30px] max-h-[30px]"
          />
          <h3 className="text-white text-bold font-poppins text-xl ml-2">
            VEENOX
          </h3>
          <button className="text-white ml-auto text-2xl" onClick={onClose}>
            <IoClose />
          </button>
        </div>
        <nav className="h-full mt-10">
          <ul className="text-white text-medium text-base gap-5 h-full">
            <li>
              <Link href="/perp/PERP_BTC_USDC">
                <span className="flex items-center">
                  <LuBarChart3 className="mr-3 text-xl" />
                  Trade
                </span>
              </Link>
            </li>
            <li className="my-5">
              <Link href="/perp/PERP_BTC_USDC">
                <span className="flex items-center">
                  <FaRegUser className="mr-3 text-xl" />
                  Dashboard
                </span>
              </Link>
            </li>
            <li className="my-5">
              <Link href="/perp/PERP_BTC_USDC">
                <span className="flex items-center">
                  <LuWallet className="mr-3 text-xl" />
                  Wallet
                </span>
              </Link>
            </li>
            <li className="my-5">
              <Link href="/perp/PERP_BTC_USDC">
                <span className="flex items-center">
                  <AiOutlineSwap className="mr-3 text-xl" />
                  Swap
                </span>
              </Link>
            </li>
            <li>
              <Link href="/perp/PERP_BTC_USDC">
                <span className="flex items-center">
                  <MdOutlineAreaChart className="mr-3 text-xl" />
                  Learn Trading & Earn
                </span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};
