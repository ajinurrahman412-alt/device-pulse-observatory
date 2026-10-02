import { createFileRoute } from "@tanstack/react-router";
import { HomeDashboard } from "@/components/jarvis/HomeDashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AJINUR2.0 — JARVIS 2.0 Command Center" },
      {
        name: "description",
        content: "AJINUR2.0 AI command center with a six-room Agent Town, JARVIS 2.0 core, operations and system status.",
      },
      { property: "og:title", content: "AJINUR2.0 — JARVIS 2.0 Command Center" },
      {
        property: "og:description",
        content: "AJINUR2.0 AI command center with a six-room Agent Town, JARVIS 2.0 core, operations and system status.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <HomeDashboard />;
}
