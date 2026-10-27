import type { Metadata } from "next";
import DemoDashboard from "./DemoClient";

export const metadata: Metadata = {
  title: "Live Interactive Demo | MyRevLink",
  description: "Explore the MyRevLink profile sandbox. Try customization, links and content in an interactive preview before creating your own page.",
};

export default function DemoPage() {
  return <DemoDashboard />;
}
