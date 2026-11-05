// API sinkron data Warung Kantor (Vercel Serverless Function).
// Menyimpan seluruh data sebagai satu dokumen JSON di Upstash Redis (gratis via Vercel Marketplace).
// Env yang dibutuhkan:
//   KV_REST_API_URL / KV_REST_API_TOKEN   (otomatis diisi integrasi Upstash di Vercel)
//   atau UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
//   WARUNG_PIN  — PIN/kata sandi untuk membuka data
import { createHash, timingSafeEqual } from 'node:crypto';

const DATA_KEY = 'warung:data';
const REV_KEY = 'warung:rev';

// Simpan hanya jika revisi di server masih sama dengan revisi yang dipegang klien.
const SAVE_IF_REV = `
local cur = tonumber(redis.call('GET', KEYS[2]) or '0')
if cur ~= tonumber(ARGV[1]) then return {0, cur} end
redis.call('SET', KEYS[1], ARGV[2])
return {1, redis.call('INCR', KEYS[2])}`;

function env() {
  return {
    url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
    pin: process.env.WARUNG_PIN,
  };
}

async function redis(cfg, command) {
  const r = await fetch(cfg.url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${cfg.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
  });
  const j = await r.json();
  if (!r.ok || j.error) throw new Error(j.error || `Redis HTTP ${r.status}`);
  return j.result;
}

const hash = (s) => createHash('sha256').update(String(s)).digest();
const samePin = (a, b) => timingSafeEqual(hash(a), hash(b));

async function current(cfg) {
  const [data, rev] = await redis(cfg, ['MGET', DATA_KEY, REV_KEY]);
  return { data: data ? JSON.parse(data) : null, rev: Number(rev) || 0 };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const cfg = env();
  if (!cfg.url || !cfg.token || !cfg.pin) {
    return res.status(500).json({ error: 'Server belum dikonfigurasi: hubungkan database Upstash dan isi WARUNG_PIN.' });
  }
  if (!samePin(req.headers['x-pin'] || '', cfg.pin)) {
    await new Promise((r) => setTimeout(r, 800)); // perlambat tebak-tebakan PIN
    return res.status(401).json({ error: 'PIN salah' });
  }
  try {
    if (req.method === 'GET') return res.status(200).json(await current(cfg));

    if (req.method === 'PUT') {
      let body = req.body;
      if (typeof body === 'string') body = JSON.parse(body);
      const { data, base } = body || {};
      if (!data || !Array.isArray(data.products)) return res.status(400).json({ error: 'Data tidak valid' });
      const [ok, rev] = await redis(cfg, ['EVAL', SAVE_IF_REV, '2', DATA_KEY, REV_KEY, String(Number(base) || 0), JSON.stringify(data)]);
      if (ok === 1) return res.status(200).json({ rev });
      return res.status(409).json(await current(cfg)); // ada perubahan dari perangkat lain; klien akan menggabungkan
    }

    res.setHeader('Allow', 'GET, PUT');
    return res.status(405).json({ error: 'Method tidak didukung' });
  } catch (e) {
    return res.status(502).json({ error: 'Gagal menghubungi database' });
  }
}
