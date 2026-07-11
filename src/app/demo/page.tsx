import type { Metadata } from "next";
import DemoDashboard from "./DemoClient";

export const metadata: Metadata = {
  title: "Live Interactive Demo | MyRevLink",
  description: "Try our interactive Google review link and QR generator sandbox. See how the AI review writer and Linktree-style profile work in real time.",
};

export default function DemoPage() {
  return <DemoDashboard />;
}
