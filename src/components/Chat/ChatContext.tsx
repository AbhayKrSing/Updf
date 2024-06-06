import { ReactNode, createContext, useRef, useState } from "react";
import { useToast } from "../ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { trpc } from "@/app/_trpc/client";
import { INFINITE_QUERY_LIMIT } from "@/config/Infinite_query";

interface StreamResponse {
  addMessage: () => void;
  message: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
}
type Props = {
  children: ReactNode;
  fileid: string;
};

export const ChatContext = createContext<StreamResponse>({
  addMessage: () => {},
  message: "",
  handleInputChange: () => {},
  isLoading: false,
});

export const ChatContextProvider = ({ children, fileid }: Props) => {
  const InputMessage = useRef<string>();
  const utils = trpc.useUtils();
  const [message, setMessage] = useState<string>("");
  const [isLoading, setisLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const res = await fetch("/api/message", {
        method: "POST",
        body: JSON.stringify({
          fileId: fileid,
          message,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to send Message");
      }
      console.log(await res.json());
      return res.body;
    },
    onMutate: ({ message }) => {
      //save message of input if anything goes wrong we will set it back to input
      InputMessage.current = message;
      setMessage("");
      //step1 (cancel ongoing fetch so that no effect will take place on optimistic update)
      utils.getFileMessages.cancel();

      //step2 (get cache data because if anything goes wrong we will show this instead)

      const prevMessages = utils.getFileMessages.getInfiniteData();

      // utils.getFileMessages.setInfiniteData(
      //   {
      //     fileId: fileid,
      //     limit: INFINITE_QUERY_LIMIT,
      //   },
      //   (old) => {
      //     if (!old) {
      //       return {
      //         pages: [],
      //         pageParams: [],
      //       };
      //     }
      //     console.log(old);
      //     return old;
      //   }
      // );
    },
  });
  const addMessage = () => {
    sendMessage({ message });
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  return (
    <ChatContext.Provider
      value={{ addMessage, message, handleInputChange, isLoading }}
    >
      {children}
    </ChatContext.Provider>
  );
};
