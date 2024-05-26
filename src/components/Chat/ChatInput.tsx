import { SendHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useContext, useRef } from "react";
import { ChatContext } from "./ChatContext";

interface ChatInputProps {
  isDisable?: boolean;
}
const ChatInput = ({ isDisable }: ChatInputProps) => {
  const { addMessage, isLoading, handleInputChange, message } =
    useContext(ChatContext);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  return (
    <form className="relative border rounded-md">
      <div className="flex">
        <Textarea
          maxRows={3}
          rows={1}
          placeholder="Type Something to chat..."
          autoFocus
          className="resize-none py-4 border-none"
          onChange={handleInputChange}
          value={message}
          ref={textAreaRef}
          onKeyDown={(e) => {
            if (e.key == "Enter" && !e.shiftKey) {
              addMessage();
              textAreaRef.current?.focus;
            }
          }}
        />
        <Button
          className=" my-auto"
          variant={"ghost"}
          type="button"
          onClick={() => {
            addMessage();
            textAreaRef.current?.focus;
          }}
        >
          <SendHorizontal />
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;
