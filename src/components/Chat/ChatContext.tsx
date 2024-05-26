import { ReactNode, createContext, useState } from "react";
import { useToast } from "../ui/use-toast";
import { useMutation } from "@tanstack/react-query";
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
