import { promises as fs } from 'fs';
import path from 'path';
import { logger } from '../../../lib/logger'; // relative import


export async function GET(req) {
  try {
    const url = new URL(req.url, `http://${req.headers.get('host')}`);
    const q = url.searchParams.get('q') || '';

    // Log that a search was called
    logger.info({
      event: 'search_called',
      timestamp: new Date().toISOString(),
      query: q,
      remote: req.headers.get('x-forwarded-for') || req.headers.get('host') || '127.0.0.1'
    });

    const dbFile = path.join(process.cwd(), 'data', 'posts.json');
    const raw = await fs.readFile(dbFile, 'utf8');
    const posts = JSON.parse(raw);

    const results = posts.filter(p =>
      String(p.title).toLowerCase().includes(String(q).toLowerCase())
    );
    console.log(results)
    // Log the results count
    logger.info({
      event: 'search_results',
      timestamp: new Date().toISOString(),
      query: q,
      results: results.length
    });

    return new Response(JSON.stringify({ count: results.length, results }), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    });

  } catch (err) {
    console.error('ERROR in search route:', err);
    logger.error({ event: 'search_error', error: String(err) });
    return new Response(JSON.stringify({ error: 'internal' }), { status: 500 });
  }
}
