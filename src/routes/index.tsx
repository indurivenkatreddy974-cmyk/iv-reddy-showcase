import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { MarqueeSection } from "@/components/MarqueeSection";
import { AboutSection } from "@/components/AboutSection";
import { ServicesSection } from "@/components/ServicesSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { InternshipsSection } from "@/components/InternshipsSection";
import { EducationSection } from "@/components/EducationSection";
import { CertificationsSection } from "@/components/CertificationsSection";
import { TimelineSection } from "@/components/TimelineSection";
import { TechStackSection } from "@/components/TechStackSection";
import { ContactSection, Footer } from "@/components/ContactSection";
import { ChatOrb } from "@/components/chatbot/ChatOrb";
import { FeaturedWorkSection } from "@/components/FeaturedWorkSection";

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
      { property: "og:url", content: "https://iv-reddy-showcase.lovable.app/" },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/13c79881-0d7d-4c13-b083-6cb0f161c5c2/id-preview-1eeb2ff5--863a0b65-556e-4116-b638-b9de484aab87.lovable.app-1783088000097.png",
      },
      { name: "twitter:title", content: "IV Reddy — Full Stack Developer" },
      {
        name: "twitter:description",
        content:
          "Cinematic portfolio of Induri Venkata Reddy — Full Stack Developer, designer, and digital craftsman.",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/13c79881-0d7d-4c13-b083-6cb0f161c5c2/id-preview-1eeb2ff5--863a0b65-556e-4116-b638-b9de484aab87.lovable.app-1783088000097.png",
      },
    ],
    links: [{ rel: "canonical", href: "https://iv-reddy-showcase.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Induri Venkata Reddy",
          alternateName: "IV Reddy",
          jobTitle: "Full Stack Developer",
          url: "https://iv-reddy-showcase.lovable.app/",
          description:
            "Full Stack Developer crafting cinematic digital experiences, scalable products, and meaningful web solutions.",
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main style={{ background: "#0C0C0C", overflowX: "clip" }} className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturedWorkSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <InternshipsSection />
      <EducationSection />
      <CertificationsSection />
      <TimelineSection />
      <TechStackSection />
      <ContactSection />
      <Footer />
      <ChatOrb />
    </main>
  );
}
