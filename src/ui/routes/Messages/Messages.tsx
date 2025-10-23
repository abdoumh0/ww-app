import ChatBox from "./ChatBox";
import Chats from "./Chats";
import People from "./People";

type Props = {};

export default function Messages({}: Props) {
  return (
    <div className="flex h-full">
      <Chats />
      <ChatBox />
      <People />
    </div>
  );
}
