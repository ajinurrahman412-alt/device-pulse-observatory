import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) }))
    .min(1)
    .max(30),
});

const SYSTEM = `You are JARVIS, a calm, concise personal AI desktop assistant. You coordinate four agents:
ALICE (research lab: web research, summaries), BOB (computer lab: files, apps, browser),
CAROL (calendar & schedule), DAVE (automation: email, sheets, workflows).
Reply in 1-3 short sentences, say which agent you're delegating to and why.
Never claim you already performed real actions on the user's PC or accounts — those integrations are not connected yet.`;

export const askJarvis = createServerFn({ method: "POST" })
  .inputValidator((d) => Input.parse(d))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) return { text: "My AI link is offline right now.", error: true };
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: SYSTEM }, ...data.messages],
      }),
    });
    if (res.status === 429) return { text: "I'm getting too many requests — try again in a moment.", error: true };
    if (res.status === 402) return { text: "AI credits are used up. Add credits in your workspace to continue.", error: true };
    if (!res.ok) return { text: "I couldn't reach my AI core. Please try again.", error: true };
    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    return { text: json.choices?.[0]?.message?.content?.trim() || "…", error: false };
  });
