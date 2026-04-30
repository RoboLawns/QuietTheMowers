// Post-build: patch wrangler.json and worker entry for Cloudflare Workers deploy
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const distPath = join(process.cwd(), 'dist');
const serverConfig = join(distPath, 'server', 'wrangler.json');
const rootConfig = join(process.cwd(), 'wrangler.json');
const entryPath = join(distPath, 'server', 'entry.mjs');

try {
  // Patch worker entry to copy env to process.env inside the handler
  let entry = readFileSync(entryPath, 'utf-8');

  // Find the default export function and inject env shim
  entry = entry.replace(
    'export {',
    `// Inject env vars into process.env at handler time (not module scope)
import { env as workerEnv } from 'cloudflare:workers';
if (workerEnv && Object.keys(workerEnv).length > 0) {
  Object.assign(globalThis.process.env, Object.fromEntries(
    Object.entries(workerEnv).filter(([_,v]) => typeof v === 'string')
  ));
}
export {`
  );

  writeFileSync(entryPath, entry);

  // Patch wrangler.json
  const config = JSON.parse(readFileSync(serverConfig, 'utf-8'));
  delete config.topLevelName;
  delete config.configPath;
  delete config.userConfigPath;
  delete config.pages_build_output_dir;

  config.d1_databases = [
    { binding: 'DB', database_name: 'qtm-db', database_id: '0715ecc3-0eb0-4dbc-9b82-62c3d8290cc7' },
  ];
  config.kv_namespaces = [
    { binding: 'SESSION', id: 'cc41ce95d66c419e8bf05250cf2f0a0a' },
  ];

  // R2 bucket for image uploads
  config.r2_buckets = [
    { binding: 'UPLOADS', bucket_name: 'qtm-uploads' },
  ];

  writeFileSync(serverConfig, JSON.stringify(config, null, 2));
  writeFileSync(rootConfig, JSON.stringify(config, null, 2));
  console.log('✓ Patched wrangler.json + env shim for Worker deploy');
} catch (e) {
  console.error('Failed:', e);
}
