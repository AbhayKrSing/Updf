import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/trpc";

type RouterOutputs = inferRouterOutputs<AppRouter>;

type Message = RouterOutputs["getFileMessages"]["messages"];

type OmitText = Omit<Message[number], "text">;

type ExtendedText = {
  text: string | JSX.Element;
};

export type ExtendedMessage = OmitText & ExtendedText;
