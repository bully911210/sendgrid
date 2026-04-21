import { useState, useEffect, useCallback } from "react";
import { allAgents as defaultAgents } from "../data/departments";
import { templates as defaultTemplates } from "../data/templates";
import type { EmailTemplate } from "../data/templates";
import type { Department, Language } from "../data/departments";

export type TemplatesMap = Record<Department, Record<Language, EmailTemplate>>;

function applySettings(
  data: { agents?: string[]; templates?: TemplatesMap } | null,
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
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) {
          applySettings(data.settings, setAgents, setTemplates);
        }
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const save = useCallback(
    async (newAgents: string[], newTemplates: TemplatesMap): Promise<boolean> => {
      try {
        const res = await fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ agents: newAgents, templates: newTemplates }),
        });
        const data = await res.json();
        if (!data.success) {
          console.warn("Settings save failed:", data.error);
          return false;
        }
        setAgents(newAgents);
        setTemplates(newTemplates);
        return true;
      } catch {
        console.warn("Could not reach /api/settings.");
        return false;
      }
    },
    []
  );

  return { agents, templates, loading, error, save };
}
