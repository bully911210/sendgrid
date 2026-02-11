import type { EmailTemplate } from "../data/templates";
import type { DepartmentConfig } from "../data/departments";
import { Paperclip, FileText } from "lucide-react";

interface Props {
  template: EmailTemplate;
  config: DepartmentConfig;
  clientName: string;
  agentName: string;
}

export function EmailPreview({ template, config, clientName, agentName }: Props) {
  const name = clientName || "[client name]";
  const agent = agentName || "[agent name]";
  const greeting = template.greeting.replace("{{clientName}}", name);
  const body = template.body
    .replace("{{agentName}}", agent)
    .replace("{{clientName}}", name);

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        overflow: "hidden",
        background: "#fff",
      }}
    >
      {/* Color accent bar */}
      <div style={{ height: 3, background: config.color, transition: "background 0.2s" }} />

      {/* Email content */}
      <div style={{ padding: "24px 24px 20px" }}>
        {/* Greeting */}
        <p style={{ fontSize: 15, fontWeight: 500, color: "#1a1a2e", marginBottom: 14 }}>
          {greeting}
        </p>

        {/* Body */}
        <p style={{ fontSize: 14, lineHeight: 1.7, color: "#4b5563", whiteSpace: "pre-line", marginBottom: 16 }}>
          {body}
        </p>

        {/* Sections */}
        {template.sections?.map((section, i) => {
          const lines = section.content.split("\n").filter(Boolean);
          const isList = lines.length > 1 && !section.content.includes(". ");

          return (
            <div key={i} style={{ marginBottom: 14 }}>
              {section.heading && (
                <h4 style={{ fontSize: 14, fontWeight: 700, color: config.color, marginBottom: 6, transition: "color 0.2s" }}>
                  {section.heading}
                </h4>
              )}
              {isList ? (
                <ul style={{ margin: 0, paddingLeft: 18, listStyle: "none" }}>
                  {lines.map((line, j) => (
                    <li
                      key={j}
                      style={{
                        fontSize: 14,
                        lineHeight: 1.65,
                        color: "#4b5563",
                        padding: "2px 0",
                        position: "relative",
                        paddingLeft: 14,
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          left: 0,
                          color: config.color,
                          fontWeight: 700,
                        }}
                      >
                        &#8226;
                      </span>
                      {line}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "#4b5563", whiteSpace: "pre-line" }}>
                  {section.content}
                </p>
              )}
            </div>
          );
        })}

        {/* CTA Button */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "18px 0" }}>
          {template.buttons.map((btn, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                padding: "10px 22px",
                background: config.color,
                color: "#fff",
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 6,
                transition: "background 0.2s",
              }}
            >
              {btn.text}
            </span>
          ))}
        </div>

        {/* Bank Details */}
        {template.bankDetails && (
          <div style={{
            marginTop: 14,
            padding: "16px 18px",
            borderRadius: 8,
            background: "#f8f9fa",
            border: "1px solid #eef0f2",
          }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e", marginBottom: 10 }}>
              {template.bankDetails.title}
            </h4>
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <tbody>
                {template.bankDetails.rows.map((row, i) => (
                  <tr key={i}>
                    <td style={{ fontSize: 13, color: "#6b7280", fontWeight: 600, padding: "3px 16px 3px 0", whiteSpace: "nowrap", verticalAlign: "top" }}>
                      {row.label}:
                    </td>
                    <td style={{ fontSize: 13, color: "#374151", padding: "3px 0" }}>
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {template.bankDetails.proofNote && (
              <p style={{ fontSize: 12, color: "#9ca3af", fontStyle: "italic", marginTop: 10, lineHeight: 1.5 }}>
                {template.bankDetails.proofNote}
              </p>
            )}
          </div>
        )}

        {/* Attachment */}
        {config.hasAttachment && (
          <div style={{
            marginTop: 14,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 14px",
            borderRadius: 8,
            background: "#fef2f2",
            border: "1px solid #fecaca",
          }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 6,
              background: `${config.color}12`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              <FileText style={{ width: 16, height: 16, color: config.color }} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                Firearms_Guardian_Application_Form.pdf
              </div>
              <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>
                Fillable PDF attached
              </div>
            </div>
            <Paperclip style={{ width: 14, height: 14, color: "#d1d5db", marginLeft: "auto", flexShrink: 0 }} />
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid #f0f1f3" }}>
          <p style={{ fontSize: 14, color: "#6b7280" }}>{template.footer.closing}</p>
          <p style={{ fontSize: 14, fontWeight: 700, color: config.color, marginTop: 2, transition: "color 0.2s" }}>
            {template.footer.department}
          </p>
        </div>
      </div>
    </div>
  );
}
