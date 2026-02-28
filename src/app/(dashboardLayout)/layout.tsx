import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { userRole } from "@/constants/allType";
import { userService } from "@/services/auth.service";

export default async function DashboardLayout({
  admin,
  provider,
  customer,
}: Readonly<{
  admin: React.ReactNode;
  provider: React.ReactNode;
  customer: React.ReactNode;
}>) {
  const { data } = await userService.getSession();
  console.log(data);
  const user = data?.user;

  return (
    <SidebarProvider>
      <AppSidebar role={user.role} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min">
            {user?.role === userRole.admin && admin}
            {user?.role === userRole.provider && provider}
            {user?.role === userRole.customer && customer}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
