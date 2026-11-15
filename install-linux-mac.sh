#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
node scripts/setup-env.mjs
(cd backend && npm install)
(cd frontend && npm install)
(cd admin-panel && npm install)
echo 'Done. Start MongoDB, run (cd backend && npm run seed:site), then run each dev server.'
