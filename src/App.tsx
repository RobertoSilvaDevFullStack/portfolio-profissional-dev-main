import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/admin/Dashboard";
import ManageBlog from "./pages/admin/ManageBlog";
import ManageProjects from "./pages/admin/ManageProjects";
import ManageContent from "./pages/admin/ManageContent";
import ManageLeads from "./pages/admin/ManageLeads";
import ManageComments from "./pages/admin/ManageComments";
import Notifications from "./pages/admin/Notifications";
import Backup from "./pages/admin/Backup";
import AuditLogs from "./pages/admin/AuditLogs";
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import BlogPost from "./pages/BlogPost";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/login" element={<Login />} />

            {/* Admin Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="content" element={<ManageContent />} />
                <Route path="blog" element={<ManageBlog />} />
                <Route path="projects" element={<ManageProjects />} />
                <Route path="leads" element={<ManageLeads />} />
                <Route path="comments" element={<ManageComments />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="backup" element={<Backup />} />
                <Route path="audit-logs" element={<AuditLogs />} />
              </Route>
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
