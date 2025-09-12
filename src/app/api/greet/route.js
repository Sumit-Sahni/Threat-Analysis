// src/app/api/greet/route.js
import pino from 'pino';
import path from 'path';

const ROOT = process.cwd();
const LOG_PATH = process.env.LOG_PATH || path.join(ROOT, 'app.log');
const logger = pino({}, pino.destination({ dest: LOG_PATH, sync: false }));

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const name = url.searchParams.get('name') || 'Guest';
    const forwarded = req.headers.get('x-forwarded-for') || '';
    const remote = (forwarded.split(',')[0].trim() || req.headers.get('x-real-ip') || req.headers.get('host') || '127.0.0.1');

    logger.info({
      event: 'greet',
      timestamp: new Date().toISOString(),
      remote,
      path: url.pathname + url.search,
      params: { name },
      ua: req.headers.get('user-agent') || ''
    });

    const body = `<html><body><h1>Hello ${name}</h1></body></html>`;
    return new Response(body, { status: 200, headers: { 'content-type': 'text/html; charset=utf-8' } });
  } catch (err) {
    logger.error({ event: 'greet_error', error: String(err) });
    return new Response('internal', { status: 500 });
  }
}
