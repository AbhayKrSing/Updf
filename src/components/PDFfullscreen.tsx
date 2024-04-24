"use client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Document, Page } from "react-pdf";

import React, { useState } from "react";
import { DialogHeader } from "./ui/dialog";
import { Expand, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import SimpleBar from "simplebar-react";
import { toast } from "./ui/use-toast";
import { useResizeDetector } from "react-resize-detector";
interface PdfRendererProps {
  url: string;
  currentpage: number;
}
const PDFfullscreen = ({ url, currentpage }: PdfRendererProps) => {
  const { width, height, ref } = useResizeDetector();
  const [TotalPages, setTotalPages] = useState<number>(0);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>
          <Expand className="w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl w-full">
        <DialogHeader>
          <DialogDescription>
            <SimpleBar
              autoHide={false}
              className="max-h-[90vh] overflow-x-hidden"
            >
              <div
                className="flex-1 relative bg-zinc-200 "
                ref={ref}
                style={{ scrollbarWidth: "thin" }}
              >
                <Document
                  file={url}
                  className="w-full h-full flex justify-center"
                  loading={
                    <div className="flex justify-center">
                      <Loader2 className="animate-spin w-6 h-16" />
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
                    pageNumber={currentpage}
                    className="shadow-lg w-auto h-auto max-w-full"
                  />
                </Document>
              </div>
            </SimpleBar>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default PDFfullscreen;
