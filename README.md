# Prime Number Checker

A pure client-side web application that checks whether an integer is a prime number.  
All computation runs in the browser — no backend or server required.

🔗 **Live demo:** `https://<your-github-username>.github.io/primenumber/`

---

## Features

- Instant prime/not-prime result with clear visual feedback
- Handles edge cases: 0, 1, negative numbers, decimals, non-numeric input
- Quick-example buttons for common values
- Fully responsive — works on mobile and desktop
- Algorithm: trial division up to √n with 6k±1 optimisation — O(√n)

---

## Run Locally

```bash
# Option 1 — just open the file
open public/index.html

# Option 2 — serve with npx
npx serve public
# → http://localhost:3000
```

---

## Deploy to GitHub Pages

### Step 1 — Create GitHub repository

1. Go to [github.com/new](https://github.com/new)
2. Name: `primenumber`
3. Set to **Public**
4. Click **Create repository**

### Step 2 — Push code

```bash
git remote add origin https://github.com/<YOUR_USERNAME>/primenumber.git
git branch -M main
git push -u origin main
```

### Step 3 — Enable GitHub Pages

1. Open your repo on GitHub
2. Go to **Settings → Pages**
3. Source: **Deploy from a branch**
4. Branch: `main` / folder: `/ (root)`  
   *(GitHub Pages will serve from root; we need to point it at `/public`)*

> **Note:** Since our HTML lives in `/public`, use the steps below instead:

### Step 3 (alternative) — Use `gh-pages` branch

```bash
# Push only the public/ folder as the root of gh-pages branch
git subtree push --prefix public origin gh-pages
```

Then in **Settings → Pages**, set branch to `gh-pages` / `/ (root)`.

Your site will be live at:
```
https://<YOUR_USERNAME>.github.io/primenumber/
```

---

## Project Structure

```
primenumber/
├── public/
│   ├── index.html   ← entry point
│   ├── style.css    ← dark-mode responsive styles
│   └── script.js    ← prime algorithm + UI logic
├── package.json
└── README.md
```

---

## Algorithm

```js
function isPrime(n) {
  if (n < 2) return false;
  if (n === 2 || n === 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}
```

Time complexity: **O(√n)** — fast for all safe integers up to 9,007,199,254,740,991.
