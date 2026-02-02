import { LayoutDashboard, BookMarked } from "lucide-react";
import nc_logo from "@/assets/images/nc_logo.png";
import { Link } from "react-router";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { SidebarFooter, useSidebar } from "./ui/sidebar";
import { useLocation, useNavigate } from "react-router";
import { Separator } from "./ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "../lib/api";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Handbook",
    url: "/handbook",
    icon: BookMarked,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  async function handleSignOut() {
    try {
      await api.get("/auth/logout"); // wait for server to process logout
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  }

  return (
    <Sidebar variant="floating" collapsible="icon">
      {state === "expanded" && (
        <SidebarHeader className="h-20">
          <div className="w-full h-full p-4 bg-nc-blue rounded shadow flex gap-4 items-center">
            <div className="h-full aspect-square bg-white rounded-full">
              <img src={nc_logo} alt="" />
            </div>
            <div className="font-bold text-white/90">Norzagaray College</div>
          </div>
        </SidebarHeader>
      )}

      <Separator className="max-w-4/5 mx-auto" />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.url)}
                    className="rounded transition-all"
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {state === "expanded" && (
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="w-full bg-white rounded shadow p-2 flex gap-2 cursor-pointer">
                    <div className="bg-red-400 w-12 h-12 overflow-hidden">
                      <img
                        src="https://scontent.fmnl14-1.fna.fbcdn.net/v/t39.30808-6/577240231_122095390509110996_4730731300679988931_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHGK5iE0UvELydwDi_ZGcNTAEyozAQIpJIATKjMBAikkv5CftPDVQD_eP28hve8e7ZvUPmb7ZhMQD_5Nf7Y1OSv&_nc_ohc=1BRMPE4ZppEQ7kNvwGLTugy&_nc_oc=Adm8BMNwDpPEnqQ-eImFtb0TmnqemMB2oFKutjaA6mrciQsjLtD4WYshVdMzxpCRhXU&_nc_zt=23&_nc_ht=scontent.fmnl14-1.fna&_nc_gid=REDCHGjlTgBTMnaKgg9eBA&oh=00_AfqpF-YuQie8h5Ulf9nuiYhKTsaZLd-IJWvMHq4xwCdsTg&oe=6978061B"
                        alt="profile-picture"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-md wrap-break-word w-20 font-medium">
                        Zairus V. Bermillo
                      </p>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="right"
                  sideOffset={4}
                  className="w-[--radix-popper-anchor-width] -translate-y-8 -translate-x-4"
                >
                  <DropdownMenuItem onClick={handleSignOut}>
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
