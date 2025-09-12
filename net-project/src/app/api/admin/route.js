// src/app/api/admin/route.js
import pino from 'pino';
import path from 'path';

const ROOT = process.cwd();
const LOG_PATH = process.env.LOG_PATH || path.join(ROOT, 'app.log');
const logger = pino({}, pino.destination({ dest: LOG_PATH, sync: false }));

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const isAdmin = url.searchParams.get('admin') === 'true';
    const forwarded = req.headers.get('x-forwarded-for') || '';
    const remote = (forwarded.split(',')[0].trim() || req.headers.get('x-real-ip') || req.headers.get('host') || '127.0.0.1');

    logger.info({
      event: 'admin_access',
      timestamp: new Date().toISOString(),
      remote,
      path: url.pathname + url.search,
      params: { admin: url.searchParams.get('admin') },
      ua: req.headers.get('user-agent') || ''
    });

    if (isAdmin) {
      return new Response(JSON.stringify({ success: true, msg: 'Admin action performed' }), {
        status: 200,
        headers: { 'content-type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: false, msg: 'Forbidden' }), {
      status: 403,
      headers: { 'content-type': 'application/json' }
    });
  } catch (err) {
    logger.error({ event: 'admin_error', error: String(err) });
    return new Response(JSON.stringify({ error: 'internal' }), { status: 500 });
  }
}
