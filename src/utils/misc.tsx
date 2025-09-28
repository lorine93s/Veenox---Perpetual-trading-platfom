export const addressSlicer = (address: `0x${string}` | undefined) => {
  return address?.slice(0, 6) + "..." + address?.slice(-4);
};

export const formatSymbol = (symbol: string, isOnlySymbol?: boolean) => {
  const isPerp = symbol.includes("PERP");
  try {
    const formatted = symbol.replace("PERP", "").slice(1).replace("_", "-");
    if (isOnlySymbol) {
      return formatted.split("-")[0].toUpperCase();
    }
    if (isPerp) {
      return formatted;
    }
    return symbol;
  } catch (e) {
    return symbol;
  }
};

function formatNumber(number: number) {
  return number.toLocaleString("en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 10,
  });
}

export function getFormattedAmount(
  price: number | string | undefined,
  midAmount = false,
  lessPrecision = 0,
  settings: {
    shouldNotMinifyBigNumbers?: boolean;
    canUseHTML?: boolean;
    isScientificNotation?: boolean;
  } = {
    shouldNotMinifyBigNumbers: false,
    canUseHTML: false,
    isScientificNotation: false,
  }
) {
  try {
    if (price) {
      price = parseFloat(String(price)).toFixed(
        Math.min(
          String(price).includes("-")
            ? parseInt(String(price).split("-")[1]) + 2
            : String(price).split(".")[1]?.length || 0,
          100
        )
      );

      if (
        settings.isScientificNotation &&
        Math.abs(parseFloat(price)) < 0.0001
      ) {
        const exp = price.match(/0\.0+[1-9]/)?.[0] || "";
        return `${price.split(".")[0]}.0..0${price
          .split(exp.slice(0, exp.length - 2))[1]
          .slice(1, 5 - lessPrecision)}`;
      }

      if (Math.abs(parseFloat(price)) > 1000000) {
        return !settings.shouldNotMinifyBigNumbers
          ? formatBigAmount(price)
          : formatAmount(price, 0);
      }
      if (Math.abs(parseFloat(price)) > 1000) {
        if (!midAmount)
          return String(parseInt(price)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return formatNumber(parseFloat(price));
      }
      if (Math.abs(parseFloat(price)) < 0.0000001 && settings.canUseHTML) {
        return formatSmallNumber(Math.abs(parseFloat(price)));
      }
      if (Math.abs(parseFloat(price)) < 0.0001) {
        const priceString = price.toString();
        const newPrice: string[] = [];
        const arr = priceString.split(".");
        const decimals = arr[1]?.split("");
        decimals.forEach((digit, index) => {
          if (newPrice.some((digit) => digit !== "0")) return;
          if (digit === "0") newPrice.push(digit);
          if (decimals[index - 1] == "0" && digit !== "0") {
            newPrice.push(digit);
            newPrice.push(decimals[index + 1]);
            newPrice.push(decimals[index + 2]);
          }
        });
        return `${arr[0]}.${newPrice.join("")}`;
      }
      if (Math.abs(parseFloat(price)) < 0.01) {
        return price.slice(0, 8 - lessPrecision);
      }
      price = price.slice(0, 6 - lessPrecision);
      if (price[price.length - 1] === ".")
        price = price.slice(0, 5 - lessPrecision);
      return price;
    }
    if (Number.isNaN(price)) {
      return "--";
    }
    return 0;
  } catch (e) {
    return "--";
  }
}

export function formatBigAmount(amount: number | string, precision = 3) {
  amount = formatAmount(parseInt(amount as string));
  let letter: string = "";
  switch (amount.split(",").length) {
    case 1:
      letter = "";
      break;
    case 2:
      letter = "k";
      break;
    case 3:
      letter = "M";
      break;
    case 4:
      letter = "B";
      break;
    case 5:
      letter = "T";
      break;
    case 6:
      letter = "Q";
      break;
    case 7:
      letter = "Qi";
      break;
    case 8:
      letter = "S";
      break;
  }

  const fractionalPart = amount
    .split(",")
    .slice(1)
    .join("")
    .slice(0, precision - amount.split(",")[0].length);

  if (fractionalPart === "0") {
    return `${amount.split(",")[0]}${letter}`;
  }

  if (precision) {
    return `${amount.split(",")[0]}${
      fractionalPart ? `.${fractionalPart}` : ""
    }${letter}`;
  }

  return amount.split(",")[0] + letter;
}

const formatSmallNumber = (number: number) => {
  const nbrToString = toFullString(number);
  const cutFirstHalf = nbrToString.split("");
  const firstHalf = [cutFirstHalf[0], cutFirstHalf[1], cutFirstHalf[2]];
  const numberArray = cutFirstHalf.slice(3, cutFirstHalf.length);

  let countZero = 0;

  for (let i = 0; i < numberArray.length; i++) {
    if (numberArray[i] === "0") countZero++;
    else break;
  }

  return (
    <>
      {firstHalf}
      <sub className="text-[xs] self-end font-medium mx-[2px]">{countZero}</sub>
      {numberArray.slice(countZero, countZero + 3).join("")}
    </>
  );
};

function toFullString(num: number) {
  let str = num.toString();
  if (str.includes("e")) {
    const parts = str.split("e");
    const base = parts[0].replace(".", "");
    const exponent = parseInt(parts[1], 10);

    if (exponent < 0) {
      const decimalPlaces = Math.abs(exponent) - 1;
      str = "0." + "0".repeat(decimalPlaces) + base;
    } else {
      str = base + "0".repeat(exponent - base.length + 1);
    }
  }
  return str;
}

export function formatAmount(amount: number | string, decimals = 2) {
  if (isNaN(parseInt(amount as string))) return "--";
  return (
    String(Math.floor(parseFloat(amount as string))).replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ","
    ) +
    (amount.toString().includes(".") && decimals
      ? `.${amount.toString().split(".")[1].substr(0, decimals)}`
      : "")
  );
}

