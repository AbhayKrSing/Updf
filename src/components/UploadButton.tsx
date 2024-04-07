"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import Dropzone from "react-dropzone";
import { Cloud, File } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "./ui/use-toast";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";

const UploadDropzone = () => {
  const router = useRouter();
  const [uploadProgress, setuploadProgress] = useState<number>(0);
  const { startUpload } = useUploadThing("pdfUploader");
  const { mutate: startPolling } = trpc.getFile.useMutation({
    onSuccess: (file) => {
      router.push(`/dashboard/${file.id}`);
    },
    retry: true,
  });
  const startSimulationProgress = () => {
    setuploadProgress(0);
    const interval = setInterval(() => {
      setuploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 100);
    return interval;
  };
  return (
    <Dropzone
      onDrop={async (acceptedFiles) => {
        //only one file will come because multiple not allowed
        if (acceptedFiles && acceptedFiles[0]) {
          const interval = startSimulationProgress();
          const res = await startUpload(acceptedFiles);
          if (!res) {
            toast({
              variant: "destructive",
              title: "Something went wrong",
              description: "Try again",
            });
            return;
          }
          const [fileResponse] = res;
          const key = fileResponse.key;
          if (!key) {
            toast({
              variant: "destructive",
              title: "File not uploaded",
              description: "Try again",
            });
            return;
          }
          //todo : polling(b/w client and database for file checking)
          startPolling({ key });
          setuploadProgress(100);
          clearInterval(interval);
        }
      }}
      multiple={false}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="h-64 border-2 border-dashed flex flex-col items-center  hover:bg-zinc-100"
        >
          <input type="file" {...getInputProps()} className="h-full" />
          <div className="my-auto w-[47%]">
            <label htmlFor="drop-zonefile" className="mx-auto"></label>
            <Cloud className="mx-auto" />
            <div className="truncate">
              {acceptedFiles && acceptedFiles[0] ? (
                <div className=" flex justify-center mt-4">
                  {uploadProgress >= 100 ? (
                    <>
                      <div className="border border-l">
                        <File />
                      </div>
                      <div className="border">{acceptedFiles[0].name}</div>
                    </>
                  ) : (
                    "UPLOADING..."
                  )}
                </div>
              ) : (
                <>
                  <span className="font-bold">Click to upload</span> or Drag and
                  drop
                </>
              )}
            </div>
            <div className="mt-4 text-center">PDF size upto 4 MB</div>
            {uploadProgress >= 100 || uploadProgress == 0 ? null : (
              <Progress className="h-1 mt-2 " value={uploadProgress}></Progress>
            )}
          </div>
        </div>
      )}
    </Dropzone>
  );
};
const UploadButton = () => {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Upload Pdf</Button>
        </DialogTrigger>
        <DialogContent className="rounded-md">
          <DialogHeader>
            <DialogDescription>
              <UploadDropzone />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UploadButton;
