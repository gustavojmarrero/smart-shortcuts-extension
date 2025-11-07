#!/usr/bin/env node

/**
 * Script to package the extension for Chrome Web Store
 * Removes the "key" field from manifest.json (required by Chrome Web Store)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DIST_DIR = path.join(__dirname, '..', 'dist');
const RELEASES_DIR = path.join(__dirname, '..', 'releases');
const TEMP_DIR = path.join(__dirname, '..', 'temp-webstore');
const PACKAGE_JSON = require('../package.json');

// Get version from package.json
const version = PACKAGE_JSON.version || '3.0.0';
const outputFileName = `smart-shortcuts-webstore-v${version}.zip`;
const outputPath = path.join(RELEASES_DIR, outputFileName);

console.log('📦 Packaging Smart Shortcuts for Chrome Web Store...\n');

// 1. Check if dist exists
if (!fs.existsSync(DIST_DIR)) {
  console.error('❌ Error: dist/ directory not found. Run `npm run build` first.');
  process.exit(1);
}

// 2. Create releases directory if it doesn't exist
if (!fs.existsSync(RELEASES_DIR)) {
  console.log('📁 Creating releases/ directory...');
  fs.mkdirSync(RELEASES_DIR, { recursive: true });
}

// 3. Remove old zip if exists
if (fs.existsSync(outputPath)) {
  console.log('🗑️  Removing old webstore package...');
  fs.unlinkSync(outputPath);
}

// 4. Clean temp directory if exists
if (fs.existsSync(TEMP_DIR)) {
  console.log('🧹 Cleaning temp directory...');
  fs.rmSync(TEMP_DIR, { recursive: true, force: true });
}

// 5. Copy dist to temp directory
console.log('📋 Copying dist/ to temp directory...');
fs.mkdirSync(TEMP_DIR, { recursive: true });
execSync(`cp -R "${DIST_DIR}"/* "${TEMP_DIR}"/`, { stdio: 'inherit' });

// 6. Remove "key" field from manifest.json
console.log('🔧 Removing "key" field from manifest.json...');
const manifestPath = path.join(TEMP_DIR, 'manifest.json');

if (!fs.existsSync(manifestPath)) {
  console.error('❌ Error: manifest.json not found in dist/');
  process.exit(1);
}

try {
  const manifestContent = fs.readFileSync(manifestPath, 'utf8');
  const manifest = JSON.parse(manifestContent);

  // Remove the "key" field
  if (manifest.key) {
    console.log('   ✓ Found "key" field, removing it...');
    delete manifest.key;
  } else {
    console.log('   ⚠️  No "key" field found (already clean)');
  }

  // Write back without the key field
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log('   ✓ manifest.json updated');

} catch (error) {
  console.error('❌ Error processing manifest.json:', error.message);
  process.exit(1);
}

// 7. Create ZIP from temp directory
try {
  console.log(`\n📦 Creating ${outputFileName}...`);

  execSync(`cd "${TEMP_DIR}" && zip -r "${outputPath}" . -x "*.DS_Store"`, {
    stdio: 'inherit'
  });

  console.log('\n✅ Chrome Web Store package created successfully!');
  console.log(`📍 Location: ${outputPath}`);

  // Get file size
  const stats = fs.statSync(outputPath);
  const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`📊 Size: ${fileSizeInMB} MB`);

} catch (error) {
  console.error('❌ Error creating package:', error.message);
  process.exit(1);
}

// 8. Clean up temp directory
console.log('\n🧹 Cleaning up temp directory...');
fs.rmSync(TEMP_DIR, { recursive: true, force: true });

console.log('\n📝 Next steps:');
console.log('1. Go to https://chrome.google.com/webstore/devconsole');
console.log('2. Click "New Item"');
console.log(`3. Upload: releases/${outputFileName}`);
console.log('4. Complete the listing and submit for review\n');
console.log('⚠️  IMPORTANT: This ZIP does NOT contain the "key" field (required by Chrome Web Store)');
console.log('   For development/GitHub releases, use `npm run package` instead.\n');
