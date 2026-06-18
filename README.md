# Prime Number Checker

A lightweight web application + REST API that checks whether an integer is a prime number.

## Features

- **Web UI** — clean, responsive interface for interactive use
- **REST API** — two endpoints for programmatic access
- **Input validation** — handles invalid input, decimals, negative numbers gracefully
- **Unit & integration tests** — Jest + Supertest, 80%+ coverage
- **Health endpoint** — `/health` for uptime monitoring

---

## API Reference

### GET `/api/check/:number`

```
GET /api/check/17
```

**Response 200 (prime)**
```json
{
  "isPrime": true,
  "number": 17,
  "error": null,
  "message": "17 is a prime number."
}
```

**Response 200 (not prime)**
```json
{
  "isPrime": false,
  "number": 4,
  "error": null,
  "message": "4 is not a prime number."
}
```

**Response 400 (invalid input)**
```json
{
  "isPrime": null,
  "number": null,
  "error": "Input is not a valid number.",
  "message": "Input is not a valid number."
}
```

---

### POST `/api/check`

```
POST /api/check
Content-Type: application/json

{ "number": 97 }
```

Same response shape as GET above.

---

### GET `/health`

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.45
}
```

---

## Local Development

### Prerequisites
- Node.js >= 18

### Setup

```bash
npm install
npm start          # production mode  →  http://localhost:3000
npm run dev        # dev mode (auto-restart)
npm test           # run all tests with coverage
```

---

## AWS Deployment (EC2 — Amazon Linux 2023)

> Estimated time: ~15 minutes

### Step 1 — Launch EC2 Instance

1. Go to **AWS Console → EC2 → Launch Instance**
2. Choose **Amazon Linux 2023 AMI** (free tier eligible)
3. Instance type: **t2.micro** (free tier)
4. **Key pair**: create or select an existing `.pem` key
5. **Security Group** — add these inbound rules:

| Type  | Protocol | Port | Source    |
|-------|----------|------|-----------|
| SSH   | TCP      | 22   | My IP     |
| HTTP  | TCP      | 80   | 0.0.0.0/0 |
| Custom TCP | TCP | 3000 | 0.0.0.0/0 |

6. Click **Launch Instance**

---

### Step 2 — Connect to EC2

```bash
# Replace <YOUR_KEY.pem> and <EC2_PUBLIC_IP> with your values
chmod 400 YOUR_KEY.pem
ssh -i YOUR_KEY.pem ec2-user@<EC2_PUBLIC_IP>
```

---

### Step 3 — Install Node.js & PM2

```bash
# Update system packages
sudo dnf update -y

# Install Node.js 20
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs

# Verify
node -v    # should print v20.x.x
npm -v

# Install PM2 (process manager — keeps app running after logout)
sudo npm install -g pm2
```

---

### Step 4 — Upload Project

**Option A: via Git (recommended)**
```bash
sudo dnf install -y git
git clone https://github.com/YOUR_USERNAME/primenumber.git
cd primenumber
```

**Option B: via SCP from your local machine**
```bash
# Run on your LOCAL machine (not EC2)
scp -i YOUR_KEY.pem -r ./primenumber ec2-user@<EC2_PUBLIC_IP>:~/primenumber
```

---

### Step 5 — Install Dependencies & Start

```bash
cd ~/primenumber
npm install --omit=dev

# Start with PM2
pm2 start src/app.js --name prime-checker

# Auto-restart on server reboot
pm2 startup
pm2 save
```

The app runs on port **3000**.  
Access it at: `http://<EC2_PUBLIC_IP>:3000`

---

### Step 6 — (Optional) Run on Port 80 via iptables

```bash
# Forward port 80 → 3000 (no need for root to run Node)
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 3000
```

Access at: `http://<EC2_PUBLIC_IP>` (no port needed)

---

### Useful PM2 Commands

```bash
pm2 status          # check running processes
pm2 logs            # view live logs
pm2 restart prime-checker
pm2 stop prime-checker
```

---

## Quick API Test (curl)

```bash
# GET endpoint
curl http://<EC2_PUBLIC_IP>:3000/api/check/17

# POST endpoint
curl -X POST http://<EC2_PUBLIC_IP>:3000/api/check \
  -H "Content-Type: application/json" \
  -d '{"number": 97}'

# Health check
curl http://<EC2_PUBLIC_IP>:3000/health
```

---

## Project Structure

```
primenumber/
├── public/
│   ├── index.html       # Web UI
│   ├── style.css        # Styles
│   └── script.js        # Frontend logic
├── src/
│   ├── app.js           # Express server + routes
│   └── primeChecker.js  # Prime algorithm + validation
├── tests/
│   ├── primeChecker.test.js  # Unit tests
│   └── api.test.js           # API integration tests
├── jest.config.js
├── package.json
└── README.md
```

---

## Algorithm

Uses **trial division up to √n** with 6k±1 optimization:

- Time complexity: `O(√n)`
- Handles: all safe integers (`Number.MAX_SAFE_INTEGER`)
- Correctly handles: `0`, `1`, `2`, negatives, decimals (rejected), strings (rejected)
