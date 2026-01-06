import { useEffect, useState } from "react";
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
import MatrixRain from "@/components/MatrixRain";
import SEO from "@/components/SEO";

const Index = () => {
  const [seoData] = useState({
    title: 'Desenvolvedor Web Full-Stack',
    description: 'Portfólio de Roberto Vicente da Silva, desenvolvedor web especializado em criar soluções digitais modernas e eficientes.'
  });

  // Page visit tracking can be added later via analytics API
  useEffect(() => {
    // Optional: Log page visit
    // api.analytics.logVisit({ page: '/' });
  }, []);

  return (
    <div className="text-gray-200 font-sans antialiased">
      <SEO
        title={seoData.title}
        description={seoData.description}
      />
      <MatrixRain />
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