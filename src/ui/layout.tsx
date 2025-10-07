import { Outlet } from "react-router";
import { ModeToggle } from "./routes/pos/ThemeChange";
import { SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";

export default function Layout() {
  return (
    <div className="w-full">
      <nav className="bg-accent flex justify-between relative top-0 left-0 px-2 py-1.5">
        <SidebarTrigger
          variant={"ghost"}
          size={"icon"}
          className="bg-background size-10"
        />
        <ModeToggle />
      </nav>
      <main>
        <AppSidebar />
        <Outlet />
      </main>
    </div>
  );
}
