"use client";
import { trpc } from "@/app/_trpc/client";
import { Loader2, XSquare } from "lucide-react";
import ChatInput from "./ChatInput";
import Messages from "./Messages";
import { ChatContextProvider } from "./ChatContext";
interface ChatWrapperProps {
  fileId: string;
}
const ChatWrapper = ({ fileId }: ChatWrapperProps) => {
  const { isLoading, data } = trpc.getFileUploadStatus.useQuery(
    {
      fileId,
    },
    {
      refetchInterval: (data) => {
        return data?.status === "SUCCESS" || data?.status === "FAILED"
          ? false
          : 500;
      },
    }
  );
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-full">
        <div className="flex flex-col justify-center items-center flex-1">
          <Loader2 className="animate-spin" />
          <div className="text-zinc-500">We are preparing your file...</div>
        </div>
        <ChatInput />
      </div>
    );
  } else if (data?.status === "PROCESSING") {
    return (
      <div className="flex flex-col min-h-full">
        <div className="flex flex-col justify-center items-center flex-1">
          <Loader2 className="animate-spin" />
          <div className="text-zinc-500 truncate">
            This will take little longer than expected...
          </div>
        </div>
        <ChatInput />
      </div>
    );
  } else if (data?.status === "FAILED") {
    return (
      <div className="flex flex-col min-h-full">
        <div className="flex flex-col justify-center items-center flex-1">
          <XSquare className="text-red-500" />
          <div className="text-zinc-500 truncate">
            Too many pages,Update to premium plans...
          </div>
        </div>
        <ChatInput />
      </div>
    );
  }
  return (
    <ChatContextProvider fileid={fileId}>
      <div className="flex flex-col min-h-full">
        <div className="flex flex-col justify-center items-center flex-1">
          <Messages />
        </div>

        <ChatInput isDisable />
      </div>
    </ChatContextProvider>
  );
};

export default ChatWrapper;
