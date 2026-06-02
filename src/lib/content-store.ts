import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Project = {
  id: string;
  n: string;
  type: string;
  name: string;
  desc: string;
  liveUrl: string;
  githubUrl: string;
  tech: string[];
  imgs: [string, string, string];
};

export type Internship = {
  id: string;
  company: string;
  role: string;
  duration: string;
  contributions: string;
};

export type Education = {
  id: string;
  degree: string;
  institution: string;
  year: string;
  description: string;
};

export type TimelineItem = { id: string; title: string; desc: string };

export type ContentState = {
  hero: {
    roleLabel: string;
    name: string;
    heading: string;
    tagline: string;
    cta1: { label: string; href: string };
    cta2: { label: string; href: string };
    cta3: { label: string; href: string };
    portraitUrl: string;
  };
  about: {
    heading: string;
    body: string;
  };
  projects: Project[];
  internships: Internship[];
  educations: Education[];
  timeline: TimelineItem[];
  techStack: string[];
  contact: {
    heading: string;
    subtitle: string;
    email: string;
    primaryCta: string;
    secondaryCta: string;
  };
  media: {
    profilePhoto: string;
    resumeUrl: string;
  };
};

export type ContentActions = {
  set: <K extends keyof ContentState>(key: K, value: ContentState[K]) => void;
  patch: <K extends keyof ContentState>(key: K, value: Partial<ContentState[K]>) => void;
  reset: () => void;
};

const uid = () => Math.random().toString(36).slice(2, 10);

const DEFAULTS: ContentState = {
  hero: {
    roleLabel: "Full Stack Developer",
    name: "Induri Venkata Reddy",
    heading: "iv",
    tagline:
      "a full stack developer focused on building cinematic digital experiences, scalable products, and meaningful web solutions",
    cta1: { label: "View Work", href: "#projects" },
    cta2: { label: "Let's Talk", href: "#contact" },
    cta3: { label: "Resume", href: "#contact" },
    portraitUrl:
      "https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png",
  },
  about: {
    heading: "About Me",
    body: "I am Induri Venkata Reddy, a passionate Full Stack Developer and digital creator focused on building immersive web experiences that combine performance, design, and storytelling. My work blends clean engineering with cinematic visual thinking, creating products that feel modern, memorable, and purposeful.",
  },
  projects: [
    {
      id: uid(),
      n: "01",
      type: "Personal",
      name: "Cinematic Portfolio Experience",
      desc: "A cinematic personal portfolio blending immersive motion, layered interactions, and storytelling-driven frontend engineering.",
      liveUrl: "",
      githubUrl: "",
      tech: ["React", "Framer Motion", "Tailwind"],
      imgs: [
        "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85",
        "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85",
        "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85",
      ],
    },
    {
      id: uid(),
      n: "02",
      type: "Academic / Development",
      name: "Smart Digital Platform",
      desc: "A scalable and responsive web application focused on usability, architecture, and real-world digital problem solving.",
      liveUrl: "",
      githubUrl: "",
      tech: ["Next.js", "Node", "PostgreSQL"],
      imgs: [
        "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85",
        "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85",
        "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85",
      ],
    },
    {
      id: uid(),
      n: "03",
      type: "Experimental",
      name: "Future Product Concept",
      desc: "A creative exploration of interaction design, motion systems, and modern product interfaces.",
      liveUrl: "",
      githubUrl: "",
      tech: ["WebGL", "Three.js", "GSAP"],
      imgs: [
        "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85",
        "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85",
        "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85",
      ],
    },
  ],
  internships: [
    {
      id: uid(),
      company: "Tech Innovation Labs",
      role: "Full Stack Developer Intern",
      duration: "2025 — Present",
      contributions:
        "Built modular React components, contributed to API integrations, and improved performance on key product flows.",
    },
    {
      id: uid(),
      company: "Digital Studio Collective",
      role: "Frontend Engineering Intern",
      duration: "2024 — 2025",
      contributions:
        "Crafted motion-driven landing pages, collaborated on design systems, and shipped responsive interfaces.",
    },
    {
      id: uid(),
      company: "Open Source Contributions",
      role: "Independent Contributor",
      duration: "Ongoing",
      contributions:
        "Published utilities, improved documentation, and engaged with developer communities around modern web tooling.",
    },
  ],
  educations: [
    {
      id: uid(),
      degree: "B.Tech — Data Science",
      institution: "Currently Pursuing",
      year: "Ongoing",
      description:
        "Pursuing Bachelor of Technology in Data Science with focus on software development, problem solving, and modern computing systems.",
    },
  ],
  timeline: [
    { id: uid(), title: "Foundation", desc: "First steps into code, design, and digital craft — building intuition for the web." },
    { id: uid(), title: "Learning", desc: "Diving deep into modern stacks, frameworks, patterns, and the engineering mindset." },
    { id: uid(), title: "Building", desc: "Shipping projects with purpose — translating ideas into real, working products." },
    { id: uid(), title: "Experimenting", desc: "Exploring motion, 3D, performance, and creative interactions at the edge of the web." },
    { id: uid(), title: "Creating", desc: "Crafting cinematic, scalable, and meaningful digital experiences with intention." },
    { id: uid(), title: "Future Vision", desc: "Pushing toward immersive, AI-augmented, story-driven product experiences." },
  ],
  techStack: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Tailwind CSS", "Node.js", "Git", "GitHub", "Framer Motion"],
  contact: {
    heading: "Let's Build Something Meaningful",
    subtitle:
      "Open to collaboration, creative ideas, internships, and opportunities that push innovation and digital craftsmanship forward.",
    email: "indurivenkatreddy974@gmail.com",
    primaryCta: "Send Message",
    secondaryCta: "Email Me",
  },
  media: {
    profilePhoto: "",
    resumeUrl: "",
  },
};

export const useContent = create<ContentState & ContentActions>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      set: (key, value) => set({ [key]: value } as Partial<ContentState>),
      patch: (key, value) =>
        set((s) => ({ [key]: { ...(s[key] as object), ...(value as object) } } as Partial<ContentState>)),
      reset: () => set({ ...DEFAULTS }),
    }),
    { name: "iv-reddy-content-v1" },
  ),
);

export const newId = uid;
