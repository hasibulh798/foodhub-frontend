import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case userRole.admin: return "Admin";
      case userRole.provider: return "Provider";
      case userRole.customer: return "Customer";
      default: return "User";
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar
        role={user?.role}
        userName={user?.name}
        userEmail={user?.email}
        userImage={user?.image}
      />
      <SidebarInset className="bg-muted/30 dark:bg-background">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b bg-background/80 px-6 backdrop-blur-md transition-all">
          <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-primary transition-colors" />
          <Separator
            orientation="vertical"
            className="h-6"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard" className="text-muted-foreground/60 hover:text-primary font-medium">
                  {getRoleLabel(user?.role)}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-bold text-foreground">Dashboard Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="ml-auto flex items-center gap-4">
            {/* Future: Add Notifications or Quick Actions here */}
            <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
              user?.role === userRole.admin ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
              user?.role === userRole.provider ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
              'bg-primary/10 text-primary border-primary/20'
            }`}>
              {getRoleLabel(user?.role)} Mode
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4 md:p-8 animate-fade-in">
            {user?.role === userRole.admin && admin}
            {user?.role === userRole.provider && provider}
            {user?.role === userRole.customer && customer}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
