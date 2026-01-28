import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Outlet, useLocation } from "react-router";

export default function MainLayout() {
  const { pathname } = useLocation();

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar className="z-50" />
      <main className="w-full min-h-screen px-4 py-4 flex flex-col">
        {/* <div className="flex items-center gap-4">
          <SidebarTrigger className="scale-125" />
          <p className="font-medium text-xl">
            {pathname.slice(1).toUpperCase()}
          </p>
        </div> */}

        {/* <Separator className="mt-2 mb-4" /> */}

        <div className="flex-1">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
