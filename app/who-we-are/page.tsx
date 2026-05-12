import { Metadata } from "next";
import WhoWeAre from "@/pages/WhoWeAre";

export const metadata: Metadata = {
  title: "Who We Are | Lupus Venture - Tech Agency, Chennai",
  description: "Meet the team behind Lupus Venture. We're a Chennai-based tech agency building SaaS products, mobile apps, and web solutions for growing businesses.",
  alternates: {
    canonical: "https://www.lupusventure.com/who-we-are",
  },
  openGraph: {
    title: "Who We Are | Lupus Venture - Tech Agency, Chennai",
    description: "Meet the team behind Lupus Venture. We're a Chennai-based tech agency building SaaS products, mobile apps, and web solutions for growing businesses.",
    url: "https://www.lupusventure.com/who-we-are",
  },
  twitter: {
    title: "Who We Are | Lupus Venture - Tech Agency, Chennai",
    description: "Meet the team behind Lupus Venture. We're a Chennai-based tech agency building SaaS products, mobile apps, and web solutions for growing businesses.",
  },
};

export default function Page() {
  return <WhoWeAre />;
}
