"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { getOrCreateClientId } from "./utils";
import { useSession } from "./SessionContext";
import { type ChatType, useMessage } from "./MessageContext";

type WebSocketContextType = {
  socket: WebSocket | null;
  status: "CONNECTED" | "DISCONNECTED" | "CONNECTING";
};

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  status: "DISCONNECTED",
});
export type WS_Notification = {
  type: string;
  receiver_id: string;
  content: string;
  chat_object?: {
    chat_id: string;
    name: string;
    type: string;
    members: {
      chat_id: string;
      username: string;
    }[];
    new_message: {
      message_id: string;
      chat_id: string;
      sender_username: string;
      created_at: string;
      status: string;
      contents: {
        message_content_id: number;
        message_id: string;
        index: number;
        text?: string;
        filename?: string;
        mime_type?: string;
        data?: Uint8Array | null;
      }[];
    };
  };
  timestamp: string;
};

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { ChatStoreDispatch } = useMessage();
  const socketRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<
    "CONNECTED" | "DISCONNECTED" | "CONNECTING"
  >("DISCONNECTED");
  const { session } = useSession();

  useEffect(() => {
    if (!session) {
      socketRef.current?.close();
      return;
    }

    const clientId = getOrCreateClientId();
    setStatus("CONNECTING");
    //TODO use env vars
    const ws = new WebSocket(
      `http://localhost:8080/ws?client_id=${clientId}`,
      "ww-msg-protocol"
    );

    ws.onopen = () => {
      setStatus("CONNECTED");
    };

    ws.onclose = (e) => {
      setStatus("DISCONNECTED");
      console.log("WS disconnected:", e.code, " - ", e.reason);
    };

    ws.onerror = (err) => {
      console.error("WS error:", err);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data) as WS_Notification;
      if (msg.type == "ORDER_EVENT") {
        console.log("check orders");
      }
      if (!msg.chat_object) return;
      else {
        console.log("Received:", msg.chat_object);
        const chat = msg.chat_object;
        let c: ChatType = {
          ChatID: chat.chat_id,
          Name: chat.name,
          Type: chat.type,
          Members: chat.members.map((m) => {
            return { ChatID: m.chat_id, Username: m.username };
          }),
          Messages: [
            {
              ChatID: chat.new_message.chat_id,
              MessageID: chat.new_message.message_id,
              SenderUsername: chat.new_message.sender_username,
              CreatedAt: new Date(chat.new_message.created_at),
              Status: chat.new_message.status,
              MessageContent: chat.new_message.contents.map((c) => {
                return {
                  MessageContentID: c.message_content_id,
                  MessageID: c.message_id,
                  Index: c.index,
                  Text: c.text || null,
                  Filename: c.filename || null,
                  MimeType: c.mime_type || null,
                  Data: c.data || null,
                };
              }),
            },
          ],
          ChatBox: "CLOSED",
        };

        ChatStoreDispatch({
          type: "ADD_MESSAGES",
          chat: c,
        });
      }
    };
    socketRef.current = ws;

    return () => {
      ws.close();
    };
  }, [session]);

  return (
    <WebSocketContext.Provider value={{ socket: socketRef.current, status }}>
      {children}
    </WebSocketContext.Provider>
  );
};
