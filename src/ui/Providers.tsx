import React from "react";
import { ThemeProvider } from "./components/theme-provider";
import { SessionProvider } from "./lib/SessionContext";
import StoreProvider from "./lib/StoreContext";
import MessageProvider from "./lib/MessageContext";
import { WebSocketProvider } from "./lib/WebsocketContext";
import { SidebarProvider } from "./components/ui/sidebar";

type Props = {
  children?: React.ReactNode;
};

export default function Providers({ children }: Props) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SessionProvider>
        <StoreProvider>
          <MessageProvider>
            <WebSocketProvider>
              <SidebarProvider>{children}</SidebarProvider>
            </WebSocketProvider>
          </MessageProvider>
        </StoreProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
