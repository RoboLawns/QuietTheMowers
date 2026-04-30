// Post-build: prepare dist/ for Cloudflare Pages deployment
import { readFileSync, writeFileSync, renameSync, existsSync, rmSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const distPath = join(process.cwd(), 'dist');
const serverPath = join(distPath, 'server');
const clientPath = join(distPath, 'client');
const wranglerPath = join(serverPath, 'wrangler.json');

try {
  // 1. Patch wrangler.json in dist/server/
  const config = JSON.parse(readFileSync(wranglerPath, 'utf-8'));
  const strip = [
    'main', 'assets', 'rules', 'previews', 'build', 'dev',
    'triggers', 'dispatch_namespaces', 'no_bundle', 'legacy_env',
    'jsx_factory', 'jsx_fragment', 'topLevelName', 'configPath',
    'userConfigPath', 'definedEnvironments',
    'observability', 'python_modules', 'cloudchamber', 'flagship',
    'unsafe_hello_world', 'mtls_certificates', 'services',
    'tail_consumers', 'secrets_store_secrets', 'artifacts',
    'analytics_engine_datasets',
    'logfwdr', 'pages_build_output_dir', 'worker_loaders',
    'ratelimits', 'pipelines', 'vpc_services', 'vpc_networks',
    'ai_search', 'ai_search_namespaces',
  ];
  for (const key of strip) delete config[key];
  writeFileSync(wranglerPath, JSON.stringify(config, null, 2));
  console.log('✓ Patched wrangler.json');

  // 2. Move entry.mjs to dist/_worker.js
  const entryPath = join(serverPath, 'entry.mjs');
  if (existsSync(entryPath)) {
    renameSync(entryPath, join(distPath, '_worker.js'));
    console.log('✓ Moved entry.mjs to dist/_worker.js');
  }

  // 3. Move server chunks to dist/chunks/
  const serverChunks = join(serverPath, 'chunks');
  if (existsSync(serverChunks)) {
    const destChunks = join(distPath, 'chunks');
    if (existsSync(destChunks)) rmSync(destChunks, { recursive: true });
    renameSync(serverChunks, destChunks);
    console.log('✓ Moved server chunks to dist/chunks/');
  }

  // 4. Clean up dist/server/
  rmSync(serverPath, { recursive: true });

  // 5. Move dist/client/ contents to dist/ root
  if (existsSync(clientPath)) {
    const clientFiles = readdirSync(clientPath, { withFileTypes: true });
    for (const entry of clientFiles) {
      const src = join(clientPath, entry.name);
      const dest = join(distPath, entry.name);
      if (existsSync(dest)) {
        if (entry.isDirectory()) rmSync(dest, { recursive: true });
        else rmSync(dest);
      }
      renameSync(src, dest);
    }
    rmSync(clientPath, { recursive: true });
    console.log('✓ Moved dist/client/ contents to dist/ root');
  }

  console.log('✓ Build ready for Cloudflare Pages');
} catch (e) {
  console.error('Failed to prepare dist:', e);
  process.exit(1);
}
