import { existsSync, copyFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, '.env');
const envExamplePath = join(__dirname, '.env.example');
const serverNodeModules = join(__dirname, 'server', 'node_modules');

// Check if we should skip backend install (to avoid npm install loops)
const skipBackendInstall = process.argv.includes('--skip-backend-install');

console.log('🔧 Setting up Panahon Weather App...\n');

// Create .env from .env.example if it doesn't exist
if (!existsSync(envPath)) {
  if (existsSync(envExamplePath)) {
    copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env file from .env.example');
    console.log('📝 Default configuration loaded - no API keys required!');
  } else {
    console.log('⚠️  .env.example not found, but that\'s okay!');
    console.log('💡 Using default API URL: http://localhost:3001/api');
  }
} else {
  console.log('✅ .env file already exists');
}

// Check if backend dependencies are installed (unless we're in postinstall hook)
if (!skipBackendInstall && !existsSync(serverNodeModules)) {
  console.log('\n📦 Installing backend dependencies...');
  try {
    execSync('npm install', {
      cwd: join(__dirname, 'server'),
      stdio: 'inherit'
    });
    console.log('✅ Backend dependencies installed');
  } catch (error) {
    console.error('❌ Failed to install backend dependencies');
    console.error('   Please run: cd server && npm install');
  }
} else if (!skipBackendInstall) {
  console.log('✅ Backend dependencies already installed');
}

console.log('\n🌤️  Panahon Weather App Setup Complete!');
console.log('🚀 Run "npm start" to launch the application\n');
