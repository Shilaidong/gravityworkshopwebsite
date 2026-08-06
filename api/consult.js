/**
 * 咨询表单入口：校验 → 飞书私聊通知业主。
 * 环境变量（Vercel）：FEISHU_APP_ID / FEISHU_APP_SECRET / FEISHU_RECEIVE_ID
 */
const APP_ID = process.env.FEISHU_APP_ID || "";
const APP_SECRET = process.env.FEISHU_APP_SECRET || "";
const RECEIVE_ID = process.env.FEISHU_RECEIVE_ID || "";

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

async function parseFields(req) {
  const ctype = String(req.headers["content-type"] || "");
  if (ctype.includes("application/json")) {
    const raw = typeof req.body === "string" ? req.body : await readBody(req);
    const data = typeof req.body === "object" && req.body && !Buffer.isBuffer(req.body)
      ? req.body
      : JSON.parse(raw || "{}");
    return {
      name: String(data.name || "").trim(),
      contact: String(data.contact || "").trim(),
      intent: String(data.intent || "").trim(),
      note: String(data.note || "").trim(),
    };
  }

  // multipart / x-www-form-urlencoded：Vercel 有时已解析到 req.body
  if (req.body && typeof req.body === "object" && !Buffer.isBuffer(req.body)) {
    return {
      name: String(req.body.name || "").trim(),
      contact: String(req.body.contact || "").trim(),
      intent: String(req.body.intent || "").trim(),
      note: String(req.body.note || "").trim(),
    };
  }

  const raw = await readBody(req);
  if (ctype.includes("application/x-www-form-urlencoded")) {
    const params = new URLSearchParams(raw);
    return {
      name: String(params.get("name") || "").trim(),
      contact: String(params.get("contact") || "").trim(),
      intent: String(params.get("intent") || "").trim(),
      note: String(params.get("note") || "").trim(),
    };
  }
  throw new Error("unsupported content-type");
}

async function feishuToken() {
  const r = await fetch(
    "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ app_id: APP_ID, app_secret: APP_SECRET }),
    },
  );
  const j = await r.json();
  if (!j.tenant_access_token) {
    throw new Error("feishu token failed: " + (j.msg || r.status));
  }
  return j.tenant_access_token;
}

async function notify(fields) {
  const token = await feishuToken();
  const lines = [
    "【引力坊官网 · 新咨询】",
    "称呼：" + fields.name,
    "联系方式：" + fields.contact,
    "意向：" + (fields.intent || "（未选）"),
    "补充：" + (fields.note || "（无）"),
  ];
  const r = await fetch(
    "https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=open_id",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        receive_id: RECEIVE_ID,
        msg_type: "text",
        content: JSON.stringify({ text: lines.join("\n") }),
      }),
    },
  );
  const j = await r.json();
  if (j.code !== 0) {
    throw new Error("feishu send failed: " + (j.msg || j.code));
  }
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }
  if (!APP_ID || !APP_SECRET || !RECEIVE_ID) {
    return res.status(500).json({ ok: false, error: "not_configured" });
  }

  try {
    const fields = await parseFields(req);
    if (!fields.name || !fields.contact) {
      return res.status(400).json({ ok: false, error: "missing_fields" });
    }
    await notify(fields);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("consult error", err && err.message ? err.message : err);
    return res.status(502).json({ ok: false, error: "upstream" });
  }
};
