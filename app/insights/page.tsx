import { Metadata } from "next";
import Insights from "@/pages/Insights";

export const metadata: Metadata = {
  title: "Insights & Blog | Tech, Startups & SaaS - Lupus Venture",
  description: "Read insights on web development, mobile apps, SaaS, and startup growth from the Lupus Venture team.",
  alternates: {
    canonical: "https://www.lupusventure.com/insights",
  },
  openGraph: {
    title: "Insights & Blog | Tech, Startups & SaaS - Lupus Venture",
    description: "Read insights on web development, mobile apps, SaaS, and startup growth from the Lupus Venture team.",
    url: "https://www.lupusventure.com/insights",
  },
  twitter: {
    title: "Insights & Blog | Tech, Startups & SaaS - Lupus Venture",
    description: "Read insights on web development, mobile apps, SaaS, and startup growth from the Lupus Venture team.",
  },
};

export default function Page() {
  return <Insights />;
}
