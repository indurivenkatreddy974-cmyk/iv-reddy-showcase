"use client";
import { FadeIn } from "./FadeIn";

const INTERNSHIPS = [
  {
    company: "Tech Innovation Labs",
    role: "Full Stack Developer Intern",
    duration: "2025 — Present",
    contributions: "Built modular React components, contributed to API integrations, and improved performance on key product flows.",
  },
  {
    company: "Digital Studio Collective",
    role: "Frontend Engineering Intern",
    duration: "2024 — 2025",
    contributions: "Crafted motion-driven landing pages, collaborated on design systems, and shipped responsive interfaces.",
  },
  {
    company: "Open Source Contributions",
    role: "Independent Contributor",
    duration: "Ongoing",
    contributions: "Published utilities, improved documentation, and engaged with developer communities around modern web tooling.",
  },
];

export function InternshipsSection() {
  return (
    <section id="internships" className="px-5 sm:px-8 md:px-10 py-24 sm:py-32 relative" style={{ background: "#0C0C0C" }}>
      <FadeIn delay={0} y={40} className="text-center mb-6">
        <h2
          className="hero-heading font-black uppercase leading-none tracking-tight"
          style={{ fontSize: "clamp(2.5rem, 10vw, 130px)" }}
        >
          Internships
        </h2>
      </FadeIn>

      <FadeIn delay={0.15} y={20} className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
        <p className="text-[#D7E2EA]/70 font-light leading-relaxed" style={{ fontSize: "clamp(0.95rem, 1.4vw, 1.15rem)" }}>
          Learning through practical exposure, team collaboration, and real-world software development workflows while strengthening technical and problem-solving skills.
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 max-w-6xl mx-auto">
        {INTERNSHIPS.map((item, i) => (
          <FadeIn key={item.company} delay={i * 0.15} y={40}>
            <div className="tech-card rounded-3xl p-6 md:p-8 h-full flex flex-col gap-4">
              <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: "#4a9eff" }}>
                {item.duration}
              </span>
              <h3 className="font-medium uppercase tracking-wide text-[#D7E2EA] text-lg md:text-xl">
                {item.company}
              </h3>
              <div className="text-sm uppercase tracking-widest" style={{ color: "#7621B0" }}>
                {item.role}
              </div>
              <p className="text-[#D7E2EA]/60 font-light leading-relaxed text-sm md:text-base mt-auto">
                {item.contributions}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
