import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminLayout } from "./components/admin/AdminLayout";

const NotFound = lazy(() => import("./pages/NotFound"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/admin/dashboard"));
const Reviews = lazy(() => import("./pages/admin/Reviews"));
const Doctors = lazy(() => import("./pages/admin/Doctors"));
const Users = lazy(() => import("./pages/admin/Users"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<div className="p-4 text-sm text-muted-foreground">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Auth />} />
              <Route path="/auth" element={<Auth />} />
              
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <SidebarProvider>
                      <AdminLayout>
                        <Dashboard />
                      </AdminLayout>
                    </SidebarProvider>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/reviews"
                element={
                  <ProtectedRoute>
                    <SidebarProvider>
                      <AdminLayout>
                        <Reviews />
                      </AdminLayout>
                    </SidebarProvider>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/doctors"
                element={
                  <ProtectedRoute>
                    <SidebarProvider>
                      <AdminLayout>
                        <Doctors />
                      </AdminLayout>
                    </SidebarProvider>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute requireAdmin>
                    <SidebarProvider>
                      <AdminLayout>
                        <Users />
                      </AdminLayout>
                    </SidebarProvider>
                  </ProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
