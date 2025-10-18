import {
  ArrowLeft,
  AudioWaveform,
  HandCoins,
  Home,
  LogOut as LogOutIcon,
  MailIcon,
  Package,
  Search,
  Settings,
  X,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { NavLink } from "react-router";
import { useLayoutEffect } from "react";
import { useSession, LogOut } from "@/lib/SessionContext";

const items: {
  title: string;
  url: string;
  icon: React.ReactNode;
}[] = [
  {
    title: "Home",
    url: "/",
    icon: <Home />,
  },
  {
    title: "Point Of Sale",
    url: "/pos",
    icon: <HandCoins />,
  },
  {
    title: "Inventory",
    url: "/inventory",
    icon: <Package />,
  },
];

const authItems = [
  {
    title: "Messages",
    url: "/messages",
    icon: <MailIcon />,
  },
  {
    title: "Orders",
    url: "/orders",
    icon: <Package />,
  },
  {
    title: "Browse",
    url: "/browse",
    icon: <Search />,
  },
  {
    title: "Agent",
    url: "/agent",
    icon: <AudioWaveform />,
  },
];

export function AppSidebar() {
  const { toggleSidebar, setOpen } = useSidebar();
  const { session, refreshSession } = useSession();

  useLayoutEffect(() => {
    setOpen(false);
  }, []);

  return (
    <Sidebar>
      <SidebarHeader>
        <span className="flex justify-end pt-0.5  items-center">
          <Button
            size={"icon-sm"}
            variant={"ghost"}
            onClick={() => {
              toggleSidebar();
            }}
          >
            {<X />}
          </Button>
        </span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url}>
                      {({ isActive }) => (
                        <span className="flex items-center w-full gap-1">
                          {item.icon}
                          <span>{item.title}</span>
                          {isActive ? (
                            <ArrowLeft size={16} className="ml-auto" />
                          ) : null}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {session ? (
                authItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url}>
                        {({ isActive }) => (
                          <span className="flex items-center w-full gap-1">
                            {item.icon}
                            <span>{item.title}</span>
                            {isActive ? (
                              <ArrowLeft size={16} className="ml-auto" />
                            ) : null}
                          </span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              ) : (
                <SidebarMenuItem className="mt-8">
                  <SidebarMenuButton asChild>
                    <NavLink to={"/auth"} className={"glow-on-hover"}>
                      Log in
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="settings">
                <Settings />
                <span>Settings</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {session && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Button
                  className="flex"
                  onClick={async () => {
                    await LogOut();
                    refreshSession();
                  }}
                  variant="destructive"
                >
                  <LogOutIcon />
                  <span>Log Out</span>
                </Button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
