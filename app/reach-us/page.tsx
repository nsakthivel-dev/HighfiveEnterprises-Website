import { Metadata } from "next";
import ReachUs from "@/pages/ReachUs";

export const metadata: Metadata = {
  title: "Reach Us",
  description: "Get in touch with Lupus Venture. Whether you have a project idea, a question, or just want to say hello, we're here to help you navigate the digital landscape.",
};

export default function Page() {
  return <ReachUs />;
}
