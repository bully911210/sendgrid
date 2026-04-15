import { useState, useEffect, useCallback } from "react";
import { allAgents as defaultAgents } from "../data/departments";
import { templates as defaultTemplates } from "../data/templates";
import type { EmailTemplate } from "../data/templates";
import type { Department, Language } from "../data/departments";

export type TemplatesMap = Record<Department, Record<Language, EmailTemplate>>;

export function useSettings() {
  const [agents, setAgents] = useState<string[]>(defaultAgents);
  const [templates, setTemplates] = useState<TemplatesMap>(defaultTemplates);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) {
          if (Array.isArray(data.settings.agents) && data.settings.agents.length > 0) {
            setAgents(data.settings.agents);
          }
          if (data.settings.templates && typeof data.settings.templates === "object") {
            // Merge saved templates over defaults so any new depts/langs added
            // to the codebase still appear even if settings predate them.
            setTemplates({ ...defaultTemplates, ...data.settings.templates });
          }
        }
      })
      .catch(() => {
        // Network error or KV unavailable — keep defaults silently
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
        if (data.success) {
          setAgents(newAgents);
          setTemplates(newTemplates);
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },
    []
  );

  return { agents, templates, loading, save };
}
