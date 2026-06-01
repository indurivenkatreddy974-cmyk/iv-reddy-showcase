"use client";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

function Char({
  c,
  progress,
  start,
  end,
}: {
  c: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const opacity = useTransform(progress, [start, end], [0.2, 1]);
  return (
    <span className="relative inline-block">
      <span className="opacity-0">{c === " " ? "\u00A0" : c}</span>
      <motion.span style={{ opacity }} className="absolute inset-0">
        {c === " " ? "\u00A0" : c}
      </motion.span>
    </span>
  );
}

export function AnimatedText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"],
  });

  const chars = text.split("");

  return (
    <p
      ref={ref}
      className="font-medium text-center leading-relaxed max-w-[640px] mx-auto"
      style={{ color: "#D7E2EA", fontSize: "clamp(1rem, 2vw, 1.35rem)" }}
    >
      {chars.map((c, i) => {
        const start = i / chars.length;
        const end = start + 1 / chars.length;
        return <Char key={i} c={c} progress={scrollYProgress} start={start} end={end} />;
      })}
    </p>
  );
}
