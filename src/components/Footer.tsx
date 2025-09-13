const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-dark-navy/50 border-t border-gray-800 py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
        <p>&copy; {currentYear} Roberto Vicente da Silva. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;