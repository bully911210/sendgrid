import type { EmailTemplate } from "../data/templates";
import type { DepartmentConfig } from "../data/departments";

export function generateEmailHtml(
  template: EmailTemplate,
  config: DepartmentConfig,
  clientName: string,
  agentName: string
): string {
  const greeting = template.greeting
    .replace("{{clientName}}", clientName || "[Client]");
  const body = template.body
    .replace("{{agentName}}", agentName || "[Agent]")
    .replace("{{clientName}}", clientName || "[Client]");

  const font = "'Outfit','Helvetica Neue',Helvetica,Arial,sans-serif";

  const sectionsHtml = template.sections
    ? template.sections
        .map((s) => {
          const headingHtml = s.heading
            ? `<tr><td style="padding:20px 0 6px 0;">
                <h3 style="margin:0;font-size:15px;font-weight:700;color:${config.color};font-family:${font};">${s.heading}</h3>
              </td></tr>`
            : `<tr><td style="padding:12px 0 0 0;"></td></tr>`;

          // Check if content is line-separated items (bullet-style)
          const lines = s.content.split("\n").filter(Boolean);
          let contentHtml: string;

          if (lines.length > 1 && !s.content.includes(". ")) {
            // Render as clean list items
            contentHtml = lines
              .map(
                (line) =>
                  `<tr><td style="padding:3px 0 3px 16px;font-size:14px;line-height:1.6;color:#374151;font-family:${font};position:relative;">
                    <span style="color:${config.color};font-weight:700;margin-right:8px;">&#8226;</span>${line}
                  </td></tr>`
              )
              .join("");
          } else {
            contentHtml = `<tr><td style="padding:0 0 8px 0;font-size:14px;line-height:1.7;color:#374151;font-family:${font};">
              ${s.content.replace(/\n/g, "<br>")}
            </td></tr>`;
          }

          return headingHtml + contentHtml;
        })
        .join("")
    : "";

  const buttonsHtml = template.buttons
    .map(
      (btn) => `
    <a href="${btn.link}" target="_blank" style="display:inline-block;background-color:${config.color};color:#ffffff;padding:12px 28px;text-decoration:none;border-radius:6px;font-weight:700;font-size:14px;font-family:${font};margin:4px 0;">${btn.text}</a>`
    )
    .join("");

  const bankHtml = template.bankDetails
    ? `
    <tr><td style="padding:24px 0 0 0;">
      <table style="width:100%;border-collapse:collapse;background:#f8f9fa;border-radius:8px;border:1px solid #eef0f2;">
        <tr><td style="padding:16px 20px 10px 20px;">
          <h3 style="margin:0;font-size:14px;font-weight:700;color:#1f2937;font-family:${font};">${template.bankDetails.title}</h3>
        </td></tr>
        ${template.bankDetails.rows
          .map(
            (r) => `
        <tr><td style="padding:3px 20px;font-size:13px;font-family:${font};">
          <span style="color:#6b7280;font-weight:600;display:inline-block;min-width:130px;">${r.label}:</span>
          <span style="color:#1f2937;">${r.value}</span>
        </td></tr>`
          )
          .join("")}
        <tr><td style="padding:12px 20px 16px 20px;font-size:12px;color:#6b7280;font-style:italic;line-height:1.5;font-family:${font};">
          ${template.bankDetails.proofNote}
        </td></tr>
      </table>
    </td></tr>`
    : "";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:${font};">
  <table role="presentation" style="width:100%;border-collapse:collapse;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" style="width:100%;max-width:600px;border-collapse:collapse;">
        <!-- Color bar -->
        <tr><td style="background:${config.color};height:5px;border-radius:8px 8px 0 0;"></td></tr>
        <!-- Content -->
        <tr><td style="background:#ffffff;padding:36px 32px;border-radius:0 0 8px 8px;box-shadow:0 1px 4px rgba(0,0,0,0.06);">
          <table role="presentation" style="width:100%;border-collapse:collapse;">
            <!-- Greeting -->
            <tr><td style="padding:0 0 14px 0;">
              <h2 style="margin:0;font-size:18px;font-weight:600;color:#1f2937;font-family:${font};">${greeting}</h2>
            </td></tr>
            <!-- Body -->
            <tr><td style="padding:0 0 4px 0;font-size:14px;line-height:1.7;color:#374151;font-family:${font};">
              ${body.replace(/\n/g, "<br>")}
            </td></tr>
            <!-- Sections -->
            ${sectionsHtml}
            <!-- CTA -->
            <tr><td style="padding:22px 0;">
              ${buttonsHtml}
            </td></tr>
            <!-- Bank details -->
            ${bankHtml}
            <!-- Footer -->
            <tr><td style="padding:28px 0 0 0;border-top:1px solid #eef0f2;">
              <p style="margin:0;font-size:14px;color:#6b7280;line-height:1.6;font-family:${font};">
                ${template.footer.closing}<br>
                <strong style="color:${config.color};">${template.footer.department}</strong>
              </p>
            </td></tr>
          </table>
        </td></tr>
        <!-- Sub-footer -->
        <tr><td style="padding:14px 0;text-align:center;">
          <p style="margin:0;font-size:11px;color:#b0b5bf;font-family:${font};">
            Sent by ${config.fullName}
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
