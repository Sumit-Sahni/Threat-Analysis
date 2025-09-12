// vuln-next/src/lib/logger.js
import path from 'path';
import pino from 'pino';

const ROOT = process.cwd();
const LOG_PATH = process.env.LOG_PATH || path.join(ROOT, 'app.log');

// pino logger that writes JSON-lines to app.log (non-blocking)
export const logger = pino({}, pino.destination({ dest: LOG_PATH, sync: true }));
