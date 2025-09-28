"use client";
import { motion, useAnimation, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

export const Home = () => {
  const ref = useRef<HTMLHeadingElement>(null);
  const mainControls = useAnimation();
  const isInView = useInView(ref, { once: false });

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView]);

  return (
    <div className="flex flex-col bg-secondary" ref={ref}>
      <div className="w-full h-[40px] border-b border-borderColor flex items-center justify-center">
        <p className="text-white text-sm">
          You are on a Preview version, The current design is temporary.
        </p>
      </div>
      <div className="h-fit pt-[7%] pb-[10%] relative flex items-center w-[90%] max-w-[1350px] mx-auto">
        <div className="h-full w-full mx-auto flex items-center z-10">
          <div className="w-full flex items-center">
            <motion.div className="flex flex-col w-fit">
              <motion.h1
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 10,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                  },
                }}
                initial="hidden"
                animate={mainControls}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="overflow-hidden block relative whitespace-nowrap
                text-7xl font-bold w-auto text-white uppercase"
              >
                Veeno <span className=" text-base_color -ml-5">X </span>
              </motion.h1>
              <motion.div
                className="flex items-center"
                initial="initial"
                whileHover="hovered"
                variants={{
                  initial: {
                    opacity: 0,
                    y: 10,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                  },
                }}
                animate={mainControls}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <p className="text-lg text-font-80 font-normal mt-5 max-w-[600px]">
                  Experience a new era of trading with Veeno, the pioneering
                  decentralized exchange on Monad. Enjoy an intuitive user
                  interface and benefit from the{" "}
                  <span className="text-white font-bold">lowest fees</span> in
                  the market, powered by Orderly Network for seamless and
                  cost-effective trading.
                </p>
              </motion.div>
              <motion.button
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 10,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                  },
                }}
                initial="hidden"
                animate={mainControls}
                transition={{
                  duration: 0.3,
                  delay: 0.9,
                }}
                className="mt-[40px] rounded  text-white text-lg mr-auto cursor-pointer bg-base_color"
              >
                <Link href="/perp/PERP_BTC_USDC" className="w-full h-full">
                  <div className="flex items-center justify-center w-full text-lg h-full px-4 py-2">
                    Access preview{" "}
                  </div>
                </Link>
              </motion.button>
            </motion.div>
          </div>
          <motion.img
            initial="initial"
            variants={{
              initial: {
                opacity: 0,
              },
              visible: {
                opacity: 1,
              },
            }}
            animate={mainControls}
            transition={{ duration: 0.3, delay: 0.1 }}
            src="/logo/veeno-purple.png"
            className="h-[640px] z-[0]"
            style={{
              transform: "rotateZ(15deg)",
            }}
            // animate-float-y
          />
        </div>
      </div>{" "}
      <div className="w-full h-fit flex flex-col items-center bg-[#1e2126]">
        <div className="w-[90%] max-w-[1350px]">
          <div className="py-[10vh] flex items-center gap-20 justify-between w-full ">
            <div className="bg-secondary flex items-center justify-center p-5 w-[600px] h-[500px] rounded-xl">
              <Image
                src="/layer/trade.webp"
                alt={"learn to trade image"}
                height={600}
                width={500}
              />{" "}
            </div>
            <div className="flex flex-col items-start">
              <motion.h2
                // variants={{
                //   hidden: {
                //     opacity: 0,
                //     y: 10,
                //   },
                //   visible: {
                //     opacity: 1,
                //     y: 0,
                //   },
                // }}
                // initial="hidden"
                // animate={mainControls}
                // transition={{ duration: 0.3, delay: 0.3 }}
                className="overflow-hidden block relative whitespace-nowrap
  text-6xl font-bold  mb-2 w-auto  text-white text-start"
              >
                <span className="text-base_color">Learn</span> Trading
              </motion.h2>
              <h2
                className="block relative whitespace-nowrap
      text-6xl font-bold text-white mb-2 w-auto text-start"
              >
                & Earn Program
              </h2>
              <p className="text-lg text-font-60 mt-5 max-w-[600px] text-start">
                The Learn Trading and Earn program addresses the lack of trading
                knowledge by teaching individuals how to trade effectively and
                avoid irreversible losses. The program includes instructional
                videos created by a professional trader that explain each
                pattern in detail. Participants can practice trading and earn
                rewards for their efforts.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[90%] max-w-[1350px] mx-auto">
        <div className="py-[20vh] flex items-center justify-between w-full ">
          <div className="flex w-fit ">
            <div className="flex flex-col items-start">
              <h2
                className="overflow-hidden block relative whitespace-nowrap
  text-6xl font-bold  mb-2 w-auto  text-white text-start"
              >
                <span className="text-base_color text-start">Lowest fees</span>{" "}
                <br />
                across the market
              </h2>

              <p className="text-lg text-font-60 mt-5 max-w-[600px]">
                Our platform offers the lowest trading fees among all perpetual
                decentralized exchanges (DEXs) in the crypto space. By
                prioritizing cost efficiency, we empower traders to maximize
                their profits while enjoying a seamless and secure trading
                experience. With our industry-leading low fees, users can trade
                with confidence, knowing they’re getting the best value
                available.
              </p>
            </div>
          </div>
          <img
            src="https://s3.eu-central-1.amazonaws.com/tangem.cms/k_61_419d178016.png"
            alt={"learn to trade image"}
            height={400}
            width={500}
          />
        </div>
      </div>
      <div className="w-full h-fit flex flex-col items-center bg-[#1e2126]">
        <div className="w-[90%] max-w-[1350px]">
          <div className="py-[10vh] flex items-center gap-20 justify-between w-full ">
            <div className="bg-secondary flex items-center justify-center p-5 w-[600px] h-[500px] rounded-xl">
              <img
                src="https://www.ballet.com/static/banner_swap-1bb72278fb0ce04e8b09119769c9c491.png"
                alt={"learn to trade image"}
                height={400}
                width={500}
              />
            </div>
            <div className="flex w-fit mb-10 mr-[5%]">
              <div className="flex flex-col items-start">
                <h2
                  className="overflow-hidden block relative whitespace-nowrap
  text-6xl font-bold  mb-2 w-auto  text-white"
                >
                  Swap on <span className=" text-base_color">Monad</span>
                </h2>

                <p className="text-lg text-font-60 mt-5 max-w-[600px]">
                  Users will have the capability to seamlessly swap any assets
                  available on the Monad chain. This functionality ensures
                  flexibility and convenience, enabling users to exchange a wide
                  variety of digital assets within the ecosystem, enhancing
                  their overall experience and providing greater control over
                  their transactions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
