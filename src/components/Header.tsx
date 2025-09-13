import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const navLinks = [
    { href: '#inicio', label: 'Início' },
    { href: '#sobre', label: 'Sobre' },
    { href: '#servicos', label: 'Serviços' },
    { href: '#habilidades', label: 'Habilidades' },
    { href: '#projetos', label: 'Projetos' },
    { href: '#blog', label: 'Blog' },
    { href: '#contato', label: 'Contato' },
  ];

  const getLinkHref = (hash: string) => {
    return isHomePage ? hash : `/${hash}`;
  };

  return (
    <header className="bg-dark-navy/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a href={getLinkHref('#inicio')} className="text-2xl font-bold text-white">
            RVS
            <span className="text-light-cyan">.</span>
          </a>
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={getLinkHref(link.href)}
                className="text-gray-300 hover:text-light-cyan transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-dark-navy pb-4">
          <nav className="flex flex-col items-center space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={getLinkHref(link.href)}
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-light-cyan transition-colors duration-300 text-lg"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;