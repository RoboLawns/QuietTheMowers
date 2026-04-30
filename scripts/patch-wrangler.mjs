// Post-build: copy and patch Worker config to root for wrangler deploy
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';

const distPath = join(process.cwd(), 'dist');
const src = join(distPath, 'server', 'wrangler.json');
const dest = join(process.cwd(), 'wrangler.json');

try {
  // Read generated config
  const config = JSON.parse(readFileSync(src, 'utf-8'));

  // Strip fields that cause Worker deployment conflicts
  delete config.assets;       // ASSETS binding reserved in Worker context
  delete config.topLevelName;
  delete config.configPath;
  delete config.userConfigPath;

  // Write patched config to root
  writeFileSync(dest, JSON.stringify(config, null, 2));
  console.log('✓ Patched wrangler.json and copied to root');
} catch (e) {
  console.error('Failed:', e);
}
