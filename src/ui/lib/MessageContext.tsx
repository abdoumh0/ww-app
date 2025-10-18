"use client";
import React, { useState, createContext, useContext, useReducer } from "react";
import { uniqBy } from "lodash";

export type ChatType = {
  Messages: ({
    MessageContent: {
      MessageID: string;
      Index: number;
      MessageContentID: number;
      Text: string | null;
      Filename: string | null;
      MimeType: string | null;
      Data: Uint8Array<ArrayBufferLike> | null;
    }[];
  } & {
    ChatID: string;
    MessageID: string;
    SenderUsername: string;
    Status: string;
    CreatedAt: Date;
  })[];
  Members: {
    Username: string;
    ChatID: string;
  }[];
} & {
  Type: string;
  ChatID: string;
  Name: string;
} & {
  ChatBox: "OPEN" | "MINIMIZED" | "CLOSED";
};

type Props = {
  children: React.ReactNode;
};

type MessageContextType = {
  ChatStore: ChatType[];
  ChatStoreDispatch: React.Dispatch<{
    type: "ADD" | "REMOVE" | "UPDATE" | "ADD_MESSAGES" | "SET_CHATBOX";
    chatID?: string;
    chat: ChatType;
  }>;
  NotificationStore: ChatType[];
  setNotificationStore: React.Dispatch<React.SetStateAction<ChatType[]>>;
};

const MessageContext = createContext<MessageContextType | undefined>(undefined);

function chatStoreReducer(
  state: ChatType[],
  action: {
    type: "ADD" | "REMOVE" | "UPDATE" | "ADD_MESSAGES" | "SET_CHATBOX";
    chatID?: string;
    chat: ChatType;
  }
) {
  switch (action.type) {
    case "ADD":
      return uniqBy([...state, { ...action.chat }], "ChatID");

    case "REMOVE":
      return state.filter((chat) => chat.ChatID !== action.chat.ChatID);

    case "UPDATE":
      return state.map((chat) =>
        chat.ChatID === action.chatID ? action.chat : chat
      );

    case "ADD_MESSAGES":
      const chat = state.find((c) => c.ChatID === action.chat.ChatID);
      if (!chat)
        return chatStoreReducer(state, {
          type: "ADD",
          chatID: action.chat.ChatID,
          chat: action.chat,
        });
      else {
        return state.map((c) =>
          c.ChatID === action.chat.ChatID
            ? {
                ...c,
                Messages: uniqBy(
                  [...action.chat.Messages, ...c.Messages],
                  "MessageID"
                ),
              }
            : c
        );
      }

    case "SET_CHATBOX":
      const exi = state.find((c) => c.ChatID == action.chat.ChatID);
      if (!exi) {
        return state;
      } else
        return state.map((c) => {
          if (c.ChatID == exi.ChatID) {
            return { ...c, ChatBox: action.chat.ChatBox };
          } else {
            return c;
          }
        });

    default:
      return state;
  }
}

export default function MessageProvider({ children }: Props) {
  const [NotificationStore, setNotificationStore] = useState<ChatType[]>([]);
  const [ChatStore, ChatStoreDispatch] = useReducer(chatStoreReducer, []);

  return (
    <MessageContext.Provider
      value={{
        NotificationStore,
        setNotificationStore,
        ChatStoreDispatch,
        ChatStore,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
}

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context)
    throw new Error("useMessage must be used within a MessageProvider");
  return context;
};
