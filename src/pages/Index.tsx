import { useEffect, useState, lazy, Suspense } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import IntersectionObserverWrapper from "@/components/IntersectionObserverWrapper";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load heavy components for better performance
const MatrixRain = lazy(() => import("@/components/MatrixRain"));
const AboutSection = lazy(() => import("@/components/AboutSection"));
const ServicesSection = lazy(() => import("@/components/ServicesSection"));
const SkillsSection = lazy(() => import("@/components/SkillsSection"));
const PortfolioSection = lazy(() => import("@/components/PortfolioSection"));
const BlogSection = lazy(() => import("@/components/BlogSection"));
const ContactSection = lazy(() => import("@/components/ContactSection"));

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

  const SectionSkeleton = () => (
    <div className="py-20 px-4">
      <div className="max-w-6xl mx-auto space-y-4">
        <Skeleton className="h-12 w-64 mx-auto" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );

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

        <IntersectionObserverWrapper>
          <Suspense fallback={<SectionSkeleton />}>
            <AboutSection id="sobre" />
          </Suspense>
        </IntersectionObserverWrapper>

        <IntersectionObserverWrapper>
          <Suspense fallback={<SectionSkeleton />}>
            <ServicesSection id="servicos" />
          </Suspense>
        </IntersectionObserverWrapper>

        <IntersectionObserverWrapper>
          <Suspense fallback={<SectionSkeleton />}>
            <SkillsSection id="habilidades" />
          </Suspense>
        </IntersectionObserverWrapper>

        <IntersectionObserverWrapper>
          <Suspense fallback={<SectionSkeleton />}>
            <PortfolioSection id="projetos" />
          </Suspense>
        </IntersectionObserverWrapper>

        <IntersectionObserverWrapper>
          <Suspense fallback={<SectionSkeleton />}>
            <BlogSection id="blog" />
          </Suspense>
        </IntersectionObserverWrapper>

        <IntersectionObserverWrapper>
          <Suspense fallback={<SectionSkeleton />}>
            <ContactSection id="contato" />
          </Suspense>
        </IntersectionObserverWrapper>
      </main>
      <FloatingWhatsApp />
      <Footer />
    </div>
  );
};

export default Index;