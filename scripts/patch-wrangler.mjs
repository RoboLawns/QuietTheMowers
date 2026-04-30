// Post-build: strip Worker-only fields from wrangler.json for Pages compatibility
import { readFileSync, writeFileSync, renameSync, existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const distPath = join(process.cwd(), 'dist');
const serverPath = join(distPath, 'server');

const wranglerPath = join(serverPath, 'wrangler.json');

try {
  const config = JSON.parse(readFileSync(wranglerPath, 'utf-8'));

  // Fields not supported by Cloudflare Pages Functions
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

  for (const key of strip) {
    delete config[key];
  }

  // Add Pages-required fields
  config.pages_build_output_dir = '../client';

  writeFileSync(wranglerPath, JSON.stringify(config, null, 2));
  console.log('✓ Patched wrangler.json for Cloudflare Pages');

  // Cloudflare Pages expects _worker.js in the output root for SSR
  // The Cloudflare adapter generates entry.mjs in dist/server/
  const entryPath = join(serverPath, 'entry.mjs');
  const chunksPath = join(serverPath, 'chunks');

  if (existsSync(entryPath)) {
    // Move entry.mjs to dist/_worker.js
    renameSync(entryPath, join(distPath, '_worker.js'));
    // Move chunks alongside
    if (existsSync(chunksPath)) {
      const destChunks = join(distPath, 'chunks');
      if (existsSync(destChunks)) rmSync(destChunks, { recursive: true });
      renameSync(chunksPath, destChunks);
    }
    // Clean up server/functions dir
    rmSync(serverPath, { recursive: true });
    console.log('✓ Moved entry.mjs to dist/_worker.js');
  }
} catch (e) {
  console.error('Failed to patch wrangler.json:', e);
  process.exit(1);
}
