// vuln-next/src/lib/logger.js
import path from 'path';
import pino from 'pino';

const ROOT = process.cwd();
const LOG_PATH = path.join(ROOT, 'app.log');

export const logger = pino({}, pino.destination({ dest: LOG_PATH, sync: true }));
