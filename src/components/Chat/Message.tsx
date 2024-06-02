import { ExtendedMessage } from "@/Types/message";
import { cn } from "@/lib/utils";
import React from "react";
import Markdown from "react-markdown";
import { Icons } from "../Icons";
interface MessageProps {
  issameUserMessage: boolean;
  message: ExtendedMessage;
}
const Message = ({ message, issameUserMessage }: MessageProps) => {
  return (
    <div
      className={cn("flex items-end", {
        " justify-end": message.isUserMessage,
        " justify-start": !message.isUserMessage,
      })}
    >
      <div
        className={cn(" text-sm my-2 max-w-md py-3 px-2 ", {
          "order-1 bg-black text-white rounded-l-md rounded-t-md":
            message.isUserMessage,
          "order-2 bg-zinc-400 text-black rounded-r-md rounded-t-md":
            !message.isUserMessage,
        })}
      >
        {typeof message.text == "string" ? (
          <Markdown>{message.text}</Markdown>
        ) : (
          <div className="w-4">{message.text}</div>
        )}
      </div>
      <div
        className={cn("", {
          "order-2": message.isUserMessage,
          "order-1 ": !message.isUserMessage,
        })}
      >
        {message.isUserMessage ? (
          <div className="relative bottom-1">
            <Icons.User />
          </div>
        ) : (
          <div className="relative bottom-1">
            <Icons.icons className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
