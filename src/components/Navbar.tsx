"use client";
import { FadeIn } from "./FadeIn";
import { CtaButton } from "./CtaButton";

const NAV = ["ABOUT", "PROJECTS", "INTERNSHIPS", "EDUCATION", "TIMELINE", "CONTACT"];

export function Navbar() {
  return (
    <FadeIn
      as="nav"
      delay={0}
      y={-20}
      className="w-full flex flex-wrap items-center justify-between gap-4 px-6 md:px-10 pt-6 md:pt-8 z-30 relative"
    >
      <div className="text-sm md:text-base font-semibold tracking-[0.3em] text-[#D7E2EA]">
        IV<span style={{ color: "#7621B0" }}>.</span>REDDY
      </div>
      <ul className="flex flex-wrap items-center gap-3 sm:gap-5 md:gap-8">
        {NAV.map((item) => (
          <li key={item}>
            <a
              href={`#${item.toLowerCase()}`}
              className="text-[#D7E2EA] font-medium uppercase tracking-wider text-xs sm:text-sm md:text-base hover:opacity-70 transition-opacity duration-200"
            >
              {item}
            </a>
          </li>
        ))}
      </ul>
      <div className="hidden md:block">
        <CtaButton href="#contact" size="sm">
          Let&apos;s Talk
        </CtaButton>
      </div>
    </FadeIn>
  );
}
