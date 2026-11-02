// POST /api/resource {id} — 네이버 뉴스 5건 + 백과사전 3건. 30분 캐시. 키가 없으면 noKey.
const { admin, authed } = require("./_lib");

const TTL = 30 * 60 * 1000;
const cache = new Map();

const clean = (s) =>
  String(s == null ? "" : s).replace(/<[^>]+>/g, "").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").trim();

async function naver(api, q, n, id, secret) {
  const r = await fetch(`https://openapi.naver.com/v1/search/${api}.json?display=${n}&query=${encodeURIComponent(q)}`, {
    headers: { "X-Naver-Client-Id": id, "X-Naver-Client-Secret": secret },
  });
  if (!r.ok) throw new Error("Naver HTTP " + r.status); // 401 키 오류, 429 일일 한도
  return (await r.json()).items || [];
}

async function news(q, id, sec) {
  const out = [];
  for (const o of await naver("news", q, 5, id, sec)) {
    const title = clean(o.title), link = String(o.originallink || "").startsWith("http") ? o.originallink : o.link;
    if (!title || !String(link).startsWith("http")) continue;
    let host = ""; try { host = new URL(link).host.replace(/^www\./, ""); } catch (e) {}
    let date = ""; try { date = new Date(o.pubDate).toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" }); } catch (e) {}
    let desc = clean(o.description); if (desc.length > 110) desc = desc.slice(0, 110) + "…";
    out.push({ title, link, host, date, desc });
  }
  return out;
}

async function refs(q, id, sec) {
  const out = [];
  for (const o of await naver("encyc", q, 3, id, sec)) {
    const title = clean(o.title), link = String(o.link || "");
    if (!title || !link.startsWith("http")) continue;
    let desc = clean(o.description); if (desc.length > 140) desc = desc.slice(0, 140) + "…";
    out.push({ title, link, desc });
  }
  return out;
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  try {
    const db = admin();
    const user = await authed(req, db);
    if (!user) return res.status(401).json({ error: "login" });

    const id = Number((req.body || {}).id);
    const { data: t } = await db.from("topics").select("*").eq("id", id).maybeSingle();
    if (!t) return res.status(404).json({ error: "notfound" });

    const nid = process.env.NAVER_CLIENT_ID, sec = process.env.NAVER_CLIENT_SECRET;
    if (!nid || !sec) return res.status(200).json({ topic: t, noKey: true, news: null, refs: null });

    const nq = (t.res && t.res[0] && t.res[0].q) || t.keyword, rq = (t.res && t.res[1] && t.res[1].q) || t.keyword;
    const ck = nq + "|" + rq, hit = cache.get(ck);
    if (hit && Date.now() - hit.at < TTL) return res.status(200).json({ topic: t, noKey: false, news: hit.news, refs: hit.refs });

    let n = null, w = null;
    try { n = await news(nq, nid, sec); } catch (e) { console.error("네이버 뉴스 실패", String(e)); }
    try { w = await refs(rq, nid, sec); } catch (e) { console.error("네이버 백과 실패", String(e)); }
    if (n && w) cache.set(ck, { at: Date.now(), news: n, refs: w });
    return res.status(200).json({ topic: t, noKey: false, news: n, refs: w });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server" });
  }
};
