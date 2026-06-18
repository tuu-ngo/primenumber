document.addEventListener('DOMContentLoaded', () => {
  const form        = document.getElementById('primeForm');
  const input       = document.getElementById('numberInput');
  const resultBox   = document.getElementById('result');
  const checkBtn    = document.getElementById('checkBtn');
  const apiBaseSpan = document.getElementById('apiBaseUrl');

  // Populate API base URL in code block
  if (apiBaseSpan) {
    apiBaseSpan.textContent = window.location.origin;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const raw = input.value.trim();
    if (!raw) {
      showError('Please enter a number.');
      return;
    }
    await runCheck(raw);
  });

  // Allow pressing Enter anywhere on the page to resubmit
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      form.dispatchEvent(new Event('submit'));
    }
  });

  // Clear error styling on new input
  input.addEventListener('input', () => {
    input.classList.remove('error');
  });

  async function runCheck(value) {
    setLoading(true);

    try {
      const res  = await fetch(`/api/check/${encodeURIComponent(value)}`);
      const data = await res.json();
      renderResult(data);
    } catch {
      showError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function renderResult(data) {
    resultBox.classList.remove('hidden', 'is-prime', 'not-prime', 'is-error');

    if (data.error) {
      input.classList.add('error');
      resultBox.classList.add('is-error');
      resultBox.innerHTML = `
        <span class="result-icon">⚠️</span>
        <div class="result-body">
          <div class="result-verdict">${escapeHtml(data.error)}</div>
        </div>`;
      return;
    }

    input.classList.remove('error');

    if (data.isPrime) {
      resultBox.classList.add('is-prime');
      resultBox.innerHTML = `
        <span class="result-icon">✓</span>
        <div class="result-body">
          <div class="result-number">${escapeHtml(String(data.number))}</div>
          <div class="result-verdict">is a <strong>prime number</strong> 🎉</div>
        </div>`;
    } else {
      resultBox.classList.add('not-prime');
      resultBox.innerHTML = `
        <span class="result-icon">✗</span>
        <div class="result-body">
          <div class="result-number">${escapeHtml(String(data.number))}</div>
          <div class="result-verdict">is <strong>not</strong> a prime number</div>
        </div>`;
    }
  }

  function showError(msg) {
    input.classList.add('error');
    resultBox.classList.remove('hidden', 'is-prime', 'not-prime');
    resultBox.classList.add('is-error');
    resultBox.innerHTML = `
      <span class="result-icon">⚠️</span>
      <div class="result-body">
        <div class="result-verdict">${escapeHtml(msg)}</div>
      </div>`;
  }

  function setLoading(isLoading) {
    checkBtn.disabled = isLoading;
    checkBtn.querySelector('.btn-text').textContent = isLoading ? 'Checking…' : 'Check';
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
});

// ── Quick-example shortcut ────────────────────────────────────────────────────
function tryExample(n) {
  const input = document.getElementById('numberInput');
  input.value = String(n);
  input.classList.remove('error');
  document.getElementById('primeForm').dispatchEvent(new Event('submit'));
}

// ── Copy to clipboard ─────────────────────────────────────────────────────────
function copyToClipboard(btn, text) {
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = 'Copy URL';
      btn.classList.remove('copied');
    }, 2000);
  }).catch(() => {
    btn.textContent = 'Failed';
    setTimeout(() => { btn.textContent = 'Copy URL'; }, 1500);
  });
}
