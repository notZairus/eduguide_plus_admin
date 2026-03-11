import {
  LayoutDashboard,
  BookMarked,
  ChevronDown,
  FolderPlus,
  FolderClosed,
  FileText,
  Folder,
  Wrench,
  LogOut,
  Settings2,
  Settings2Icon,
  UserRoundCog,
} from "lucide-react";
import { useState } from "react";
import eg_logo from "@/assets/images/eg_logo.png";
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
} from "../components/ui/sidebar";
import { SidebarFooter, useSidebar } from "./ui/sidebar";
import { useLocation, useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { api } from "../lib/api";
import { useHandbookContext } from "../contexts/HandbookContext";
import { useAuthContext } from "../contexts/AuthContext";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
];

const collapsibleItems = [
  {
    icon: BookMarked,
    name: "Handbook App",
    open: true,
    items: [
      {
        title: "Content",
        url: "/handbook/contents",
        icon: FileText,
      },
      {
        title: "Configure",
        url: "/handbook/configure",
        icon: Wrench,
      },
    ],
  },
  {
    icon: Folder,
    name: "Quiz",
    open: true,
    items: [
      {
        title: "Quiz Creator",
        url: "/quiz/create",
        icon: FolderPlus,
      },
      {
        title: "Question Bank",
        url: "/questions",
        icon: FolderClosed,
      },
    ],
  },
];

function getInitials(first?: string, last?: string): string {
  return [first?.[0], last?.[0]].filter(Boolean).join("").toUpperCase();
}

function getDisplayName(
  first?: string,
  middle?: string,
  last?: string,
): string {
  const middleAbbr = middle
    ? middle.split(" ").length === 1
      ? `${middle[0]}.`
      : `${middle.split(" ")[0][0]}${middle.split(" ")[1][0]}.`
    : "";
  return [first, middleAbbr, last].filter(Boolean).join(" ");
}

export function AppSidebar() {
  const { state } = useSidebar();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { handbook, setHandbook, setTopics } = useHandbookContext();
  const { auth } = useAuthContext();

  const [groups, setGroups] = useState(() =>
    collapsibleItems.map((g) => ({ ...g })),
  );

  async function handleSignOut() {
    try {
      await api.get("/auth/logout");
      setHandbook(null);
      setTopics([]);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  }

  const initials = getInitials(auth?.firstName, auth?.lastName);
  const displayName = getDisplayName(
    auth?.firstName,
    auth?.middleName,
    auth?.lastName,
  );

  return (
    <Sidebar variant="floating" collapsible="icon">
      {/* ── Header ── */}
      {state === "expanded" && (
        <SidebarHeader className="p-0">
          <div
            style={{ backgroundColor: handbook?.color ?? "#142e67" }}
            className="w-full p-4 flex flex-col items-center gap-3"
          >
            <div className="w-16 h-16 rounded-full ring-2 ring-white/30 overflow-hidden bg-white/10 flex items-center justify-center">
              <img
                src={handbook?.logo?.url || eg_logo}
                alt="logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <p className="font-semibold text-white text-sm leading-tight">
                {handbook?.title ?? "EduGuide+"}
              </p>
              <p className="text-white/50 text-xs mt-0.5">Admin Portal</p>
            </div>
          </div>
        </SidebarHeader>
      )}

      {/* ── Nav ── */}
      <SidebarContent className="px-2 py-3">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="px-2 mb-1 text-xs font-medium text-gray-400 uppercase tracking-wider">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Flat items */}
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.url)}
                    className="rounded-lg transition-all h-9 text-sm font-medium"
                  >
                    <Link to={item.url}>
                      <item.icon size={16} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Collapsible groups */}
              {groups.map((group) => {
                const isOpen = !!group.open;
                return (
                  <SidebarMenuItem key={group.name}>
                    <SidebarMenuButton
                      className="rounded-lg transition-all h-9 text-sm font-medium w-full"
                      onClick={() =>
                        setGroups((prev) =>
                          prev.map((g) =>
                            g.name === group.name ? { ...g, open: !g.open } : g,
                          ),
                        )
                      }
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <group.icon size={16} />
                          <span>{group.name}</span>
                        </div>
                        <ChevronDown
                          size={12}
                          className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        />
                      </div>
                    </SidebarMenuButton>

                    {isOpen && (
                      <div className="ml-3 mt-0.5 pl-3 border-l border-gray-200 space-y-0.5">
                        {group.items.map((sub) => (
                          <SidebarMenuButton
                            key={sub.title}
                            asChild
                            isActive={pathname.startsWith(sub.url)}
                            className="rounded-lg h-8 text-sm transition-all"
                          >
                            <Link
                              to={sub.url}
                              className="flex items-center gap-2"
                            >
                              {sub.icon && <sub.icon size={14} />}
                              <span>{sub.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        ))}
                      </div>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── Footer ── */}
      {state === "expanded" && (
        <SidebarFooter className="p-2 border-t border-gray-100">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-3 w-full px-2 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors group">
                    {/* Avatar with initials */}
                    <div
                      style={{ backgroundColor: handbook?.color ?? "#142e67" }}
                      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white text-sm font-semibold"
                    >
                      {initials || "A"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate leading-tight">
                        {displayName || "Admin"}
                      </p>
                      <p className="text-xs text-gray-400 truncate leading-tight">
                        Administrator
                      </p>
                    </div>
                    <ChevronDown
                      size={14}
                      className="text-gray-400 shrink-0 group-hover:text-gray-600 transition-colors"
                    />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  align="start"
                  sideOffset={6}
                  className="w-(--radix-popper-anchor-width)"
                >
                  <DropdownMenuItem
                    onClick={() => navigate("/user-settings")}
                    className="cursor-pointer"
                  >
                    <UserRoundCog size={14} className="mr-2" />
                    <span>User Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                  >
                    <LogOut size={14} className="mr-2" />
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
