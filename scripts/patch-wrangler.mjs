// Post-build: copy Worker config to root for wrangler deploy
import { copyFileSync } from 'node:fs';
import { join } from 'node:path';

const distPath = join(process.cwd(), 'dist');
const src = join(distPath, 'server', 'wrangler.json');
const dest = join(process.cwd(), 'wrangler.json');

try {
  copyFileSync(src, dest);
  console.log('✓ Copied dist/server/wrangler.json to ./wrangler.json');
} catch (e) {
  console.error('Failed:', e);
}
