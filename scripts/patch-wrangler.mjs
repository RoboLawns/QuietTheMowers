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

  // Strip fields that cause Worker deployment conflicts
  delete config.topLevelName;
  delete config.configPath;
  delete config.userConfigPath;
  delete config.pages_build_output_dir;

  // Inject D1 binding (adapter can't find it without root wrangler.toml)
  config.d1_databases = [
    {
      binding: 'DB',
      database_name: 'qtm-db',
      database_id: '0715ecc3-0eb0-4dbc-9b82-62c3d8290cc7',
    },
  ];

  // Inject KV binding for sessions (real namespace from Cloudflare)
  config.kv_namespaces = [
    { binding: 'SESSION', id: 'cc41ce95d66c419e8bf05250cf2f0a0a' },
  ];

  // Write patched config to dist/server/wrangler.json (what wrangler deploy reads)
  writeFileSync(serverConfig, JSON.stringify(config, null, 2));

  // Also copy to root
  writeFileSync(rootConfig, JSON.stringify(config, null, 2));

  console.log('✓ Patched dist/server/wrangler.json for Worker deploy');
} catch (e) {
  console.error('Failed:', e);
}
