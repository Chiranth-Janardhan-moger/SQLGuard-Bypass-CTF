const express = require('express');
const { sqlguardjs } = require('sqlguardjs');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const port = 4040;

// Set up SQLite database
const db = new Database(':memory:');
db.exec("CREATE TABLE users (id INT, username TEXT, password TEXT, role TEXT)");
db.exec("INSERT INTO users VALUES (1, 'admin', 'supersecret', 'admin')");
db.exec("INSERT INTO users VALUES (2, 'user', 'password123', 'user')");

// CTF Flag Table
db.exec("CREATE TABLE flags (id INT, flag_value TEXT)");
db.exec("INSERT INTO flags VALUES (1, 'CTF{sqlguard_byp4ss_m4st3r_9921}')");

// Real-time logs for frontend
const logs = [];
let clients = [];

function broadcastLog(logEntry) {
  logs.push(logEntry);
  if (logs.length > 100) logs.shift(); // Keep last 100 logs
  clients.forEach(client => client.res.write(`data: ${JSON.stringify(logEntry)}\n\n`));
}

// SQLGuardJS setup with custom logging to broadcast
const guard = sqlguardjs({
  threshold: 0.5,
  suspiciousThreshold: 0.2,
  logAttacks: false // We will handle logging manually in a middleware or use the built-in if it logs to console, but we want to intercept it.
});

// Wait, sqlguardjs blocks requests internally and sends 403. 
// If it logs to console, we can't easily intercept without overriding console.log or extending it.
// Let's hook into the express middleware to log blocked requests. 
// Actually, sqlguardjs probably just calls next() or res.status(403).send().
// Let's use a wrapper middleware. Wait, sqlguardjs blocks and responds. 
// Let's see if we can just monitor the response status.
// A better way: proxy res.send to capture 403s triggered by sqlguardjs.
app.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function (body) {
    if (res.statusCode === 403) {
      broadcastLog({
        type: 'attack',
        timestamp: new Date().toISOString(),
        ip: req.ip,
        method: req.method,
        path: req.originalUrl,
        payload: { query: req.query, body: req.body, params: req.params },
        message: 'SQLGuardJS blocked the request'
      });
    }
    originalSend.call(this, body);
  };
  next();
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Apply SQLGuardJS global scanner
app.use(guard.global({ scanParams: false }));

// SSE endpoint for logs
app.get('/logs', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
  
  const client = { id: Date.now(), res };
  clients.push(client);
  
  // Send existing logs
  logs.forEach(log => res.write(`data: ${JSON.stringify(log)}\n\n`));
  
  req.on('close', () => {
    clients = clients.filter(c => c.id !== client.id);
  });
});

// Vulnerable Login Endpoint (Protected by SQLGuardJS)
app.post('/api/login', guard.route(), (req, res) => {
  const { username, password } = req.body;
  
  broadcastLog({
    type: 'info',
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    message: `Login attempt for username: ${username}`
  });

  // Vulnerable query: String concatenation
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  
  try {
    const row = db.prepare(query).get();
    if (row) {
      res.json({ success: true, user: row, message: 'Login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    broadcastLog({ type: 'error', message: err.message, timestamp: new Date().toISOString() });
    return res.status(500).json({ error: 'Database error' });
  }
});

// Vulnerable Search Endpoint (Protected by SQLGuardJS)
app.get('/api/search', guard.route(), (req, res) => {
  const { q } = req.query;
  
  broadcastLog({
    type: 'info',
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    message: `Search attempt for: ${q}`
  });

  // Vulnerable query
  const query = `SELECT username, role FROM users WHERE username LIKE '%${q}%'`;
  
  try {
    const rows = db.prepare(query).all();
    res.json({ success: true, results: rows });
  } catch (err) {
    broadcastLog({ type: 'error', message: err.message, timestamp: new Date().toISOString() });
    return res.status(500).json({ error: 'Database error' });
  }
});

// Verify Flag Endpoint
app.post('/api/verify-flag', (req, res) => {
  const { flag } = req.body;
  
  broadcastLog({
    type: 'info',
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    message: `Flag verification attempt`
  });

  if (flag === 'CTF{y0ur_h4ck3r_fl4g_h3r3}') {
    return res.status(400).json({ success: false, isTroll: true, message: "Don't be so clever?" });
  }

  try {
    const row = db.prepare("SELECT * FROM flags WHERE flag_value = ?").get(flag);
    if (row) {
      res.json({ success: true, message: 'Successfully bypassed it! You are a master.' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid flag. Keep trying!' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Database error' });
  }
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Test the application by visiting the above URL.');
  });
}

module.exports = app;
