import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Newspaper, Briefcase, LogOut, FileText, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const navLinks = [
    { to: '/admin', icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard' },
    { to: '/admin/content', icon: <FileText className="h-5 w-5" />, label: 'Gerenciar Conteúdo' },
    { to: '/admin/blog', icon: <Newspaper className="h-5 w-5" />, label: 'Gerenciar Blog' },
    { to: '/admin/projects', icon: <Briefcase className="h-5 w-5" />, label: 'Gerenciar Projetos' },
    { to: '/admin/leads', icon: <MessageSquare className="h-5 w-5" />, label: 'Gerenciar Leads' },
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
                  end={link.to === '/admin'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-light-cyan text-dark-navy'
                        : 'hover:bg-gray-800/50'
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
      <main className="flex-1 p-10 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;