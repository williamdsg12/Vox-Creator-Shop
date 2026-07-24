import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distBackend = path.join(__dirname, '..', 'dist-backend');

if (!fs.existsSync(distBackend)) {
  fs.mkdirSync(distBackend, { recursive: true });
}

fs.writeFileSync(
  path.join(distBackend, 'package.json'),
  JSON.stringify({ type: 'commonjs' }, null, 2)
);
console.log('✅ Created dist-backend/package.json with type: commonjs');
