// Post-build: patch wrangler.json for Worker deployment
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const distPath = join(process.cwd(), 'dist');
const serverConfig = join(distPath, 'server', 'wrangler.json');
const rootConfig = join(process.cwd(), 'wrangler.json');

try {
  // Read generated config
  const config = JSON.parse(readFileSync(serverConfig, 'utf-8'));

  // Strip fields that cause Worker deployment conflicts
  delete config.assets;       // ASSETS binding reserved
  delete config.topLevelName;
  delete config.configPath;
  delete config.userConfigPath;

  // Write patched config to dist/server/wrangler.json (what wrangler deploy reads)
  writeFileSync(serverConfig, JSON.stringify(config, null, 2));

  // Also copy to root
  writeFileSync(rootConfig, JSON.stringify(config, null, 2));

  console.log('✓ Patched dist/server/wrangler.json for Worker deploy');
} catch (e) {
  console.error('Failed:', e);
}
