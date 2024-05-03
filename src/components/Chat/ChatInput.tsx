import { SendHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

interface ChatInputProps {
  isDisable?: boolean;
}

const ChatInput = ({ isDisable }: ChatInputProps) => {
  return (
    <form className="relative border rounded-md">
      <div className="flex">
        <Textarea
          maxRows={3}
          rows={1}
          placeholder="Type Something to chat..."
          autoFocus
          className="resize-none py-4 border-none"
        />
        <Button className=" my-auto" variant={"ghost"}>
          <SendHorizontal />
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;
