import { Metadata } from "next";
import Home from "@/pages/Home";

export const metadata: Metadata = {
  title: "Custom Web & Mobile App Development for Startups | Lupus Venture",
  description: "Custom web apps, mobile apps & SaaS solutions built for startups — Lupus Venture, Chennai. Let's turn your idea into a product.",
  alternates: {
    canonical: "https://www.lupusventure.com",
  },
  openGraph: {
    title: "Custom Web & Mobile App Development for Startups | Lupus Venture",
    description: "Custom web apps, mobile apps & SaaS solutions built for startups — Lupus Venture, Chennai. Let's turn your idea into a product.",
    url: "https://www.lupusventure.com",
    type: "website",
  },
  twitter: {
    title: "Custom Web & Mobile App Development for Startups | Lupus Venture",
    description: "Custom web apps, mobile apps & SaaS solutions built for startups — Lupus Venture, Chennai. Let's turn your idea into a product.",
  },
};

export default function Page() {
  return <Home />;
}
