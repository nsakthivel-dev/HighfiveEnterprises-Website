import { Metadata } from "next";
import WhatWeDo from "@/pages/WhatWeDo";

export const metadata: Metadata = {
  title: "What We Do",
  description: "Explore our expertise in web development, mobile apps, UI/UX design, and AI solutions. We build high-performance digital products tailored for your business needs.",
};

export default function Page() {
  return <WhatWeDo />;
}
