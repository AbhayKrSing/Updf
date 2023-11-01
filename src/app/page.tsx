import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { cn } from "@/lib/utils";
import "./globals.css";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
export default function Home() {
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
        {/* <Link href={"/dashboard"} target="_blank">
          <Button>
            Get Started <ArrowRight />
          </Button>
        </Link> */}
      </MaxWidthWrapper>
      <MaxWidthWrapper>
        <div className="relative isolate">
          <div
            aria-hidden="true"
            className="absolute top-0 -z-10 w-[100%] bg-gradient-to-r from-indigo-500 via-purple-500  to-pink-500 -translate-x-2 rotate-3 pointer-events-none aspect-[1155/578] overflow-hidden blur-3xl transform-gpu opacity-20"
          ></div>
          <div>Image dalni hai idhar</div>
        </div>
      </MaxWidthWrapper>
    </>
  );
}
