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
  delete config.topLevelName;
  delete config.configPath;
  delete config.userConfigPath;
  delete config.pages_build_output_dir;

  // Keep assets but ensure it's not treated as Pages config
  // (pages_build_output_dir was the field triggering Pages validation)

  // Write patched config to dist/server/wrangler.json (what wrangler deploy reads)
  writeFileSync(serverConfig, JSON.stringify(config, null, 2));

  // Also copy to root
  writeFileSync(rootConfig, JSON.stringify(config, null, 2));

  console.log('✓ Patched dist/server/wrangler.json for Worker deploy');
} catch (e) {
  console.error('Failed:', e);
}
