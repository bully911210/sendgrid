import { useState } from "react";
import type { Department, Language } from "../data/departments";
import { departments } from "../data/departments";
import type { EmailTemplate } from "../data/templates";
import { EmailPreview } from "./EmailPreview";
import type { TemplatesMap } from "../hooks/useSettings";
import {
  ChevronLeft,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const deptKeys = Object.keys(departments) as Department[];

interface Props {
  initialAgents: string[];
  initialTemplates: TemplatesMap;
  onSave: (agents: string[], templates: TemplatesMap) => Promise<boolean>;
  onBack: () => void;
}

export function SettingsPage({ initialAgents, initialTemplates, onSave, onBack }: Props) {
  const [activeTab, setActiveTab] = useState<"agents" | "templates">("agents");

  // Draft state — held locally until Save is clicked
  const [draftAgents, setDraftAgents] = useState<string[]>([...initialAgents]);
  const [draftTemplates, setDraftTemplates] = useState<TemplatesMap>(
    () => JSON.parse(JSON.stringify(initialTemplates))
  );

  const [activeDept, setActiveDept] = useState<Department>("Free SA");
  const [activeLang, setActiveLang] = useState<Language>("en");
  const [newAgent, setNewAgent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "success" | "error">("idle");

  const currentTemplate = draftTemplates[activeDept][activeLang];
  const config = departments[activeDept];

  // ── Template field updaters ──────────────────────────────────────────────

  function setField<K extends keyof EmailTemplate>(field: K, value: EmailTemplate[K]) {
    setDraftTemplates((prev) => ({
      ...prev,
      [activeDept]: {
        ...prev[activeDept],
        [activeLang]: { ...prev[activeDept][activeLang], [field]: value },
      },
    }));
  }

  function updateSection(i: number, key: "heading" | "content", val: string) {
    const sections = [...(currentTemplate.sections ?? [])];
    sections[i] = { ...sections[i], [key]: val };
    setField("sections", sections);
  }
  function addSection() {
    setField("sections", [...(currentTemplate.sections ?? []), { heading: "", content: "" }]);
  }
  function removeSection(i: number) {
    setField(
      "sections",
      (currentTemplate.sections ?? []).filter((_, idx) => idx !== i)
    );
  }

  function updateButton(i: number, key: "text" | "link", val: string) {
    const buttons = [...currentTemplate.buttons];
    buttons[i] = { ...buttons[i], [key]: val };
    setField("buttons", buttons);
  }
  function addButton() {
    setField("buttons", [...currentTemplate.buttons, { text: "", link: "" }]);
  }
  function removeButton(i: number) {
    setField(
      "buttons",
      currentTemplate.buttons.filter((_, idx) => idx !== i)
    );
  }

  function toggleBankDetails() {
    if (currentTemplate.bankDetails) {
      setField("bankDetails", undefined);
    } else {
      setField("bankDetails", {
        title: "Bank Details",
        rows: [
          { label: "Bank", value: "" },
          { label: "Account Name", value: "" },
          { label: "Account Number", value: "" },
          { label: "Branch Code", value: "" },
        ],
        proofNote: "",
      });
    }
  }
  function updateBankField(key: "title" | "proofNote", val: string) {
    if (!currentTemplate.bankDetails) return;
    setField("bankDetails", { ...currentTemplate.bankDetails, [key]: val });
  }
  function updateBankRow(i: number, key: "label" | "value", val: string) {
    if (!currentTemplate.bankDetails) return;
    const rows = [...currentTemplate.bankDetails.rows];
    rows[i] = { ...rows[i], [key]: val };
    setField("bankDetails", { ...currentTemplate.bankDetails, rows });
  }
  function addBankRow() {
    if (!currentTemplate.bankDetails) return;
    setField("bankDetails", {
      ...currentTemplate.bankDetails,
      rows: [...currentTemplate.bankDetails.rows, { label: "", value: "" }],
    });
  }
  function removeBankRow(i: number) {
    if (!currentTemplate.bankDetails) return;
    setField("bankDetails", {
      ...currentTemplate.bankDetails,
      rows: currentTemplate.bankDetails.rows.filter((_, idx) => idx !== i),
    });
  }

  // ── Agent updaters ───────────────────────────────────────────────────────

  function addAgent() {
    const trimmed = newAgent.trim();
    if (!trimmed || draftAgents.includes(trimmed)) return;
    setDraftAgents((prev) => [...prev, trimmed].sort());
    setNewAgent("");
  }
  function removeAgent(name: string) {
    setDraftAgents((prev) => prev.filter((a) => a !== name));
  }

  // ── Save ─────────────────────────────────────────────────────────────────

  async function handleSave() {
    setIsSaving(true);
    setSaveState("idle");
    const ok = await onSave(draftAgents, draftTemplates);
    setIsSaving(false);
    setSaveState(ok ? "success" : "error");
    if (ok) setTimeout(() => setSaveState("idle"), 3000);
  }

  // ── Shared styles ────────────────────────────────────────────────────────

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "9px 12px",
    border: "1.5px solid #e2e5ea",
    borderRadius: 7,
    fontSize: 13,
    fontFamily: "inherit",
    color: "#1a1a2e",
    background: "#fff",
    outline: "none",
    boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 11,
    fontWeight: 700,
    color: "#9ca3af",
    marginBottom: 5,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };
  const dividerHeadingStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 700,
    color: "#374151",
    marginBottom: 12,
    paddingBottom: 10,
    borderBottom: "1px solid #f0f1f3",
  };
  const dashedAddBtn: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    width: "100%",
    padding: "8px",
    background: "none",
    border: "1.5px dashed #d1d5db",
    borderRadius: 7,
    fontSize: 12,
    color: "#9ca3af",
    cursor: "pointer",
    fontFamily: "inherit",
    marginTop: 6,
  };
  const iconBtn: React.CSSProperties = {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 4,
    color: "#d1d5db",
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f6f8",
        fontFamily: "'Outfit', system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <header style={{ background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 28px",
            height: 72,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <button
            onClick={onBack}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              color: "#6b7280",
              fontFamily: "inherit",
              fontWeight: 500,
              padding: "6px 0",
            }}
          >
            <ChevronLeft style={{ width: 15, height: 15 }} />
            Back to Compose
          </button>
          <span style={{ color: "#e5e7eb" }}>|</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e" }}>Settings</span>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 28px 120px" }}>
        {/* Tab switcher */}
        <div
          style={{
            display: "flex",
            gap: 4,
            marginBottom: 24,
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            padding: 4,
            width: "fit-content",
          }}
        >
          {(["agents", "templates"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "7px 20px",
                borderRadius: 7,
                border: "none",
                background: activeTab === tab ? "#1a1a2e" : "transparent",
                color: activeTab === tab ? "#fff" : "#6b7280",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "inherit",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {tab === "agents" ? `Agents (${draftAgents.length})` : "Email Templates"}
            </button>
          ))}
        </div>

        {/* ── AGENTS TAB ─────────────────────────────────────────────────── */}
        {activeTab === "agents" && (
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              padding: 28,
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e" }}>
                Manage Agents
              </h2>
              <span style={{ fontSize: 13, color: "#9ca3af" }}>{draftAgents.length} agents</span>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 6,
              marginBottom: 20,
            }}>
              {draftAgents.map((agent) => (
                <div
                  key={agent}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "9px 14px",
                    borderRadius: 8,
                    background: "#f9fafb",
                    border: "1px solid #f0f1f3",
                  }}
                >
                  <span style={{ fontSize: 13, color: "#374151" }}>{agent}</span>
                  <button
                    onClick={() => removeAgent(agent)}
                    style={iconBtn}
                    title="Remove agent"
                  >
                    <Trash2 style={{ width: 13, height: 13 }} />
                  </button>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                gap: 8,
                paddingTop: 16,
                borderTop: "1px solid #f0f1f3",
                maxWidth: 480,
              }}
            >
              <input
                value={newAgent}
                onChange={(e) => setNewAgent(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addAgent()}
                placeholder="Agent full name"
                style={{ ...inputStyle, flex: 1 }}
              />
              <button
                onClick={addAgent}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "9px 16px",
                  borderRadius: 7,
                  border: "none",
                  background: "#1a1a2e",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "inherit",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                <Plus style={{ width: 13, height: 13 }} />
                Add
              </button>
            </div>
          </div>
        )}

        {/* ── TEMPLATES TAB ──────────────────────────────────────────────── */}
        {activeTab === "templates" && (
          <div>
            {/* Dept tabs */}
            <div
              style={{
                display: "flex",
                background: "#fff",
                borderRadius: 10,
                border: "1px solid #e5e7eb",
                overflow: "hidden",
                marginBottom: 24,
              }}
            >
              {deptKeys.map((dept) => {
                const dc = departments[dept];
                const active = dept === activeDept;
                return (
                  <button
                    key={dept}
                    onClick={() => setActiveDept(dept)}
                    style={{
                      flex: 1,
                      padding: "12px 8px",
                      background: "none",
                      border: "none",
                      borderBottom: `3px solid ${active ? dc.color : "transparent"}`,
                      fontSize: 13,
                      fontWeight: active ? 700 : 500,
                      color: active ? "#1a1a2e" : "#9ca3af",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all 0.15s",
                    }}
                  >
                    {dept}
                  </button>
                );
              })}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 24,
                alignItems: "start",
              }}
            >
              {/* Left — editor form */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  padding: 28,
                }}
              >
                {/* Language toggle */}
                <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
                  {(["en", "af"] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setActiveLang(lang)}
                      style={{
                        padding: "6px 18px",
                        borderRadius: 6,
                        border: `1.5px solid ${activeLang === lang ? config.color : "#e2e5ea"}`,
                        background: activeLang === lang ? `${config.color}12` : "#fff",
                        color: activeLang === lang ? config.color : "#9ca3af",
                        fontSize: 13,
                        fontWeight: 600,
                        fontFamily: "inherit",
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      {lang === "en" ? "English" : "Afrikaans"}
                    </button>
                  ))}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {/* Subject */}
                  <div>
                    <label style={labelStyle}>Subject line</label>
                    <input
                      value={currentTemplate.subject}
                      onChange={(e) => setField("subject", e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  {/* Greeting */}
                  <div>
                    <label style={labelStyle}>
                      Greeting{" "}
                      <span style={{ color: "#b0b5bf", fontWeight: 400, textTransform: "none" }}>
                        — use {"{{clientName}}"}
                      </span>
                    </label>
                    <input
                      value={currentTemplate.greeting}
                      onChange={(e) => setField("greeting", e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  {/* Body */}
                  <div>
                    <label style={labelStyle}>
                      Body{" "}
                      <span style={{ color: "#b0b5bf", fontWeight: 400, textTransform: "none" }}>
                        — use {"{{agentName}}"} / {"{{clientName}}"}
                      </span>
                    </label>
                    <textarea
                      value={currentTemplate.body}
                      onChange={(e) => setField("body", e.target.value)}
                      rows={6}
                      style={{ ...inputStyle, resize: "vertical", lineHeight: 1.65 }}
                    />
                  </div>

                  {/* Sections */}
                  <div>
                    <p style={dividerHeadingStyle}>Sections</p>
                    {(currentTemplate.sections ?? []).map((section, i) => (
                      <div
                        key={i}
                        style={{
                          marginBottom: 10,
                          padding: 14,
                          borderRadius: 8,
                          background: "#f9fafb",
                          border: "1px solid #f0f1f3",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 10,
                          }}
                        >
                          <span style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af" }}>
                            Section {i + 1}
                          </span>
                          <button
                            onClick={() => removeSection(i)}
                            style={iconBtn}
                            title="Remove section"
                          >
                            <Trash2 style={{ width: 13, height: 13 }} />
                          </button>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          <input
                            value={section.heading}
                            onChange={(e) => updateSection(i, "heading", e.target.value)}
                            placeholder="Heading (optional)"
                            style={{ ...inputStyle, fontSize: 13 }}
                          />
                          <textarea
                            value={section.content}
                            onChange={(e) => updateSection(i, "content", e.target.value)}
                            placeholder="One item per line = bullet list. Lines ending with punctuation = paragraph."
                            rows={5}
                            style={{ ...inputStyle, resize: "vertical", fontSize: 13, lineHeight: 1.65 }}
                          />
                        </div>
                      </div>
                    ))}
                    <button onClick={addSection} style={dashedAddBtn}>
                      <Plus style={{ width: 13, height: 13 }} />
                      Add Section
                    </button>
                  </div>

                  {/* Buttons */}
                  <div>
                    <p style={dividerHeadingStyle}>Call-to-action Buttons</p>
                    {currentTemplate.buttons.map((btn, i) => (
                      <div
                        key={i}
                        style={{ display: "flex", gap: 6, marginBottom: 8, alignItems: "center" }}
                      >
                        <input
                          value={btn.text}
                          onChange={(e) => updateButton(i, "text", e.target.value)}
                          placeholder="Button label"
                          style={{ ...inputStyle, flex: "0 0 140px" }}
                        />
                        <input
                          value={btn.link}
                          onChange={(e) => updateButton(i, "link", e.target.value)}
                          placeholder="https://..."
                          style={{ ...inputStyle, flex: 1 }}
                        />
                        <button
                          onClick={() => removeButton(i)}
                          style={iconBtn}
                          title="Remove button"
                        >
                          <Trash2 style={{ width: 13, height: 13 }} />
                        </button>
                      </div>
                    ))}
                    <button onClick={addButton} style={dashedAddBtn}>
                      <Plus style={{ width: 13, height: 13 }} />
                      Add Button
                    </button>
                  </div>

                  {/* Bank details */}
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: currentTemplate.bankDetails ? 14 : 0,
                        paddingBottom: 10,
                        borderBottom: "1px solid #f0f1f3",
                      }}
                    >
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>
                        Bank Details
                      </span>
                      <button
                        onClick={toggleBankDetails}
                        style={{
                          padding: "4px 12px",
                          borderRadius: 20,
                          border: `1.5px solid ${currentTemplate.bankDetails ? "#dc2626" : "#22c55e"}`,
                          background: currentTemplate.bankDetails ? "#fef2f2" : "#f0fdf4",
                          color: currentTemplate.bankDetails ? "#dc2626" : "#16a34a",
                          fontSize: 12,
                          fontWeight: 600,
                          fontFamily: "inherit",
                          cursor: "pointer",
                        }}
                      >
                        {currentTemplate.bankDetails ? "Remove" : "Add"}
                      </button>
                    </div>

                    {currentTemplate.bankDetails && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <div>
                          <label style={labelStyle}>Section title</label>
                          <input
                            value={currentTemplate.bankDetails.title}
                            onChange={(e) => updateBankField("title", e.target.value)}
                            style={inputStyle}
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>Rows</label>
                          {currentTemplate.bankDetails.rows.map((row, i) => (
                            <div
                              key={i}
                              style={{
                                display: "flex",
                                gap: 6,
                                marginBottom: 6,
                                alignItems: "center",
                              }}
                            >
                              <input
                                value={row.label}
                                onChange={(e) => updateBankRow(i, "label", e.target.value)}
                                placeholder="Label"
                                style={{ ...inputStyle, flex: "0 0 110px" }}
                              />
                              <input
                                value={row.value}
                                onChange={(e) => updateBankRow(i, "value", e.target.value)}
                                placeholder="Value"
                                style={{ ...inputStyle, flex: 1 }}
                              />
                              <button
                                onClick={() => removeBankRow(i)}
                                style={iconBtn}
                                title="Remove row"
                              >
                                <Trash2 style={{ width: 12, height: 12 }} />
                              </button>
                            </div>
                          ))}
                          <button onClick={addBankRow} style={{ ...dashedAddBtn, marginTop: 2 }}>
                            <Plus style={{ width: 12, height: 12 }} />
                            Add Row
                          </button>
                        </div>
                        <div>
                          <label style={labelStyle}>Proof of payment note</label>
                          <textarea
                            value={currentTemplate.bankDetails.proofNote}
                            onChange={(e) => updateBankField("proofNote", e.target.value)}
                            rows={2}
                            style={{ ...inputStyle, resize: "vertical", lineHeight: 1.65 }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div>
                    <p style={dividerHeadingStyle}>Footer</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <div>
                        <label style={labelStyle}>Closing line</label>
                        <input
                          value={currentTemplate.footer.closing}
                          onChange={(e) =>
                            setField("footer", { ...currentTemplate.footer, closing: e.target.value })
                          }
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Sender name</label>
                        <input
                          value={currentTemplate.footer.department}
                          onChange={(e) =>
                            setField("footer", {
                              ...currentTemplate.footer,
                              department: e.target.value,
                            })
                          }
                          style={inputStyle}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right — live preview */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  padding: 28,
                  position: "sticky",
                  top: 24,
                }}
              >
                <h2
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#1a1a2e",
                    marginBottom: 6,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <span
                    style={{
                      width: 4,
                      height: 18,
                      borderRadius: 2,
                      background: config.color,
                      display: "inline-block",
                      transition: "background 0.2s",
                    }}
                  />
                  Live Preview
                </h2>
                <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 18 }}>
                  Updates as you type
                </p>
                <EmailPreview
                  template={currentTemplate}
                  config={config}
                  clientName="Jan van der Berg"
                  agentName="Cindy Cloete"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Sticky save bar ─────────────────────────────────────────────── */}
        <div
          style={{
            position: "sticky",
            bottom: 20,
            marginTop: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 10,
            padding: "14px 20px",
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          }}
        >
          {saveState === "error" && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                color: "#dc2626",
                marginRight: 8,
              }}
            >
              <AlertCircle style={{ width: 14, height: 14 }} />
              Save failed — check your Vercel KV connection
            </span>
          )}
          <button
            onClick={onBack}
            style={{
              padding: "9px 20px",
              borderRadius: 8,
              border: "1.5px solid #e2e5ea",
              background: "#fff",
              color: "#6b7280",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 22px",
              borderRadius: 8,
              border: "none",
              background:
                saveState === "success"
                  ? "#22c55e"
                  : saveState === "error"
                  ? "#dc2626"
                  : "#1a1a2e",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "inherit",
              cursor: isSaving ? "wait" : "pointer",
              transition: "background 0.25s",
            }}
          >
            {saveState === "success" ? (
              <>
                <CheckCircle style={{ width: 14, height: 14 }} />
                Saved!
              </>
            ) : (
              <>
                <Save style={{ width: 14, height: 14 }} />
                {isSaving ? "Saving…" : "Save Changes"}
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
