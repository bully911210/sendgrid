export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "Server configuration error",
      message: "Email service is not properly configured.",
    });
  }

  const { clientEmail, subject, html, department, language, attachment } = req.body;

  if (!clientEmail || !subject || !html || !department) {
    return res.status(400).json({
      error: "Missing required fields",
      missingFields: [
        !clientEmail && "clientEmail",
        !subject && "subject",
        !html && "html",
        !department && "department",
      ].filter(Boolean),
    });
  }

  // Map department to verified sender
  const senderMap = {
    "Free SA": "memberships@freesa.org.za",
    "TLU SA": "info@tlu.co.za",
    "Firearms Guardian": "benefits@firearmsguardian.co.za",
    "Civil Society SA": "contributors@civilsocietysa.co.za",
  };

  const fromEmail = senderMap[department];
  if (!fromEmail) {
    return res.status(400).json({ error: "Invalid department" });
  }

  // Build SendGrid payload
  const payload = {
    personalizations: [{ to: [{ email: clientEmail }] }],
    from: { email: fromEmail, name: department },
    subject,
    content: [{ type: "text/html", value: html }],
  };

  // Add attachment if present (Firearms Guardian PDF)
  if (attachment) {
    payload.attachments = [
      {
        content: attachment.content,
        filename: attachment.filename || "Application_Form.pdf",
        type: attachment.type || "application/pdf",
        disposition: "attachment",
      },
    ];
  }

  try {
    const sgResponse = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (sgResponse.status === 202) {
      return res.status(200).json({
        success: true,
        message: "Email sent successfully",
        statusCode: 202,
        timestamp: new Date().toISOString(),
      });
    } else {
      const errorBody = await sgResponse.text();
      console.error("SendGrid error:", sgResponse.status, errorBody);
      return res.status(500).json({
        success: false,
        error: "Failed to send email",
        message: `SendGrid returned ${sgResponse.status}`,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (err) {
    console.error("Email send error:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to send email",
      message: err.message,
      timestamp: new Date().toISOString(),
    });
  }
}
