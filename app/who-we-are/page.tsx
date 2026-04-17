import { Metadata } from "next";
import WhoWeAre from "@/pages/WhoWeAre";

export const metadata: Metadata = {
  title: "Who We Are",
  description: "Learn about Lupus Venture, our values, our team, and our mission to architect digital excellence through innovative tech solutions.",
};

export default function Page() {
  return <WhoWeAre />;
}
