import { Metadata } from "next";
import Hero from "@/components/home/hero";
import AboutSection from "@/components/home/about-section";
import ServicesPreview from "@/components/home/services-preview";
import PortfolioPreview from "@/components/home/portfolio-preview";
import ProcessSection from "@/components/home/process-section";
import Testimonials from "@/components/home/testimonials";
import LocationSection from "@/components/home/location-section";
import FAQSection from "@/components/home/faq-section";
import CTASection from "@/components/home/cta-section";

export const metadata: Metadata = {
  title: "Gleydson Tattoo | Estúdio de Tatuagem Premium",
  description: "Estúdio de tatuagem em Barcarena, PA. Especialistas em Realismo, Blackwork e Fine Line. Marque sua história com a gente.",
};

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <AboutSection />
      <ServicesPreview />
      <PortfolioPreview />
      <ProcessSection />
      <Testimonials />
      <LocationSection />
      <FAQSection />
      <CTASection />
    </main>
  );
}