export const getFormattedDate = (date: number) => {
  if (!date) return null;

  const options: Intl.DateTimeFormatOptions = {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };

  const formattedDate = new Date(date).toLocaleDateString(undefined, options);
  return formattedDate;
};

export const resolutionToTimeframe = (resolution: string) => {
  const map: { [key: string]: string } = {
    "1": "1m",
    "5": "5m",
    "15": "15m",
    "60": "1h",
    "120": "2h",
    "240": "4h",
    "24H": "1d",
    "7D": "1w",
    "30D": "1M",
  };
  return map[resolution] || "1m";
};

export const getNextBarTime = (resolution: string, time: number) => {
  const date = new Date(time);

  // Créer une copie de la date pour éviter de modifier l'objet original
  const utcDate = new Date(date.getTime());

  switch (resolution) {
    case "1":
    case "3":
    case "5":
    case "15":
      utcDate.setMinutes(utcDate.getMinutes() + parseInt(resolution));
      break;
    case "60":
    case "120":
    case "240":
    case "360":
    case "720":
      utcDate.setHours(utcDate.getHours() + parseInt(resolution) / 60);
      break;
    case "D":
      utcDate.setDate(utcDate.getDate() + 1);
      break;
    case "W":
      utcDate.setDate(utcDate.getDate() + 7);
      break;
    case "M":
      utcDate.setMonth(utcDate.getMonth() + 1);
      break;
    default:
      throw new Error("Unsupported resolution: " + resolution);
  }

  return Math.floor(utcDate.getTime());
};

export const get24hChange = (open: number, close: number) => {
  const difference = close - open;
  const changePercentage = (difference / open) * 100;
  const formatPercentage = changePercentage?.toFixed(2);
  return { difference, formatPercentage };
};

export const getRemainingTime = (targetDate: number): string => {
  if (!targetDate) return "00:00:00";
  const now = new Date().getTime();
  const distance = targetDate - now;

  if (distance <= 0) return "00:00:00";

  const hour = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const min = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const sec = Math.floor((distance % (1000 * 60)) / 1000);

  return `${hour < 10 ? `0${hour}` : hour}:${min < 10 ? `0${min}` : min}:${
    sec < 10 ? `0${sec}` : sec
  } `;
};

export const getLeverageValue = (i: number) => {
  switch (i) {
    case 0:
      return "x1";
    case 1:
      return "x2";
    case 2:
      return "x3";
    case 3:
      return "x4";
    case 4:
      return "x5";
    case 5:
      return "x10";
    case 6:
      return "x15";
    case 7:
      return "x20";
    case 8:
      return "x30";
    case 9:
      return "x40";
    case 10:
      return "x50";
    default:
      return "x2";
  }
};

export const resolutionToMilliseconds = (resolution: string): number => {
  const map: { [key: string]: number } = {
    "1m": 60 * 1000,
    "5m": 5 * 60 * 1000,
    "15m": 15 * 60 * 1000,
    "1h": 60 * 60 * 1000,
    "2h": 2 * 60 * 60 * 1000,
    "4h": 4 * 60 * 60 * 1000,
    "1d": 24 * 60 * 60 * 1000,
    "1w": 7 * 24 * 60 * 60 * 1000,
    "1M": 30 * 24 * 60 * 60 * 1000,
  };
  return map[resolution] || resolutionToMilliseconds("1m");
};

export function getTokenPercentage(status?: number) {
  if (typeof status !== "number") {
    status = parseFloat(status as unknown as string);
  }
  if (status === undefined || status === Infinity || Number.isNaN(status)) {
    return "-- ";
  }
  return status.toFixed(4);
}

export const getStyleFromDevice = (i: number, color: string) => {
  switch (i) {
    case 0:
      return `pl-2.5  ${color}`;
    case 1:
      return " text-end";
    case 2:
      return "pr-2.5  text-end";
    case 3:
      return "pr-2.5  text-end";
    default:
      return "pr-2.5  text-end";
  }
};

export type ConnectorNameType =
  | "WalletConnect"
  | "Injected"
  | "Coinbase Wallet"
  | "Web3Modal Auth"
  | "Phantom"
  | "MetaMask"
  | "SubWallet"
  | "Rabby Wallet"
  | "Keplr"
  | "Backpack";

export const connectorsToImage = {
  WalletConnect: "/logo/wallet-connect.png",
  Injected: "/logo/injected.png",
  "Coinbase Wallet": "/logo/coinbase.png",
  "Web3Modal Auth": "/logo/web3modal.png",
  Phantom: "/logo/phantom.png",
  MetaMask: "/logo/metamask.png",
  SubWallet: "/logo/subwallet.png",
  "Rabby Wallet": "/logo/rabby.png",
  Keplr: "/logo/keplr.png",
  Backpack: "/logo/backpack-wallet.png",
};

export function formatQuantity(quantity: number, tickSize: number) {
  return Math.floor(quantity / tickSize) * tickSize;
}
