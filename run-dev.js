const { spawn } = require('child_process');
const path = require('path');

console.log('🌱 Starting EcoFinds Development Environment...\n');

// Start backend server
console.log('📡 Starting backend server...');
const backend = spawn('node', ['index.js'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'inherit',
  shell: true
});

// Wait a bit then start frontend
setTimeout(() => {
  console.log('⚛️  Starting React development server...');
  const frontend = spawn('npm', ['start'], {
    cwd: path.join(__dirname, 'client'),
    stdio: 'inherit',
    shell: true
  });

  frontend.on('error', (err) => {
    console.error('Frontend server error:', err);
  });
}, 3000);

backend.on('error', (err) => {
  console.error('Backend server error:', err);
});

// Handle cleanup
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers...');
  backend.kill();
  process.exit();
});

console.log('\n🚀 EcoFinds will be available at:');
console.log('   Frontend: http://localhost:3000');
console.log('   Backend:  http://localhost:5000');
console.log('\nPress Ctrl+C to stop the servers.\n');
