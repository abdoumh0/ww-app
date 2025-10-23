import { Outlet } from "react-router";
import { ModeToggle } from "./components/ThemeChange";
import { SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { Toaster } from "sonner";
import { useWebSocket } from "./lib/WebsocketContext";
import { Wifi, WifiOff, WifiSync } from "lucide-react";
import { Input } from "./components/ui/input";

export default function Layout() {
  const { status } = useWebSocket();
  return (
    <div className="w-full h-screen flex flex-col">
      <nav className="bg-accent flex justify-between relative top-0 left-0 px-2 py-1.5">
        <SidebarTrigger
          variant={"ghost"}
          size={"icon"}
          className="bg-background size-10"
        />
        <Input type="text" placeholder="Search" className="mx-24" />
        <span className="flex items-center gap-x-2.5">
          {status === "CONNECTED" ? (
            <Wifi />
          ) : status === "CONNECTING" ? (
            <WifiSync />
          ) : (
            <WifiOff />
          )}
          <ModeToggle />
        </span>
      </nav>
      <main className="flex-1 min-h-0">
        <AppSidebar />
        <Outlet />
        <Toaster />
      </main>
    </div>
  );
}
