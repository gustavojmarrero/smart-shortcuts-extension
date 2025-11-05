#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Read version from manifest.json
const manifestPath = path.join(__dirname, '../public/manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const version = manifest.version;
const tag = `v${version}`;

// Check if release already exists
try {
  execSync(`gh release view ${tag}`, { stdio: 'pipe' });
  console.log(`✅ Release ${tag} already exists, skipping...`);
  process.exit(0);
} catch (error) {
  // Release doesn't exist, continue to create it
}

// Path to the ZIP file
const zipFile = path.join(__dirname, `../releases/smart-shortcuts-v${version}.zip`);

// Check if ZIP file exists
if (!fs.existsSync(zipFile)) {
  console.error(`❌ ZIP file not found: ${zipFile}`);
  process.exit(1);
}

// Read partial changelog for this version
const changelogPath = path.join(__dirname, '../CHANGELOG.md');
let releaseNotes = `## Smart Shortcuts v${version}

Ver [CHANGELOG completo](https://github.com/gustavojmarrero/smart-shortcuts-extension/blob/main/CHANGELOG.md) para detalles.

## 📥 Instalación

1. Descarga \`smart-shortcuts-v${version}.zip\`
2. Descomprime el archivo
3. Ve a \`chrome://extensions/\`
4. Activa "Modo desarrollador"
5. Click en "Cargar extensión sin empaquetar"
6. Selecciona la carpeta descomprimida

## 📚 Documentación

Ver [README](https://github.com/gustavojmarrero/smart-shortcuts-extension#readme) para más información.
`;

// Try to extract relevant section from CHANGELOG
try {
  const changelog = fs.readFileSync(changelogPath, 'utf8');
  const versionRegex = new RegExp(`## v${version.replace(/\./g, '\\.')}[^]*?(?=## v|$)`, 'i');
  const match = changelog.match(versionRegex);
  if (match) {
    releaseNotes = match[0].trim();
  }
} catch (error) {
  console.log('⚠️ Could not read CHANGELOG, using default notes');
}

// Create GitHub release
console.log(`📦 Creating GitHub Release ${tag}...`);

try {
  execSync(
    `gh release create "${tag}" "${zipFile}" --title "${tag} - Auto Release" --notes "${releaseNotes}"`,
    { stdio: 'inherit' }
  );
  console.log(`✅ Release ${tag} created successfully!`);
  console.log(`🔗 https://github.com/gustavojmarrero/smart-shortcuts-extension/releases/tag/${tag}`);
} catch (error) {
  console.error('❌ Failed to create release:', error.message);
  process.exit(1);
}
