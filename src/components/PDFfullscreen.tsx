"use client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import React from "react";
import { DialogHeader } from "./ui/dialog";
import { Expand } from "lucide-react";
import { Button } from "./ui/button";

const PDFfullscreen = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>
          <Expand className="w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogDescription>Will render PDF here</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default PDFfullscreen;
