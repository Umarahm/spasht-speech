import { execSync } from 'child_process';
import { mkdirSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
  console.log('🔧 Starting post-build script...');

  // Create the data directory if it doesn't exist
  const dataDir = join(__dirname, 'dist', 'server', 'data');
  console.log('📁 Creating directory:', dataDir);
  mkdirSync(dataDir, { recursive: true });

  // Copy the jamtopics.js file
  const sourceFile = join(__dirname, '..', 'frontend', 'client', 'data', 'jamtopics.js');
  const destFile = join(dataDir, 'jamtopics.js');

  console.log('📋 Source file:', sourceFile);
  console.log('📋 Dest file:', destFile);

  copyFileSync(sourceFile, destFile);
  console.log('✅ JAM topics file copied successfully');
} catch (error) {
  console.error('❌ Failed to copy JAM topics file:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}
