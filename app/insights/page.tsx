import { Metadata } from "next";
import Insights from "@/pages/Insights";

export const metadata: Metadata = {
  title: "Insights",
  description: "Peek into the future of technology with Lupus Venture. Explore our research and development in AI, infrastructure, global connectivity, and security.",
};

export default function Page() {
  return <Insights />;
}
