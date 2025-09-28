export const steps = [
  {
    title: "Connect Wallet",
    description:
      "Connecting your wallet is like “logging in” to Web3. Select your wallet from the options to get started.",
  },
  {
    title: "Approve Connection",
    description:
      "Please approve the connection in your wallet and authorize access to continue.",
  },
  {
    title: "Successfully Connected",
    description: "Your wallet is now connected to Veeno",
  },
];

export const getActiveStep = (status: string) => {
  switch (status) {
    case "idle":
      return steps[0];
    case "pending":
      return steps[1];
    case "success":
      return steps[2];
    default:
      return steps[0];
  }
};
