"use client";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { toast } from "./ui/use-toast";
import { useResizeDetector } from "react-resize-detector";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();
interface PdfRendererProps {
  url: string;
}
const PdfRenderer = ({ url }: PdfRendererProps) => {
  const { width, height, ref } = useResizeDetector();
  const [TotalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setcurrentPage] = useState<number>(1);
  const customPageValidator = z.object({
    page: z.string().refine((num) => {
      //refine kiya hai idhar
      return Number(num) >= 1 && Number(num) <= TotalPages;
    }),
  });
  type TcustomPageValidator = z.infer<typeof customPageValidator>;
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TcustomPageValidator>({
    defaultValues: {
      page: "1",
    },
    resolver: zodResolver(customPageValidator),
  });

  return (
    <div className="flex flex-col w-full h-screen border border-zinc-300 shadow-lg">
      <div className="flex items-center justify-between p-4 border-b border-zinc-300">
        <div className="flex gap-1 items-center">
          <Button
            variant={"ghost"}
            aria-label="previous page"
            className="w-12"
            disabled={currentPage === 1}
            onClick={() => {
              setcurrentPage((prev) => {
                if (prev > 1) {
                  return prev - 1;
                }
                return 1;
              });
            }}
          >
            <ChevronDown />
          </Button>
          <Input
            className={cn(
              "w-12 h-10",
              errors.page && " focus-visible:ring-red-500"
            )}
            {...register("page")}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit(({ page }) => {
                  setcurrentPage(Number(page));
                  setValue("page", page);
                })();
              }
            }}
          />
          <p className="text-lg">/{TotalPages ? TotalPages : "x"}</p>
          <Button
            variant={"ghost"}
            aria-label="next page"
            className="w-12"
            disabled={currentPage === TotalPages}
            onClick={() => {
              setcurrentPage((prev) => {
                if (prev < TotalPages) {
                  return prev + 1;
                }
                return TotalPages;
              });
            }}
          >
            <ChevronUp />
          </Button>
        </div>
      </div>
      <div
        className="flex-1 relative max-h-max overflow-auto bg-zinc-200"
        ref={ref}
        style={{ scrollbarWidth: "none" }}
      >
        <Document
          file={url}
          className="w-full h-full flex justify-center"
          loading={
            <div className="flex justify-center">
              <Loader2 className="animate-spin w-6 h-6" />
            </div>
          }
          onLoadError={() => {
            toast({
              title: "pdf not loaded",
              description: "Try again",
              variant: "destructive",
            });
          }}
          onLoadSuccess={({ numPages }) => {
            setTotalPages(numPages);
          }}
        >
          <Page
            width={width ? width : 1}
            pageNumber={currentPage}
            className="shadow-lg w-auto h-auto max-w-full max-h-full"
          />
        </Document>
      </div>
    </div>
  );
};

export default PdfRenderer;
