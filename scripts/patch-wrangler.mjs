// Post-build: strip Worker-only fields from wrangler.json for Pages compatibility
import { readFileSync, writeFileSync, renameSync, existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const distPath = join(process.cwd(), 'dist');
const serverPath = join(distPath, 'server');
const functionsPath = join(distPath, 'functions');

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

  // Move server/ to functions/ so Cloudflare Pages detects it
  if (existsSync(serverPath)) {
    if (existsSync(functionsPath)) {
      rmSync(functionsPath, { recursive: true });
    }
    renameSync(serverPath, functionsPath);
    console.log('✓ Moved dist/server/ to dist/functions/');
  }
} catch (e) {
  console.error('Failed to patch wrangler.json:', e);
  process.exit(1);
}
