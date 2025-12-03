/**
 * Simple Demo Server for Customer Service Module
 * Run with: node demo-server.js
 * Then visit: http://localhost:3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const CustomerServiceModule = require('./src/module/CustomerServiceModule');

// Store active sessions
const sessions = new Map();

const PORT = 3000;

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Serve the demo HTML file
  if (req.url === '/' || req.url === '/index.html') {
    fs.readFile(path.join(__dirname, 'examples/interactive-demo.html'), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading demo page');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
    return;
  }

  // API endpoints
  if (req.url === '/api/session/start' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { userId, cefrLevel } = JSON.parse(body);
        const module = new CustomerServiceModule();
        const session = module.startSession(userId, cefrLevel);
        sessions.set(session.sessionId, module);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(session));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  if (req.url.startsWith('/api/scenarios/') && req.method === 'GET') {
    const level = req.url.split('/')[3];
    try {
      const module = new CustomerServiceModule();
      const scenarios = module.getAvailableScenarios(level);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(scenarios));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  if (req.url.match(/^\/api\/session\/[^/]+\/scenario$/) && req.method === 'POST') {
    const sessionId = req.url.split('/')[3];
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { scenarioId } = JSON.parse(body);
        const module = sessions.get(sessionId);
        if (!module) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Session not found' }));
          return;
        }

        const scenarioData = module.selectScenario(scenarioId);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(scenarioData));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  if (req.url.match(/^\/api\/session\/[^/]+\/response$/) && req.method === 'POST') {
    const sessionId = req.url.split('/')[3];
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { type, data } = JSON.parse(body);
        const module = sessions.get(sessionId);
        if (!module) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Session not found' }));
          return;
        }

        const result = module.submitResponse(type, data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  if (req.url.match(/^\/api\/session\/[^/]+\/complete$/) && req.method === 'POST') {
    const sessionId = req.url.split('/')[3];
    try {
      const module = sessions.get(sessionId);
      if (!module) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Session not found' }));
        return;
      }

      const sessionData = module.completeSession('completed');
      const json = module.exportSessionJSON(true);

      // Clean up
      sessions.delete(sessionId);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        message: 'Session completed',
        data: sessionData,
        json: json
      }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // 404
  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║   Customer Service Module - Demo Server                  ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
  console.log('\n📝 Try the interactive demo in your browser!');
  console.log(`\n   Open: http://localhost:${PORT}\n`);
  console.log('Press Ctrl+C to stop the server\n');
});
