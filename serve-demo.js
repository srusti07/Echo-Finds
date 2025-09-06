const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, 'demo.html');
  
  if (req.url === '/') {
    filePath = path.join(__dirname, 'demo.html');
  }
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('File not found');
      return;
    }
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`🌱 EcoFinds Demo running at http://localhost:${PORT}`);
  console.log('📱 Features available in this demo:');
  console.log('   • Responsive design for mobile and desktop');
  console.log('   • Product browsing interface');
  console.log('   • User authentication forms');
  console.log('   • Modern Material Design UI');
  console.log('\n💡 This is a static demo. For full functionality, run the complete React/Node.js application.');
});

module.exports = server;
