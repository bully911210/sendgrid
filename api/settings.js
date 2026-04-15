import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    try {
      const settings = await kv.get("sigmail:settings");
      return res.status(200).json({ success: true, settings: settings ?? null });
    } catch {
      // KV not configured or unavailable — fall back to defaults on the client
      return res.status(200).json({ success: true, settings: null });
    }
  }

  if (req.method === "POST") {
    const { agents, templates } = req.body;

    if (!Array.isArray(agents) || typeof templates !== "object") {
      return res.status(400).json({ success: false, error: "Invalid settings payload" });
    }

    try {
      await kv.set("sigmail:settings", { agents, templates });
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error("Settings save error:", err);
      return res.status(500).json({ success: false, error: "Failed to save settings" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
