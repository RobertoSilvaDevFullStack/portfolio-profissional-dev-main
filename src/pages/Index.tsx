import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
  const [seoData, setSeoData] = useState({ 
    title: 'Desenvolvedor Web Full-Stack', 
    description: 'Portfóflio de Roberto Vicente da Silva, desenvolvedor web especializado em criar soluções digitais modernas e eficientes.' 
  });

  useEffect(() => {
    const logVisit = async () => {
      try {
        await supabase.from('page_visits').insert({});
      } catch (error) {
        console.error("Error logging page visit:", error);
      }
    };
    logVisit();

    const fetchSeoData = async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('hero_title, hero_description')
        .eq('id', 1)
        .single();

      if (!error && data) {
        setSeoData({
          title: data.hero_title,
          description: data.hero_description,
        });
      }
    };
    fetchSeoData();
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