"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { FadeIn } from "./FadeIn";
import { CtaButton } from "./CtaButton";

const PROJECTS = [
  {
    n: "01",
    type: "Personal",
    name: "Cinematic Portfolio Experience",
    desc: "A cinematic personal portfolio blending immersive motion, layered interactions, and storytelling-driven frontend engineering.",
    imgs: [
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85",
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85",
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85",
    ],
  },
  {
    n: "02",
    type: "Academic / Development",
    name: "Smart Digital Platform",
    desc: "A scalable and responsive web application focused on usability, architecture, and real-world digital problem solving.",
    imgs: [
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85",
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85",
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85",
    ],
  },
  {
    n: "03",
    type: "Experimental",
    name: "Future Product Concept",
    desc: "A creative exploration of interaction design, motion systems, and modern product interfaces.",
    imgs: [
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85",
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85",
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85",
    ],
  },
];

function ProjectCard({
  project,
  index,
  total,
  range,
  scrollYProgress,
}: {
  project: (typeof PROJECTS)[number];
  index: number;
  total: number;
  range: [number, number];
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, range, [1, targetScale]);

  return (
    <div className="h-[85vh] sticky top-24 md:top-32 flex items-start justify-center" style={{ top: `${100 + index * 28}px` }}>
      <motion.div
        style={{ scale }}
        className="w-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] p-4 sm:p-6 md:p-8"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...({ initial: { opacity: 0, y: 60 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "100px" }, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } } as any)}
      >
        <div
          className="rounded-[40px] sm:rounded-[50px] md:rounded-[60px] p-4 sm:p-6 md:p-8 border-2"
          style={{ background: "#0C0C0C", borderColor: "#D7E2EA" }}
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6 md:mb-10">
            <div className="flex items-end gap-4 md:gap-8">
              <div
                className="hero-heading font-black"
                style={{ fontSize: "clamp(3rem, 10vw, 140px)", lineHeight: 0.9 }}
              >
                {project.n}
              </div>
              <div className="flex flex-col gap-2 pb-2 md:pb-4">
                <span className="text-xs sm:text-sm uppercase tracking-[0.3em]" style={{ color: "#7621B0" }}>
                  {project.type}
                </span>
                <h3
                  className="font-medium uppercase leading-tight"
                  style={{ color: "#D7E2EA", fontSize: "clamp(1.1rem, 2.4vw, 2.2rem)" }}
                >
                  {project.name}
                </h3>
              </div>
            </div>
            <CtaButton variant="ghost" size="sm">Live Project</CtaButton>
          </div>

          <p
            className="font-light leading-relaxed max-w-3xl mb-6 md:mb-10"
            style={{ color: "#D7E2EA", opacity: 0.7, fontSize: "clamp(0.9rem, 1.4vw, 1.15rem)" }}
          >
            {project.desc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
            <div className="sm:col-span-2 flex flex-col gap-3 sm:gap-4 md:gap-5">
              <img
                src={project.imgs[0]}
                alt=""
                className="w-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] object-cover"
                style={{ height: "clamp(130px, 16vw, 230px)" }}
                loading="lazy"
              />
              <img
                src={project.imgs[1]}
                alt=""
                className="w-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] object-cover"
                style={{ height: "clamp(160px, 22vw, 340px)" }}
                loading="lazy"
              />
            </div>
            <div className="sm:col-span-3">
              <img
                src={project.imgs[2]}
                alt=""
                className="w-full h-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] object-cover"
                style={{ minHeight: "clamp(310px, 40vw, 590px)" }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      id="projects"
      ref={containerRef}
      className="rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 relative z-10 px-4 sm:px-6 md:px-10 pt-20 pb-32"
      style={{ background: "#0C0C0C" }}
    >
      <FadeIn delay={0} y={40} className="text-center mb-12 md:mb-20">
        <h2
          className="hero-heading font-black uppercase leading-none tracking-tight"
          style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
        >
          Projects
        </h2>
      </FadeIn>

      {PROJECTS.map((p, i) => {
        const start = i / PROJECTS.length;
        const end = 1;
        return (
          <ProjectCard
            key={p.n}
            project={p}
            index={i}
            total={PROJECTS.length}
            range={[start, end]}
            scrollYProgress={scrollYProgress}
          />
        );
      })}
    </section>
  );
}
