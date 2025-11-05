import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');

console.log('📦 Running post-build tasks...');

// Ensure dist/icons directory exists
const iconsDir = join(distDir, 'icons');
if (!existsSync(iconsDir)) {
  mkdirSync(iconsDir, { recursive: true });
}

// Copy manifest.json
console.log('✓ Copying manifest.json...');
copyFileSync(
  join(rootDir, 'public', 'manifest.json'),
  join(distDir, 'manifest.json')
);

// Copy icons if they exist
const iconFiles = ['icon16.png', 'icon48.png', 'icon128.png', 'icon.svg'];
iconFiles.forEach(file => {
  const src = join(rootDir, 'public', 'icons', file);
  const dest = join(iconsDir, file);
  if (existsSync(src)) {
    copyFileSync(src, dest);
    console.log(`✓ Copied ${file}`);
  }
});

console.log('✅ Post-build complete!');
console.log('');
console.log('📦 Extension ready in: dist/');
console.log('   Load it in Chrome from chrome://extensions/');
console.log('');
console.log('🎉 All icons copied successfully!');
