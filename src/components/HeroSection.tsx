"use client";
import { FadeIn } from "./FadeIn";
import { Magnet } from "./Magnet";
import { CtaButton } from "./CtaButton";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative h-screen flex flex-col px-6 md:px-10"
      style={{ overflowX: "clip" }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 cinematic-glow pointer-events-none" />

      {/* Role label */}
      <FadeIn delay={0.1} y={-10} className="relative z-20 mt-8 sm:mt-10">
        <div className="flex items-center gap-3 text-[10px] sm:text-xs md:text-sm tracking-[0.4em] text-[#D7E2EA]/70 uppercase">
          <span className="inline-block w-2 h-2 rounded-full" style={{ background: "#4a9eff", boxShadow: "0 0 12px #4a9eff" }} />
          Full Stack Developer
          <span className="hidden sm:inline opacity-40">— Induri Venkata Reddy</span>
        </div>
      </FadeIn>

      {/* Hero heading */}
      <div className="relative z-20 overflow-hidden flex-1 flex flex-col justify-center">
        <FadeIn delay={0.15} y={40}>
          <h1 className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-[42vw] sm:text-[36vw] md:text-[30vw] lg:text-[26vw]">
            iv
          </h1>
        </FadeIn>
      </div>

      {/* Portrait magnet */}
      <Magnet
        padding={150}
        strength={3}
        className="absolute left-1/2 -translate-x-1/2 z-10 top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0 w-[260px] sm:w-[340px] md:w-[420px] lg:w-[500px]"
      >
        <FadeIn delay={0.6} y={30}>
          <div className="relative">
            <div
              className="absolute inset-0 blur-3xl opacity-50 rounded-full"
              style={{ background: "radial-gradient(circle, #7621B0 0%, transparent 60%)" }}
            />
            <img
              src="https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png"
              alt="IV Reddy portrait"
              className="relative w-full h-auto"
              loading="eager"
            />
          </div>
        </FadeIn>
      </Magnet>

      {/* Bottom bar */}
      <div className="relative z-20 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pb-7 sm:pb-8 md:pb-10">
        <FadeIn delay={0.35} y={20}>
          <p
            className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[200px] sm:max-w-[260px] md:max-w-[320px]"
            style={{ fontSize: "clamp(0.75rem, 1.2vw, 1.25rem)" }}
          >
            a full stack developer focused on building cinematic digital experiences, scalable products, and meaningful web solutions
          </p>
        </FadeIn>

        <FadeIn delay={0.5} y={20}>
          <div className="flex flex-wrap items-center gap-3">
            <CtaButton href="#projects" size="sm">View Work</CtaButton>
            <CtaButton href="#contact" variant="ghost" size="sm">Let&apos;s Talk</CtaButton>
            <CtaButton href="#contact" variant="ghost" size="sm">Resume</CtaButton>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
