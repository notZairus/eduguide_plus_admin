import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Outlet } from "react-router";

export default function DashboardLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <main className="w-full min-h-screen px-4 py-4">
        <SidebarTrigger className="scale-125" />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
