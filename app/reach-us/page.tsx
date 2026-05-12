import { Metadata } from "next";
import ReachUs from "@/pages/ReachUs";

export const metadata: Metadata = {
  title: "Contact Lupus Venture | Get a Free Consultation",
  description: "Have a project in mind? Reach out to Lupus Venture — Chennai-based tech agency for web apps, mobile apps, and custom SaaS solutions.",
  alternates: {
    canonical: "https://www.lupusventure.com/reach-us",
  },
  openGraph: {
    title: "Contact Lupus Venture | Get a Free Consultation",
    description: "Have a project in mind? Reach out to Lupus Venture — Chennai-based tech agency for web apps, mobile apps, and custom SaaS solutions.",
    url: "https://www.lupusventure.com/reach-us",
  },
  twitter: {
    title: "Contact Lupus Venture | Get a Free Consultation",
    description: "Have a project in mind? Reach out to Lupus Venture — Chennai-based tech agency for web apps, mobile apps, and custom SaaS solutions.",
  },
};

export default function Page() {
  return <ReachUs />;
}
