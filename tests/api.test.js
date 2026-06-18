const request = require('supertest');
const app = require('../src/app');

describe('GET /health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('uptime');
  });
});

describe('GET /api/check/:number', () => {
  it('returns isPrime: true for 17', async () => {
    const res = await request(app).get('/api/check/17');
    expect(res.statusCode).toBe(200);
    expect(res.body.isPrime).toBe(true);
    expect(res.body.number).toBe(17);
    expect(res.body.error).toBeNull();
  });

  it('returns isPrime: true for 2', async () => {
    const res = await request(app).get('/api/check/2');
    expect(res.statusCode).toBe(200);
    expect(res.body.isPrime).toBe(true);
  });

  it('returns isPrime: false for 1', async () => {
    const res = await request(app).get('/api/check/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.isPrime).toBe(false);
  });

  it('returns isPrime: false for 4', async () => {
    const res = await request(app).get('/api/check/4');
    expect(res.statusCode).toBe(200);
    expect(res.body.isPrime).toBe(false);
  });

  it('returns isPrime: false for 0', async () => {
    const res = await request(app).get('/api/check/0');
    expect(res.statusCode).toBe(200);
    expect(res.body.isPrime).toBe(false);
  });

  it('returns isPrime: false for negative number', async () => {
    const res = await request(app).get('/api/check/-7');
    expect(res.statusCode).toBe(200);
    expect(res.body.isPrime).toBe(false);
  });

  it('returns 400 for non-numeric input', async () => {
    const res = await request(app).get('/api/check/abc');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).not.toBeNull();
    expect(res.body.isPrime).toBeNull();
  });

  it('returns 400 for decimal input', async () => {
    const res = await request(app).get('/api/check/3.14');
    expect(res.statusCode).toBe(400);
    expect(res.body.isPrime).toBeNull();
  });

  it('handles large prime 1000003', async () => {
    const res = await request(app).get('/api/check/1000003');
    expect(res.statusCode).toBe(200);
    expect(res.body.isPrime).toBe(true);
  });

  it('response has required shape: isPrime, number, error, message', async () => {
    const res = await request(app).get('/api/check/7');
    expect(res.body).toHaveProperty('isPrime');
    expect(res.body).toHaveProperty('number');
    expect(res.body).toHaveProperty('error');
    expect(res.body).toHaveProperty('message');
  });
});

describe('POST /api/check', () => {
  it('returns isPrime: true for { number: 97 }', async () => {
    const res = await request(app)
      .post('/api/check')
      .send({ number: 97 })
      .set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(res.body.isPrime).toBe(true);
    expect(res.body.number).toBe(97);
  });

  it('returns isPrime: false for { number: 10 }', async () => {
    const res = await request(app)
      .post('/api/check')
      .send({ number: 10 });
    expect(res.statusCode).toBe(200);
    expect(res.body.isPrime).toBe(false);
  });

  it('returns 400 when "number" field is missing', async () => {
    const res = await request(app)
      .post('/api/check')
      .send({})
      .set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/missing/i);
  });

  it('returns 400 for non-numeric string body', async () => {
    const res = await request(app)
      .post('/api/check')
      .send({ number: 'hello' });
    expect(res.statusCode).toBe(400);
    expect(res.body.isPrime).toBeNull();
  });

  it('accepts number as string "17"', async () => {
    const res = await request(app)
      .post('/api/check')
      .send({ number: '17' });
    expect(res.statusCode).toBe(200);
    expect(res.body.isPrime).toBe(true);
  });
});
