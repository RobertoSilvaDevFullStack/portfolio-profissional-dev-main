import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Newspaper,
  Briefcase,
  LogOut,
  FileText,
  MessageSquare,
  MessagesSquare,
  Bell,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import NotificationBell from "./NotificationBell";
import GlobalSearch from "./GlobalSearch";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const getUserId = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUserId();
  }, []);

  // Atalho Ctrl+K / Cmd+K para abrir busca
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const navLinks = [
    {
      to: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
    },
    {
      to: "/admin/content",
      icon: <FileText className="h-5 w-5" />,
      label: "Gerenciar Conteúdo",
    },
    {
      to: "/admin/blog",
      icon: <Newspaper className="h-5 w-5" />,
      label: "Gerenciar Blog",
    },
    {
      to: "/admin/projects",
      icon: <Briefcase className="h-5 w-5" />,
      label: "Gerenciar Projetos",
    },
    {
      to: "/admin/comments",
      icon: <MessagesSquare className="h-5 w-5" />,
      label: "Moderação",
    },
    {
      to: "/admin/notifications",
      icon: <Bell className="h-5 w-5" />,
      label: "Notificações",
    },
    {
      to: "/admin/leads",
      icon: <MessageSquare className="h-5 w-5" />,
      label: "Gerenciar Leads",
    },
  ];

  return (
    <div className="min-h-screen flex bg-gray-900 text-gray-200">
      <aside className="w-64 bg-dark-navy p-6 flex flex-col">
        <h1 className="text-2xl font-bold text-white mb-10">
          Admin
          <span className="text-light-cyan">.</span>
        </h1>
        <nav className="flex-grow">
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === "/admin"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-light-cyan text-dark-navy"
                        : "hover:bg-gray-800/50"
                    }`
                  }
                >
                  {link.icon}
                  <span>{link.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <Button
            onClick={handleSignOut}
            variant="ghost"
            className="w-full flex items-center justify-start gap-3 text-red-400 hover:bg-red-900/50 hover:text-red-300"
          >
            <LogOut className="h-5 w-5" />
            <span>Sair</span>
          </Button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col">
        {/* Header com busca e notificações */}
        <header className="bg-dark-navy border-b border-gray-800 px-10 py-4 flex items-center justify-between">
          {/* Botão de busca global */}
          <Button
            variant="outline"
            className="w-64 justify-start text-gray-400 border-gray-700 hover:bg-gray-800 hover:text-white"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="mr-2 h-4 w-4" />
            <span>Buscar...</span>
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-gray-600 bg-gray-800 px-1.5 font-mono text-[10px] font-medium text-gray-400">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>

          {/* Notificações */}
          {userId && <NotificationBell userId={userId} />}
        </header>

        {/* Main Content */}
        <main className="flex-1 p-10 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* GlobalSearch Dialog */}
      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
};

export default AdminLayout;
