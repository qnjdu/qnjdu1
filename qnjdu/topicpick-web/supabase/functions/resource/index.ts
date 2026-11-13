// 주제의 네이버 뉴스 5건 + 백과사전 3건. 30분 캐시. 키가 없으면 noKey 로 알려 준다.
import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });

const TTL = 30 * 60 * 1000;
const cache = new Map<string, { at: number; news: unknown; refs: unknown }>();

const clean = (s: unknown) =>
  String(s ?? "").replace(/<[^>]+>/g, "").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").trim();

async function naver(api: string, q: string, n: number, id: string, secret: string) {
  const r = await fetch(`https://openapi.naver.com/v1/search/${api}.json?display=${n}&query=${encodeURIComponent(q)}`, {
    headers: { "X-Naver-Client-Id": id, "X-Naver-Client-Secret": secret },
  });
  if (!r.ok) throw new Error("Naver HTTP " + r.status);   // 401 키 오류, 429 일일 한도
  return (await r.json()).items as any[];
}

async function news(q: string, id: string, sec: string) {
  const out = [];
  for (const o of await naver("news", q, 5, id, sec)) {
    const title = clean(o.title), link = String(o.originallink || "").startsWith("http") ? o.originallink : o.link;
    if (!title || !String(link).startsWith("http")) continue;
    let host = ""; try { host = new URL(link).host.replace(/^www\./, ""); } catch { /* 무시 */ }
    let date = ""; try { date = new Date(o.pubDate).toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" }); } catch { /* 무시 */ }
    let desc = clean(o.description); if (desc.length > 110) desc = desc.slice(0, 110) + "…";
    out.push({ title, link, host, date, desc });
  }
  return out;
}

async function refs(q: string, id: string, sec: string) {
  const out = [];
  for (const o of await naver("encyc", q, 3, id, sec)) {
    const title = clean(o.title), link = String(o.link || "");
    if (!title || !link.startsWith("http")) continue;
    let desc = clean(o.description); if (desc.length > 140) desc = desc.slice(0, 140) + "…";
    out.push({ title, link, desc });
  }
  return out;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const token = (req.headers.get("Authorization") || "").replace(/^Bearer /i, "");
    const { data: { user } } = await admin.auth.getUser(token);
    if (!user) return json({ error: "login" }, 401);

    const { id } = await req.json().catch(() => ({}));
    const { data: t } = await admin.from("topics").select("*").eq("id", Number(id)).maybeSingle();
    if (!t) return json({ error: "notfound" }, 404);

    const nid = Deno.env.get("NAVER_CLIENT_ID"), sec = Deno.env.get("NAVER_CLIENT_SECRET");
    if (!nid || !sec) return json({ topic: t, noKey: true, news: null, refs: null });

    const nq = t.res?.[0]?.q || t.keyword, rq = t.res?.[1]?.q || t.keyword;
    const ck = nq + "|" + rq, hit = cache.get(ck);
    if (hit && Date.now() - hit.at < TTL) return json({ topic: t, noKey: false, news: hit.news, refs: hit.refs });

    let n = null, w = null;
    try { n = await news(nq, nid, sec); } catch (e) { console.error("네이버 뉴스 실패", String(e)); }
    try { w = await refs(rq, nid, sec); } catch (e) { console.error("네이버 백과 실패", String(e)); }
    if (n && w) cache.set(ck, { at: Date.now(), news: n, refs: w });
    return json({ topic: t, noKey: false, news: n, refs: w });
  } catch (e) {
    console.error(e);
    return json({ error: "server" }, 500);
  }
});
