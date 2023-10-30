import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { cn } from "@/lib/utils";
import "./globals.css";
export default function Home() {
  return (
    <>
      <MaxWidthWrapper
        className={cn(
          "flex justify-center items-center space-x-2 mt-20 mb-12 sm:mt-16"
        )}
      >
        <div className="text-sm font-semibold bg-white border shadow-md border-red-200 p-2 rounded-lg hover:border-red-500 hover:bg-red-200 transition-all">
          <p className="">Updf is now live!</p>
        </div>
      </MaxWidthWrapper>
    </>
  );
}
