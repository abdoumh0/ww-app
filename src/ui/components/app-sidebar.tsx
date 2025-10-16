import {
  ArrowLeft,
  HandCoins,
  Home,
  LogOut as LogOutIcon,
  Package,
  Router,
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
import { useSession } from "@/lib/SessionContext";
import { LogOut } from "@/lib/utils";

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

const authItems = [];

export function AppSidebar() {
  const { toggleSidebar, setOpen } = useSidebar();
  const { session, refreshSession } = useSession();

  useLayoutEffect(() => {
    setOpen(false);
  }, []);

  return (
    <Sidebar>
      <SidebarHeader>
        <span className="flex justify-between pt-0.5  items-center">
          <Button size={"sm"}>Login</Button>
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
              {session ? null : (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to={"/auth"}>
                      {({ isActive }) => (
                        <span className="flex items-center w-full gap-1">
                          <Router />
                          <span>Auth</span>
                          {isActive ? (
                            <ArrowLeft size={16} className="ml-auto" />
                          ) : null}
                        </span>
                      )}
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
                    console.log("first");
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
