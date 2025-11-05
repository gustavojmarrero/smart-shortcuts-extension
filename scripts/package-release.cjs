#!/usr/bin/env node

/**
 * Script to package the extension for GitHub Release
 * Creates a ZIP file ready for distribution
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DIST_DIR = path.join(__dirname, '..', 'dist');
const RELEASES_DIR = path.join(__dirname, '..', 'releases');
const PACKAGE_JSON = require('../package.json');

// Get version from package.json or manifest
const version = PACKAGE_JSON.version || '2.1.0';
const outputFileName = `smart-shortcuts-v${version}.zip`;
const outputPath = path.join(RELEASES_DIR, outputFileName);

console.log('📦 Packaging Smart Shortcuts Extension for Release...\n');

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
  console.log('🗑️  Removing old release package...');
  fs.unlinkSync(outputPath);
}

// 4. Create ZIP using system zip command (works on macOS/Linux)
try {
  console.log(`📦 Creating ${outputFileName}...`);

  // Change to dist directory and zip all contents
  execSync(`cd "${DIST_DIR}" && zip -r "${outputPath}" . -x "*.DS_Store"`, {
    stdio: 'inherit'
  });

  console.log('\n✅ Package created successfully!');
  console.log(`📍 Location: ${outputPath}`);

  // Get file size
  const stats = fs.statSync(outputPath);
  const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`📊 Size: ${fileSizeInMB} MB`);

  console.log('\n📝 Next steps:');
  console.log('1. Go to https://github.com/YOUR_USERNAME/YOUR_REPO/releases/new');
  console.log(`2. Create a new release with tag: v${version}`);
  console.log(`3. Upload the file: releases/${outputFileName}`);
  console.log('4. Publish the release\n');

} catch (error) {
  console.error('❌ Error creating package:', error.message);
  process.exit(1);
}
