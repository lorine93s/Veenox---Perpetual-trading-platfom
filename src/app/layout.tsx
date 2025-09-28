import { Footer } from "@/layouts/footer";
import { Header } from "@/layouts/header";
import { config } from "@/lib/wallet-connect/config";
import WagmiProvider from "@/lib/wallet-connect/provider";
import { Providers } from "@/provider/wrapper";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import NextTopLoader from "nextjs-toploader";
import "react-toastify/dist/ReactToastify.css";
import { cookieToInitialState } from "wagmi";
import "./globals.css";

const OrderlyProvider = dynamic(() => import("../lib/orderly/"), {
  ssr: true,
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VEENO X",
  description:
    "VeenoX is a cutting-edge perpetual decentralized exchange (DEX) built on the Orderly Network and powered by Monad technology. We offer traders the lowest fees in the market without compromising on essential features. Our unique 'Learn Trading & Earn' program empowers users to enhance their trading skills while earning rewards, creating an educational and profitable experience. At VeenoX, we're committed to revolutionizing decentralized finance by providing a secure, efficient, and user-friendly platform for both novice and experienced traders. Join us in shaping the future of DeFi trading.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <WagmiProvider initialState={initialState}>
          <OrderlyProvider>
            <Providers>
              <NextTopLoader
                color="#836EF9"
                initialPosition={0.08}
                crawlSpeed={200}
                height={3}
                crawl={false}
                showSpinner={false}
                easing="ease"
                speed={200}
                shadow="0 0 10px #2299DD,0 0 5px #2299DD"
                template='<div class="bar" role="bar"><div class="peg"></div></div> 
               <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
                zIndex={1600}
                showAtBottom={false}
              />
              <Header />
              {children}
              <SpeedInsights />
              <Footer />
            </Providers>{" "}
          </OrderlyProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
