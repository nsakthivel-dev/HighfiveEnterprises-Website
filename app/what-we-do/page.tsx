import { Metadata } from "next";
import WhatWeDo from "@/pages/WhatWeDo";

export const metadata: Metadata = {
  title: "Our Services | Web, Mobile App & SaaS Development - Lupus Venture",
  description: "Lupus Venture offers end-to-end web development, React Native mobile apps, SaaS product development, and UI/UX design services for startups.",
  alternates: {
    canonical: "https://www.lupusventure.com/what-we-do",
  },
  openGraph: {
    title: "Our Services | Web, Mobile App & SaaS Development - Lupus Venture",
    description: "Lupus Venture offers end-to-end web development, React Native mobile apps, SaaS product development, and UI/UX design services for startups.",
    url: "https://www.lupusventure.com/what-we-do",
  },
  twitter: {
    title: "Our Services | Web, Mobile App & SaaS Development - Lupus Venture",
    description: "Lupus Venture offers end-to-end web development, React Native mobile apps, SaaS product development, and UI/UX design services for startups.",
  },
};

export default function Page() {
  return <WhatWeDo />;
}
