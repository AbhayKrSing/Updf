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
  const InputMessage = useRef<string>("");
  const utils = trpc.useUtils();
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
      return res.body;
    },
    onMutate: ({ message }) => {
      setIsLoading(true);
      //save message of input if anything goes wrong we will set it back to input
      InputMessage.current = message;
      setMessage("");
      //step1 (cancel ongoing fetch so that no effect will take place on optimistic update)
      utils.getFileMessages.cancel();

      //step2 (get cache data because if anything goes wrong we will show this instead)
      const prevMessages = utils.getFileMessages.getInfiniteData();

      utils.getFileMessages.setInfiniteData(
        {
          fileId: fileid,
          limit: INFINITE_QUERY_LIMIT,
        },
        (old) => {
          if (!old) {
            return {
              pages: [],
              pageParams: [],
            };
          }
          return {
            ...old,
            pages: [
              {
                messages: [
                  {
                    id: crypto.randomUUID(),
                    text: message,
                    createdAt: new Date().toISOString(),
                    isUserMessage: true,
                  },
                  ...old.pages[0].messages,
                ],
              },
              ...old.pages.slice(1),
            ],
          };
        }
      );
      return {
        prevMessages, //will do more work if needed
      };
    },
    onSuccess: async (stream) => {
      if (!stream) {
        toast({
          title: "Error",
          description: "Your message could not be sent. Please try again.",
          variant: "destructive",
        });
        return stream;
      }
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedText = "";
      let tempMessageId = "temp-id";

      // Update the UI with a temporary message initially
      utils.getFileMessages.setInfiniteData(
        {
          fileId: fileid,
          limit: INFINITE_QUERY_LIMIT,
        },
        (old) => {
          if (!old) {
            return {
              pages: [],
              pageParams: [],
            };
          }
          return {
            ...old,
            pages: [
              {
                messages: [
                  {
                    id: tempMessageId,
                    text: "",
                    createdAt: new Date().toISOString(),
                    isUserMessage: false,
                  },
                  ...old.pages[0].messages,
                ],
              },
              ...old.pages.slice(1),
            ],
          };
        }
      );
      setIsLoading(false);
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;

        // Update the UI with the streamed message progressively
        utils.getFileMessages.setInfiniteData(
          {
            fileId: fileid,
            limit: INFINITE_QUERY_LIMIT,
          },
          (old) => {
            if (!old) {
              return {
                pages: [],
                pageParams: [],
              };
            }
            return {
              ...old,
              pages: [
                {
                  messages: old.pages[0].messages.map((msg) =>
                    msg.id === tempMessageId
                      ? { ...msg, text: accumulatedText }
                      : msg
                  ),
                },
                ...old.pages.slice(1),
              ],
            };
          }
        );
      }
    },

    onSettled: () => {
      utils.getFileMessages.invalidate();
    },
    onError: (err, val, context) => {
      setIsLoading(false);
      setMessage(InputMessage.current);
      utils.getFileMessages.setInfiniteData(
        {
          fileId: fileid,
          limit: INFINITE_QUERY_LIMIT,
        },
        context?.prevMessages //will do more work if needed
      );
      toast({
        title: "Error",
        description: "Your message could not be sent. Please try again." + err,
        variant: "destructive",
      });
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
