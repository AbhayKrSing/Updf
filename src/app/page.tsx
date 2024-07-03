import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { cn } from "@/lib/utils";
import "./globals.css";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { trpc } from "./_trpc/client";
import LandingView from "../../public/assets/LandingView.png";
import fileUploadPreview from "../../public/assets/file-upload-preview.png";
import Image from "next/image";
// import { serverClient } from "./_trpc/serverClient";
export default function Home() {
  // const data = await serverClient.getUserName()   //To use in server side (make fn async)
  // const { data } = trpc.getUserName.useQuery(); //To use in client side(mark use client to use it)
  return (
    <>
      <MaxWidthWrapper
        className={cn(
          "flex flex-col justify-center items-center space-x-2 mt-20 mb-12 sm:mt-16 text-center"
        )} //may be i can add
      >
        <div className="text-sm font-semibold bg-white border shadow-md border-red-200 p-2 rounded-lg hover:border-red-500 hover:bg-red-200 transition-all">
          <p className="">Updf is now live!</p>
        </div>
        <h1 className="max-w-4xl text-5xl md:text-6xl lg:text-7xl font-bold mt-4 ">
          Get Your <span className="text-red-500">Documents</span> info in
          Seconds
        </h1>
        <p className="mt-4 mb-4 text-zinc-700 text-lg">
          Updf helps you in chating with your pdf document,Simply upload your
          file and start conversation
        </p>
        <Link
          className={buttonVariants({
            size: "lg",
            className: "mt-2",
          })}
          href={"/dashboard"}
          target="_blank"
        >
          Get Started <ArrowRight />
        </Link>
      </MaxWidthWrapper>
      {/* landing view */}
      <MaxWidthWrapper>
        <div className="relative isolate">
          <div
            aria-hidden="true"
            className="absolute top-0 -z-10 w-[100%] bg-gradient-to-r from-pink-500 via-purple-500  to-pink-500 -translate-x-2 rotate-3 pointer-events-none aspect-[1155/578] overflow-hidden blur-3xl transform-gpu opacity-10"
          ></div>
          <div className={cn("backdrop-blur-sm bg-zinc-500/10 p-2 rounded-lg")}>
            <Image src={LandingView} alt="img" />
          </div>
        </div>
      </MaxWidthWrapper>
      {/*feature section */}
      <MaxWidthWrapper>
        <h1 className="max-w-4xl text-4xl sm:text-5xl  font-bold mt-20 mb-6">
          Start chatting in minutes
        </h1>
        <p className="mt-4 mb-4 text-zinc-700 text-lg">
          Chating with your pdf document is never easier than Updf
        </p>

        {/* steps */}
        <ol className="sm:flex sm:space-x-6">
          <li className="flex-1 flex-col  my-4 sm:border-t-2 sm:border-l-0 border-l-2 ">
            <div className="sm:pl-0 pl-3 space-y-2">
              <p></p>
              <p className="text-xs text-red-500 mt-2">Step 1</p>
              <div className="text-lg font-medium">Sign up for an account</div>
              <p className="text-sm">
                Either starting out with a free plan or choose our&nbsp;
                <Link
                  href={"/preplan"}
                  className="text-red-500 underline underline-offset-2"
                >
                  proplan
                </Link>
              </p>
            </div>
          </li>
          <li className="flex-1 flex-col  my-4 sm:border-t-2 sm:border-l-0 border-l-2 ">
            <div className="sm:pl-0 pl-3 space-y-2">
              <p></p>
              <p className="text-xs text-red-500 mt-2">Step 2</p>
              <div className="text-lg font-medium">Sign up for an account</div>
              <p className="text-sm">
                Either starting out with a free plan or choose our&nbsp;
                <Link
                  href={"/preplan"}
                  className="text-red-500 underline underline-offset-2"
                >
                  proplan
                </Link>
              </p>
            </div>
          </li>
          <li className="flex-1 flex-col  my-4 sm:border-t-2 sm:border-l-0 border-l-2 ">
            <div className="sm:pl-0 pl-3 space-y-2">
              <p></p>
              <p className="text-xs text-red-500 mt-2">Step 3</p>
              <div className="text-lg font-medium">Sign up for an account</div>
              <p className="text-sm">
                Either starting out with a free plan or choose our&nbsp;
                <Link
                  href={"/preplan"}
                  className="text-red-500 underline underline-offset-2"
                >
                  proplan
                </Link>
              </p>
            </div>
          </li>
          <li></li>
        </ol>
      </MaxWidthWrapper>
      <MaxWidthWrapper>
        <div className="relative isolate">
          <div
            aria-hidden="true"
            className="absolute top-0 -z-10 w-[100%] bg-gradient-to-r from-pink-500 via-purple-500  to-pink-500 -translate-x-2 rotate-3 pointer-events-none aspect-[1155/578] overflow-hidden blur-3xl transform-gpu opacity-10"
          ></div>
          <div
            className={cn(
              "backdrop-blur-sm bg-zinc-500/10 p-2 rounded-lg mx-auto"
            )}
          >
            <Image
              src={fileUploadPreview}
              alt="img"
              width={1419}
              className="w-[90%] mx-auto"
            />
          </div>
        </div>
      </MaxWidthWrapper>
    </>
  );
}
