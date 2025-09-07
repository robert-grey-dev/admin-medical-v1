import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useLocation } from "react-router-dom";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const getBreadcrumbs = (pathname: string) => {
  const pathMap: Record<string, string> = {
    '/admin': 'Dashboard',
    '/admin/reviews': 'Reviews',
    '/admin/doctors': 'Doctors',
    '/admin/users': 'Users',
    
  };

  const breadcrumbs = [{ label: 'Home', href: '/admin' }];
  
  if (pathname !== '/admin') {
    const label = pathMap[pathname] || 'Page';
    breadcrumbs.push({ label, href: pathname });
  }

  return breadcrumbs;
};

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const breadcrumbs = getBreadcrumbs(location.pathname);

  return (
    <div className="min-h-screen flex w-full">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="flex items-center h-full px-4 gap-4">
            <SidebarTrigger className="h-8 w-8" />
            
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((breadcrumb, index) => (
                  <React.Fragment key={breadcrumb.href}>
                    <BreadcrumbItem>
                      {index === breadcrumbs.length - 1 ? (
                        <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={breadcrumb.href}>
                          {breadcrumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}