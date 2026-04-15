import { useState, useEffect, useCallback } from "react";
import { allAgents as defaultAgents } from "../data/departments";
import { templates as defaultTemplates } from "../data/templates";
import type { EmailTemplate } from "../data/templates";
import type { Department, Language } from "../data/departments";

export type TemplatesMap = Record<Department, Record<Language, EmailTemplate>>;

const LS_KEY = "sigmail:settings";

function readLocalStorage(): { agents: string[]; templates: TemplatesMap } | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeLocalStorage(agents: string[], templates: TemplatesMap) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({ agents, templates }));
  } catch {
    // Storage quota exceeded or unavailable — ignore
  }
}

function applySettings(
  data: { agents: string[]; templates: TemplatesMap } | null,
  setAgents: (a: string[]) => void,
  setTemplates: (t: TemplatesMap) => void,
) {
  if (!data) return;
  if (Array.isArray(data.agents) && data.agents.length > 0) {
    setAgents(data.agents);
  }
  if (data.templates && typeof data.templates === "object") {
    setTemplates({ ...defaultTemplates, ...data.templates });
  }
}

export function useSettings() {
  const [agents, setAgents] = useState<string[]>(defaultAgents);
  const [templates, setTemplates] = useState<TemplatesMap>(defaultTemplates);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Immediately apply any locally-cached settings so the UI isn't blank
    // while the network request is in flight.
    const local = readLocalStorage();
    if (local) applySettings(local, setAgents, setTemplates);

    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) {
          applySettings(data.settings, setAgents, setTemplates);
          // Keep localStorage in sync with the authoritative KV value.
          writeLocalStorage(data.settings.agents ?? agents, data.settings.templates ?? templates);
        }
      })
      .catch(() => {
        // Network error or API unavailable — localStorage values already applied above.
      })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = useCallback(
    async (newAgents: string[], newTemplates: TemplatesMap): Promise<boolean> => {
      // Always persist to localStorage first — this works regardless of KV.
      writeLocalStorage(newAgents, newTemplates);
      setAgents(newAgents);
      setTemplates(newTemplates);

      // Best-effort sync to KV (shared across browsers when configured).
      try {
        const res = await fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ agents: newAgents, templates: newTemplates }),
        });
        const data = await res.json();
        if (!data.success) {
          // KV unavailable but localStorage already saved — still a success for the user.
          console.warn("Settings saved locally; Vercel KV sync failed:", data.error);
        }
      } catch {
        // Network error — localStorage already saved above.
        console.warn("Settings saved locally; could not reach /api/settings.");
      }

      return true; // localStorage save always succeeds
    },
    []
  );

  return { agents, templates, loading, save };
}
