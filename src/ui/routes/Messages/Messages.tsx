import ChatBox from "./ChatBox";
import Chats from "./Chats";

type Props = {};

export default function Messages({}: Props) {
  return (
    <div className="flex h-full">
      <Chats />
      <ChatBox />
      <div className="flex-1">people</div>
    </div>
  );
}
