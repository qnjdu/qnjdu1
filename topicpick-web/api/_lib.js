// 공통: 로그인한 사용자 확인 + 서버 전용 Supabase 클라이언트
const { createClient } = require("@supabase/supabase-js");

const admin = () => createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

async function authed(req, db) {
  const token = String(req.headers.authorization || "").replace(/^Bearer /i, "");
  if (!token) return null;
  const { data } = await db.auth.getUser(token);
  return data && data.user ? data.user : null;
}
module.exports = { admin, authed };
