// Settings persistence backed by the GitHub Contents API.
//
// The frontend contract is unchanged:
//   GET  /api/settings       -> { success, settings: {agents, templates} | null }
//   POST /api/settings       -> { success, error? }
//
// Required environment variables on the server (set these in Vercel → Project → Settings → Environment Variables):
//   GITHUB_TOKEN           Fine-grained PAT with Contents: Read & Write for the target repo.
//                          For minimum blast-radius, scope it to a single repo and a single file path.
//   GITHUB_OWNER           e.g. "bully911210"
//   GITHUB_REPO            e.g. "sendgrid"
// Optional:
//   GITHUB_SETTINGS_PATH   defaults to "data/settings.json"
//   GITHUB_BRANCH          defaults to "main"
//
// If these are not configured, GET returns settings:null (app falls back to
// hardcoded defaults and shows a banner) and POST returns a 500 error.

const DEFAULT_PATH = "data/settings.json";
const DEFAULT_BRANCH = "main";
const COMMIT_MESSAGE = "chore(settings): update SigMail settings via admin UI";

function githubConfig() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  if (!token || !owner || !repo) return null;
  return {
    token,
    owner,
    repo,
    path: process.env.GITHUB_SETTINGS_PATH || DEFAULT_PATH,
    branch: process.env.GITHUB_BRANCH || DEFAULT_BRANCH,
  };
}

function contentsUrl(cfg, withRef) {
  const base = `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${encodeURI(cfg.path)}`;
  return withRef ? `${base}?ref=${encodeURIComponent(cfg.branch)}` : base;
}

function ghHeaders(cfg, hasBody) {
  return {
    Authorization: `Bearer ${cfg.token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(hasBody ? { "Content-Type": "application/json" } : {}),
  };
}

async function readCurrentFile(cfg) {
  const res = await fetch(contentsUrl(cfg, true), {
    method: "GET",
    headers: ghHeaders(cfg, false),
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub GET failed: ${res.status} ${body}`);
  }
  const json = await res.json();
  const decoded = Buffer.from(json.content || "", "base64").toString("utf-8");
  let parsed = null;
  try {
    parsed = decoded ? JSON.parse(decoded) : null;
  } catch (err) {
    throw new Error(`Settings file is not valid JSON: ${err.message}`);
  }
  return { settings: parsed, sha: json.sha };
}

async function writeFile(cfg, settings, sha) {
  const content = Buffer.from(JSON.stringify(settings, null, 2), "utf-8").toString("base64");
  const body = {
    message: COMMIT_MESSAGE,
    content,
    branch: cfg.branch,
  };
  if (sha) body.sha = sha;

  const res = await fetch(contentsUrl(cfg, false), {
    method: "PUT",
    headers: ghHeaders(cfg, true),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`GitHub PUT failed: ${res.status} ${errBody}`);
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const cfg = githubConfig();

  if (req.method === "GET") {
    if (!cfg) {
      return res.status(200).json({ success: true, settings: null });
    }
    try {
      const current = await readCurrentFile(cfg);
      return res.status(200).json({ success: true, settings: current ? current.settings : null });
    } catch (err) {
      console.error("Settings read error:", err);
      return res.status(200).json({ success: true, settings: null });
    }
  }

  if (req.method === "POST") {
    if (!cfg) {
      return res.status(500).json({ success: false, error: "GitHub storage is not configured on the server" });
    }

    const { agents, templates } = req.body || {};
    if (!Array.isArray(agents) || typeof templates !== "object" || templates === null) {
      return res.status(400).json({ success: false, error: "Invalid settings payload" });
    }

    try {
      const current = await readCurrentFile(cfg);
      await writeFile(cfg, { agents, templates }, current?.sha);
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error("Settings save error:", err);
      return res.status(500).json({ success: false, error: "Failed to save settings" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
