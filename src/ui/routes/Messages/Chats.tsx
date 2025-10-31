import { useMessage, type ChatType } from "@/lib/MessageContext";
import { useSession } from "@/lib/SessionContext";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

type Props = {};

export default function Chats({}: Props) {
  const { ChatStore, ChatStoreDispatch } = useMessage();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<boolean>(true);

  async function getChats() {
    setIsLoading(true);
    setSuccess(true);

    try {
      const res = await fetch("http://localhost:3000/api/chats/get", {
        credentials: "include",
      });
      const { ok, data } = (await res.json()) as {
        ok: boolean;
        data: ChatType[];
      };

      if (!ok) {
        setIsLoading(false);
        setSuccess(false);
        return;
      }

      data.forEach((chat) => ChatStoreDispatch({ type: "ADD", chat }));
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setSuccess(false);
    }
  }

  useEffect(() => {
    getChats();
  }, []);

  return (
    <div className="flex-1 flex flex-col px-2 overflow-scroll">
      <span className="bg-chart-4 text-xs text-white my-1 px-2 rounded-sm">
        Chats:
      </span>
      {ChatStore.filter((chat) => chat.Messages.length > 0).map((chat) => (
        <ChatPreview key={chat.ChatID} {...chat} />
      ))}
      {isLoading && <Loader2 className="animate-spin w-fit mx-auto size-4" />}
      {!success && (
        <div className="grid gap-y-1.5">
          <span className="text-red-500 w-fit mx-auto text-sm">
            loading failed
          </span>
          <button
            className="w-fit mx-auto bg-red-500 text-sm text-background px-3 py-1.5 rounded-sm"
            onClick={getChats}
          >
            retry
          </button>
        </div>
      )}
    </div>
  );
}

function ChatPreview({ ChatID, Members, Type, Messages, Name }: ChatType) {
  const { session } = useSession();
  const lastMessage = Messages.at(0);
  const navigate = useNavigate();

  return (
    <div
      className="bg-accent px-2 py-1.5 rounded-sm hover:brightness-105 active:brightness-95 cursor-pointer my-0.5"
      onClick={() => {
        navigate(`/messages?chat_id=${ChatID}`);
      }}
    >
      <h1>
        {Type === "DM"
          ? Members.find((m) => m.Username !== session?.user.Username)?.Username
          : Name}
      </h1>
      <span>
        <span className="italic">
          {lastMessage?.SenderUsername === session?.user.Username
            ? "you"
            : lastMessage?.SenderUsername}
          :&nbsp;
        </span>
        {lastMessage?.MessageContent.at(0)?.Text}
      </span>
    </div>
  );
}
