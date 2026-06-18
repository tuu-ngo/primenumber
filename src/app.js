const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { checkPrime } = require('./primeChecker');

const app = express();
const PORT = process.env.PORT || 3000;

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      scriptSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '..', 'public')));

// ─── Health check ────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ─── API: check a single number ──────────────────────────────────────────────
// GET /api/check/:number
app.get('/api/check/:number', (req, res) => {
  const input = req.params.number;
  const result = checkPrime(input);

  const statusCode = result.error ? 400 : 200;
  return res.status(statusCode).json(result);
});

// POST /api/check  { "number": 17 }
app.post('/api/check', (req, res) => {
  const input = req.body.number;

  if (input === undefined || input === null || input === '') {
    return res.status(400).json({
      isPrime: null,
      number: null,
      error: 'Missing required field: "number".',
      message: 'Missing required field: "number".',
    });
  }

  const result = checkPrime(input);
  const statusCode = result.error ? 400 : 200;
  return res.status(statusCode).json(result);
});

// ─── Catch-all: serve index.html for any unknown routes ─────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// ─── Start server ────────────────────────────────────────────────────────────
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Prime Number Checker running on http://localhost:${PORT}`);
    console.log(`API docs: GET /api/check/:number  |  POST /api/check`);
    console.log(`Health:   GET /health`);
  });
}

module.exports = app;
