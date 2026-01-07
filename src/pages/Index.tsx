import { useEffect, useState, lazy, Suspense } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import SkillsSection from "@/components/SkillsSection";
import PortfolioSection from "@/components/PortfolioSection";
import BlogSection from "@/components/BlogSection";
import ContactSection from "@/components/ContactSection";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

// Lazy load MatrixRain for better performance
const MatrixRain = lazy(() => import("@/components/MatrixRain"));

const Index = () => {
  const [seoData] = useState({
    title: 'Desenvolvedor Web Full-Stack',
    description: 'Portfólio de Roberto Vicente da Silva, desenvolvedor web especializado em criar soluções digitais modernas e eficientes.'
  });

  // Page visit tracking - defer to after page load
  useEffect(() => {
    // Defer analytics to not block initial render
    const timer = setTimeout(() => {
      import('@/lib/api-client').then(({ api }) => {
        api.analytics.logPageVisit({
          page: '/',
          referrer: document.referrer || undefined,
          userAgent: navigator.userAgent
        }).catch(console.error);
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="text-gray-200 font-sans antialiased">
      <SEO
        title={seoData.title}
        description={seoData.description}
      />
      <Suspense fallback={<div className="fixed inset-0 bg-dark-navy z-0" />}>
        <MatrixRain />
      </Suspense>
      <Header />
      <main className="relative z-10">
        <HeroSection id="inicio" />
        <AboutSection id="sobre" />
        <ServicesSection id="servicos" />
        <SkillsSection id="habilidades" />
        <PortfolioSection id="projetos" />
        <BlogSection id="blog" />
        <ContactSection id="contato" />
      </main>
      <FloatingWhatsApp />
      <Footer />
    </div>
  );
};

export default Index;