import { mkdir, copyFile, cp } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
for (const file of ['index.html', 'styles.css', 'app.js', 'catalog.js', 'studio.js']) {
  await copyFile(`atelier/${file}`, `dist/${file}`);
}
await cp('atelier/assets', 'dist/assets', { recursive: true });
console.log('Static storefront built in dist/');
