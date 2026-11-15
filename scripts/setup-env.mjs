import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
for (const name of ['backend', 'frontend', 'admin-panel']) {
  const target = resolve(root, name, '.env');
  if (existsSync(target)) {
    console.log(`${name}/.env already exists; kept unchanged.`);
    continue;
  }
  const template = readFileSync(resolve(root, name, '.env.example'), 'utf8');
  let config = template;
  if (name === 'backend') {
    config = config
      .replace(/^JWT_SECRET=.*$/m, `JWT_SECRET=${randomBytes(48).toString('hex')}`)
      .replace(/^ADMIN_SETUP_KEY=.*$/m, `ADMIN_SETUP_KEY=${randomBytes(32).toString('hex')}`);
  }
  writeFileSync(target, config, { mode: 0o600 });
  console.log(`Created ${name}/.env. Review its settings before deploying.`);
}
