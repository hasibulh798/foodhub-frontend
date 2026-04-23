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

  const user = data?.user;

  return (
    <SidebarProvider>
      <AppSidebar
        role={user?.role}
        userName={user?.name}
        userEmail={user?.email}
        userImage={user?.image}
      />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-muted-foreground">
              {user?.role === userRole.admin && "Admin"}
              {user?.role === userRole.provider && "Provider"}
              {user?.role === userRole.customer && "Customer"}
            </span>
            <span className="text-muted-foreground/40">•</span>
            <span className="text-muted-foreground/60 text-xs">Dashboard</span>
          </div>
        </header>
        <div className="flex flex-1 flex-col">
          <div className="min-h-screen flex-1">
            {user?.role === userRole.admin && admin}
            {user?.role === userRole.provider && provider}
            {user?.role === userRole.customer && customer}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
