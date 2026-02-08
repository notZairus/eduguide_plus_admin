import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar className="z-50" />
      <main className="w-full min-h-screen px-4 py-4 flex flex-col">
        <div className="flex-1">{children}</div>
      </main>
    </SidebarProvider>
  );
}
