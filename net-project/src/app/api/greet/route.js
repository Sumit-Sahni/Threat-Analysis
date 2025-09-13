import { logger } from '../../../lib/logger';

export async function GET(req) {
  const url = new URL(req.url, `http://${req.headers.get('host')}`);
  const name = url.searchParams.get('name') || 'Guest';

  const forwarded = req.headers.get('x-forwarded-for') || '';
  const remote = (forwarded.split(',')[0].trim() || req.headers.get('x-real-ip') || '127.0.0.1');

  logger.info({
    event: 'greet_called',
    timestamp: new Date().toISOString(),
    name,
    remote
  });

  // Vulnerable XSS: 
  const message = `<h1>Hello, ${name}</h1>`;

  logger.info({
    event: 'greet_response',
    timestamp: new Date().toISOString(),
    name
  });

  return new Response(message, {
    status: 200,
    headers: { 'content-type': 'text/html' }
  });
}
