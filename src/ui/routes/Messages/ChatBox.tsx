import { Button } from "@/components/ui/button";
import { useMessage, type ChatType } from "@/lib/MessageContext";
import { useSession } from "@/lib/SessionContext";
import { useWebSocket } from "@/lib/WebsocketContext";
import { Send } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import { useSearchParams } from "react-router";

type Props = {};

export default function ChatBox({}: Props) {
  const [searchParams] = useSearchParams();
  const { ChatStore } = useMessage();
  const { session } = useSession();
  const { socket } = useWebSocket();
  const chatRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const chat_id = searchParams.get("chat_id");
  //   const target = searchParams.get("target");

  const currentChat = ChatStore.find((c) => c.ChatID === chat_id);

  useLayoutEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [currentChat]);

  const handleMessageSend = (chatID: string, text: string): boolean => {
    if (!session) return false;
    if (!socket) {
      console.error("WebSocket is not connected.");
      return false;
    }

    const msg = {
      chat_id: chatID,
      content: text,
    };
    socket.send(JSON.stringify(msg));
    return true;
  };

  return (
    <div className="flex-2 flex flex-col pb-3 h-full">
      <div className="w-full flex-1 flex flex-col px-1.5 min-h-0">
        <span className="flex justify-between bg-accent rounded-sm px-2 py-1 my-1 ">
          <h1>
            {currentChat?.Type === "DM"
              ? currentChat?.Members.find(
                  (m) => m.Username !== session?.user.Username
                )?.Username
              : currentChat?.Name}
          </h1>
        </span>

        <div
          className="flex-1 bg-background overflow-y-scroll px-2"
          ref={chatRef}
        >
          {currentChat?.Messages.slice()
            .reverse()
            .map((message) => (
              <ChatBubble key={message.MessageID} {...message} />
            ))}
        </div>
      </div>

      <span className="flex items-center py-3 border-t border-border px-1 gap-1.5 h-fit">
        <textarea
          ref={textareaRef}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (e.currentTarget.value.trim() === "" || !currentChat) return;
              const sent = handleMessageSend(
                currentChat.ChatID,
                e.currentTarget.value
              );
              if (sent) e.currentTarget.value = "";
            }
          }}
          className="w-full resize-none p-1.5 text-sm rounded-sm bg-accent border border-border"
          rows={1}
        />
        <Button
          size="icon-sm"
          onClick={() => {
            if (!textareaRef.current) return;
            if (textareaRef.current.value.trim() === "" || !currentChat) return;
            const sent = handleMessageSend(
              currentChat.ChatID,
              textareaRef.current.value
            );
            if (sent) textareaRef.current.value = "";
          }}
        >
          <Send className="size-3.5" />
        </Button>
      </span>
    </div>
  );
}

function ChatBubble({
  MessageContent,
  SenderUsername,
}: ChatType["Messages"][number]) {
  const { session } = useSession();
  const isCurrentUser = SenderUsername === session?.user.Username;

  return (
    <div
      className={`${
        isCurrentUser ? "ml-auto bg-chart-1" : "bg-accent"
      } w-fit my-0.5 px-2 py-1.5 rounded-2xl min-w-8 text-center`}
    >
      {MessageContent.at(0)?.Text}
    </div>
  );
}
