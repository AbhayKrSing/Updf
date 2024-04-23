"use client";
import { trpc } from "@/app/_trpc/client";
import MaxWidthWrapper from "./MaxWidthWrapper";
import UploadButton from "./UploadButton";
import { Ghost, Loader2, MessageCircle, Plus, Trash } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { useState } from "react";
const Dashboard = () => {
  const [currentDeletingFile, setcurrentDeletingFile] = useState<string | null>(
    null
  );
  const utils = trpc.useUtils();
  const { data: files, isLoading } = trpc.getUserFiles.useQuery();
  const { mutate: deleteFile } = trpc.deleteFiles.useMutation({
    onSuccess: () => {
      utils.getUserFiles.invalidate();
    },
    onMutate: ({ id }) => {
      //as click on button
      setcurrentDeletingFile(id);
    },
    onSettled: () => {
      setcurrentDeletingFile(null);
    },
  });
  return (
    <MaxWidthWrapper>
      <div className=" pt-14 pb-6 max-w-7xl border-b flex justify-between">
        <h1 className="text-5xl font-bold text-gray-900">My Files</h1>

        <UploadButton />
      </div>
      {/*Display file here */}
      {files && files.length !== 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
          {files.map((file) => {
            return (
              <li
                key={file.id}
                className="col-span-1 divide-y divide-gray-200 bg-white shadow transition hover:shadow-lg"
              >
                {/*Will work on this */}
                <div className="flex flex-col divide-y divide-gray-200 flex-1">
                  <div className="flex space-x-10 items-center p-5">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"></div>
                    <Link
                      href={`/dashboard/${file.id}`}
                      className="flex flex-col gap-2"
                    >
                      <div className="truncate font-semibold">{file.name}</div>
                    </Link>
                  </div>
                  <div className="flex flex-1 justify-between truncate p-4 text-zinc-500 items-center">
                    <div className="flex items-center">
                      <Plus className="inline" />
                      {format(new Date(file.createdAt), "MMM yyyy")}
                    </div>
                    <div>
                      Message
                      <MessageCircle className="inline mx-2" />
                    </div>
                    <div>
                      <Button
                        variant={"destructive"}
                        onClick={() => {
                          deleteFile({ id: file.id });
                        }}
                      >
                        {currentDeletingFile === file.id ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          <Trash color="red" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : isLoading ? (
        <div>
          <Skeleton height={50} className="my-4" count={5} />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <Ghost className="h-8 w-8 text-zinc-800 mt-40" />
          <h3>Pretty empty around here..</h3>
          <p>Let&apos;s upload your first pdf</p>
        </div>
      )}
    </MaxWidthWrapper>
  );
};

export default Dashboard;
