// ── Prime logic (runs entirely in the browser) ────────────────────────────────

function parseInput(raw) {
  const str = String(raw).trim();
  if (str === '') return { error: 'Please enter a number.' };
  if (str.includes('.') || str.includes(','))
    return { error: 'Please enter a whole integer, not a decimal.' };

  const num = Number(str);
  if (isNaN(num)) return { error: `"${str}" is not a valid number.` };
  if (!Number.isInteger(num)) return { error: 'Please enter a whole integer.' };
  if (Math.abs(num) > Number.MAX_SAFE_INTEGER)
    return { error: 'Number is too large. Please enter a value within ±9,007,199,254,740,991.' };

  return { value: num };
}

function isPrime(n) {
  if (n < 2) return false;
  if (n === 2 || n === 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

function checkPrime(raw) {
  const parsed = parseInput(raw);
  if (parsed.error) return { isPrime: null, number: null, error: parsed.error };
  const n = parsed.value;
  return { isPrime: isPrime(n), number: n, error: null };
}

// ── UI ────────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const form      = document.getElementById('primeForm');
  const input     = document.getElementById('numberInput');
  const resultBox = document.getElementById('result');
  const checkBtn  = document.getElementById('checkBtn');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    run(input.value);
  });

  input.addEventListener('input', () => input.classList.remove('error'));

  function run(value) {
    const { isPrime: prime, number, error } = checkPrime(value);

    resultBox.classList.remove('hidden', 'is-prime', 'not-prime', 'is-error');

    if (error) {
      input.classList.add('error');
      resultBox.classList.add('is-error');
      resultBox.innerHTML = `
        <span class="result-icon">⚠️</span>
        <div class="result-body"><div class="result-verdict">${esc(error)}</div></div>`;
      return;
    }

    input.classList.remove('error');

    if (prime) {
      resultBox.classList.add('is-prime');
      resultBox.innerHTML = `
        <span class="result-icon">✓</span>
        <div class="result-body">
          <div class="result-number">${esc(String(number))}</div>
          <div class="result-verdict">is a <strong>prime number</strong> 🎉</div>
        </div>`;
    } else {
      resultBox.classList.add('not-prime');
      resultBox.innerHTML = `
        <span class="result-icon">✗</span>
        <div class="result-body">
          <div class="result-number">${esc(String(number))}</div>
          <div class="result-verdict">is <strong>not</strong> a prime number</div>
        </div>`;
    }
  }

  function esc(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
});

// ── Quick examples (called from HTML) ─────────────────────────────────────────
function tryExample(n) {
  const input = document.getElementById('numberInput');
  input.value = String(n);
  input.classList.remove('error');
  document.getElementById('primeForm').dispatchEvent(new Event('submit'));
}
