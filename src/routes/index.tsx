import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { MarqueeSection } from "@/components/MarqueeSection";
import { AboutSection } from "@/components/AboutSection";
import { ServicesSection } from "@/components/ServicesSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { InternshipsSection } from "@/components/InternshipsSection";
import { EducationSection } from "@/components/EducationSection";
import { TimelineSection } from "@/components/TimelineSection";
import { TechStackSection } from "@/components/TechStackSection";
import { ContactSection, Footer } from "@/components/ContactSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IV Reddy — Full Stack Developer" },
      {
        name: "description",
        content:
          "Induri Venkata Reddy — Full Stack Developer crafting cinematic digital experiences, scalable products, and meaningful web solutions.",
      },
      { property: "og:title", content: "IV Reddy — Full Stack Developer" },
      {
        property: "og:description",
        content:
          "Cinematic portfolio of Induri Venkata Reddy — Full Stack Developer, designer, and digital craftsman.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <main style={{ background: "#0C0C0C", overflowX: "clip" }} className="min-h-screen">
      <Navbar />
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <InternshipsSection />
      <EducationSection />
      <TimelineSection />
      <TechStackSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
