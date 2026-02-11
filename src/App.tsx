import { useState, useCallback } from "react";
import type { Department, Language } from "./data/departments";
import { departments } from "./data/departments";
import { getTemplate } from "./data/templates";
import { EmailPreview } from "./components/EmailPreview";
import { generateEmailHtml } from "./utils/emailHtml";
import { generateFirearmsGuardianPdf } from "./utils/pdfGenerator";
import {
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  Paperclip,
} from "lucide-react";

const deptKeys = Object.keys(departments) as Department[];

type ToastState = null | { type: "success" | "error"; message: string };

export default function App() {
  const [activeDept, setActiveDept] = useState<Department>("Free SA");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("");
  const [language, setLanguage] = useState<Language>("en");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const config = departments[activeDept];
  const template = getTemplate(activeDept, language);

  const switchDepartment = useCallback((dept: Department) => {
    setActiveDept(dept);
    setSelectedAgent("");
  }, []);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  const handleSend = async () => {
    if (!clientName.trim() || !clientEmail.trim() || !selectedAgent) {
      showToast("error", "Please fill in all required fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
      showToast("error", "Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const html = generateEmailHtml(template, config, clientName, selectedAgent);

      let attachmentBase64: string | undefined;
      if (config.hasAttachment) {
        const pdfBytes = await generateFirearmsGuardianPdf();
        attachmentBase64 = btoa(String.fromCharCode(...pdfBytes));
      }

      const res = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientEmail,
          subject: template.subject,
          html,
          department: activeDept,
          language,
          attachment: attachmentBase64
            ? {
                content: attachmentBase64,
                filename: "Firearms_Guardian_Application_Form.pdf",
                type: "application/pdf",
              }
            : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast("success", `Email sent to ${clientEmail}`);
        setClientName("");
        setClientEmail("");
        setSelectedAgent("");
      } else {
        showToast("error", data.error || "Failed to send email.");
      }
    } catch {
      showToast("error", "Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isReady = clientName.trim() && clientEmail.trim() && selectedAgent;

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px 14px",
    border: "1.5px solid #e2e5ea",
    borderRadius: 8,
    fontSize: 14,
    fontFamily: "inherit",
    color: "#1a1a2e",
    background: "#fff",
    transition: "border-color 0.2s, box-shadow 0.2s",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
    marginBottom: 7,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f6f8", fontFamily: "'Outfit', system-ui, sans-serif" }}>

      {/* ====== HEADER ====== */}
      <header style={{ background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>

          {/* Logo row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 80 }}>
            <img src="/logo.png" alt="SIG Solutions" style={{ height: 68 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>
                Sending from <span style={{ color: "#6b7280", fontWeight: 600 }}>{config.senderEmail}</span>
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 0, borderTop: "1px solid #f0f1f3" }}>
            {deptKeys.map((dept) => {
              const dc = departments[dept];
              const active = dept === activeDept;
              return (
                <button
                  key={dept}
                  onClick={() => switchDepartment(dept)}
                  style={{
                    flex: 1,
                    padding: "14px 8px",
                    background: "none",
                    border: "none",
                    borderBottom: `3px solid ${active ? dc.color : "transparent"}`,
                    fontSize: 14,
                    fontWeight: active ? 700 : 500,
                    color: active ? "#1a1a2e" : "#9ca3af",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.2s ease",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.color = "#6b7280";
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.color = "#9ca3af";
                  }}
                >
                  {dept}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ====== MAIN CONTENT ====== */}
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 28px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>

          {/* ── LEFT: FORM ── */}
          <div style={{
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            padding: "28px 28px 24px",
          }}>

            {/* Client Details heading */}
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#1a1a2e", marginBottom: 22, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 4, height: 20, borderRadius: 2, background: config.color, display: "inline-block", transition: "background 0.2s" }} />
              Client Details
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Client Name */}
              <div>
                <label style={labelStyle}>Client Name</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Enter client name"
                  style={inputStyle}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = config.color;
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${config.color}15`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e2e5ea";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Client Email */}
              <div>
                <label style={labelStyle}>Client Email</label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="Enter client email"
                  style={inputStyle}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = config.color;
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${config.color}15`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e2e5ea";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Agent Selection */}
              <div>
                <label style={labelStyle}>Agent Selection</label>
                <select
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                  style={{
                    ...inputStyle,
                    color: selectedAgent ? "#1a1a2e" : "#9ca3af",
                    cursor: "pointer",
                    appearance: "none",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='none' viewBox='0 0 24 24' stroke='%239ca3af' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 14px center",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = config.color;
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${config.color}15`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e2e5ea";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <option value="">Select an agent</option>
                  {config.agents.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              {/* Language */}
              <div>
                <label style={labelStyle}>Language</label>
                <div style={{ display: "flex", gap: 16 }}>
                  {(["en", "af"] as Language[]).map((lang) => {
                    const active = language === lang;
                    return (
                      <label
                        key={lang}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          cursor: "pointer",
                          fontSize: 14,
                          fontWeight: active ? 600 : 400,
                          color: active ? "#1a1a2e" : "#6b7280",
                        }}
                      >
                        <span
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            border: `2px solid ${active ? config.color : "#d1d5db"}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s",
                          }}
                        >
                          {active && (
                            <span
                              style={{
                                width: 9,
                                height: 9,
                                borderRadius: "50%",
                                background: config.color,
                                transition: "background 0.2s",
                              }}
                            />
                          )}
                        </span>
                        <input
                          type="radio"
                          name="language"
                          value={lang}
                          checked={active}
                          onChange={() => setLanguage(lang)}
                          style={{ display: "none" }}
                        />
                        {lang === "en" ? "English" : "Afrikaans"}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Attachment notice */}
              {config.hasAttachment && (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: `${config.color}08`,
                  border: `1px solid ${config.color}18`,
                  marginTop: 2,
                }}>
                  <Paperclip style={{ width: 14, height: 14, color: config.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: config.color, fontWeight: 500 }}>
                    PDF application form will be attached
                  </span>
                </div>
              )}

              {/* Send Button */}
              <button
                onClick={handleSend}
                disabled={isSubmitting || !isReady}
                style={{
                  width: "100%",
                  padding: "13px 0",
                  borderRadius: 8,
                  border: "none",
                  background: isReady ? config.color : "#d1d5db",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 700,
                  fontFamily: "inherit",
                  cursor: isReady && !isSubmitting ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  marginTop: 6,
                  transition: "all 0.25s ease",
                  boxShadow: isReady ? `0 2px 12px ${config.color}30` : "none",
                }}
                onMouseEnter={(e) => {
                  if (isReady && !isSubmitting) {
                    e.currentTarget.style.boxShadow = `0 4px 20px ${config.color}40`;
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = isReady ? `0 2px 12px ${config.color}30` : "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send style={{ width: 15, height: 15 }} />
                    Send Email
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ── RIGHT: EMAIL PREVIEW ── */}
          <div>
            <div style={{
              background: "#fff",
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              padding: "28px 28px 24px",
            }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#1a1a2e", marginBottom: 6, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 4, height: 20, borderRadius: 2, background: config.color, display: "inline-block", transition: "background 0.2s" }} />
                Email Preview
              </h2>
              <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>
                This is how your email will appear to the recipient
              </p>

              <EmailPreview
                template={template}
                config={config}
                clientName={clientName}
                agentName={selectedAgent}
              />
            </div>
          </div>
        </div>
      </main>

      {/* ====== FOOTER ====== */}
      <footer style={{ textAlign: "center", padding: "16px 0 24px" }}>
        <p style={{ fontSize: 12, color: "#b0b5bf" }}>Developed by Franz Badenhorst</p>
      </footer>

      {/* ====== TOAST ====== */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "12px 20px",
            borderRadius: 12,
            boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
            border: `1px solid ${toast.type === "success" ? "#bbf7d0" : "#fecaca"}`,
            background: toast.type === "success" ? "#f0fdf4" : "#fef2f2",
            display: "flex",
            alignItems: "center",
            gap: 10,
            zIndex: 50,
            animation: "toastIn 0.3s ease-out",
          }}
        >
          {toast.type === "success" ? (
            <CheckCircle style={{ width: 16, height: 16, color: "#16a34a", flexShrink: 0 }} />
          ) : (
            <AlertCircle style={{ width: 16, height: 16, color: "#dc2626", flexShrink: 0 }} />
          )}
          <span style={{
            fontSize: 13,
            fontWeight: 600,
            color: toast.type === "success" ? "#166534" : "#991b1b",
          }}>
            {toast.message}
          </span>
          <button
            onClick={() => setToast(null)}
            style={{ marginLeft: 8, background: "none", border: "none", color: "#9ca3af", cursor: "pointer", fontSize: 18, lineHeight: 1, fontFamily: "inherit" }}
          >
            &times;
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes toastIn { from { opacity: 0; transform: translate(-50%, 12px); } to { opacity: 1; transform: translate(-50%, 0); } }
      `}</style>
    </div>
  );
}
