"use client";

import { trpc } from "@/app/_trpc/client";
import { INFINITE_QUERY_LIMIT } from "@/config/Infinite_query";
import { Loader2, MessageSquare } from "lucide-react";
import React, { useContext, useEffect } from "react";
import Message from "./Message";
import Skeleton from "react-loading-skeleton";
import { ChatContext } from "./ChatContext";
import { useInView } from "react-intersection-observer";
interface MessageProps {
  fileId: string;
}
const Messages = ({ fileId }: MessageProps) => {
  const { ref, inView, entry } = useInView({
    threshold: 0,
  });
  const loadingMessages = {
    id: "loading-message",
    createdAt: new Date().toISOString(),
    text: (
      <>
        <span className="flex items-center justify-center">
          <Loader2 className="animate-spin w-4 h-4" />
        </span>
      </>
    ),
    isUserMessage: false,
  };
  const { isLoading } = useContext(ChatContext);
  const { data, fetchNextPage } = trpc.getFileMessages.useInfiniteQuery(
    { fileId, limit: INFINITE_QUERY_LIMIT },
    {
      getNextPageParam: (lastpage) => {
        return lastpage.nextCursor;
      },
      keepPreviousData: true,
    }
  );
  const messages = data?.pages.flatMap((page) => page.messages);
  const combinedMessages = [
    ...(isLoading ? [loadingMessages] : []),
    ...(messages ?? []),
  ];
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);
  return (
    <div className="flex max-h-[calc(85vh)] flex-1  border-zinc-200 flex-col-reverse overflow-y-auto gap-1">
      {combinedMessages && combinedMessages.length > 0 ? (
        combinedMessages.map((message, i) => {
          const issameUserMessage = //to check logic here
            combinedMessages[i]?.isUserMessage ===
            combinedMessages[i - 1]?.isUserMessage;
          if (combinedMessages.length - 1 == i) {
            return (
              <Message
                ref={ref}
                key={message.id}
                issameUserMessage={issameUserMessage}
                message={message}
              />
            );
          }
          return (
            <Message
              key={message.id}
              issameUserMessage={issameUserMessage}
              message={message}
            />
          );
        })
      ) : isLoading ? (
        <div className="w-full flex flex-col gap-2">
          <Skeleton height={16} />
          <Skeleton height={16} />
          <Skeleton height={16} />
          <Skeleton height={16} />
          <Skeleton height={16} />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <MessageSquare className="h-8 w-8 text-black" />
          <h3 className="font-semibold text-xl">You&apos;re all set!</h3>
          <p className="text-zinc-500 text-sm">
            Ask your first question to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default Messages;
