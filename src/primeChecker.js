/**
 * Prime Number Checker
 * Uses trial division up to sqrt(n) — O(sqrt(n)) time complexity.
 */

/**
 * Validates and parses the input, returning either a safe integer or an error.
 * @param {*} input
 * @returns {{ value: number } | { error: string }}
 */
function parseInput(input) {
  const str = String(input).trim();

  if (str === '' || str === null) {
    return { error: 'Input must not be empty.' };
  }

  // Reject decimals explicitly
  if (str.includes('.') || str.includes(',')) {
    return { error: 'Input must be a whole integer, not a decimal.' };
  }

  const num = Number(str);

  if (isNaN(num)) {
    return { error: 'Input is not a valid number.' };
  }

  if (!Number.isInteger(num)) {
    return { error: 'Input must be a whole integer.' };
  }

  if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
    return { error: 'Number is too large to process safely. Please enter a number within ±9,007,199,254,740,991.' };
  }

  return { value: num };
}

/**
 * Core primality check. Assumes n is a safe integer.
 * @param {number} n
 * @returns {boolean}
 */
function isPrime(n) {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n === 3) return true;
  if (n % 2 === 0) return false;
  if (n % 3 === 0) return false;

  // Check divisors of form 6k ± 1 up to sqrt(n)
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }

  return true;
}

/**
 * Full check entry point: validates input then runs primality test.
 * @param {*} input - raw user input (string or number)
 * @returns {{
 *   isPrime: boolean | null,
 *   number: number | null,
 *   error: string | null,
 *   message: string
 * }}
 */
function checkPrime(input) {
  const parsed = parseInput(input);

  if (parsed.error) {
    return {
      isPrime: null,
      number: null,
      error: parsed.error,
      message: parsed.error,
    };
  }

  const n = parsed.value;
  const result = isPrime(n);

  let message;
  if (result) {
    message = `${n} is a prime number.`;
  } else if (n < 2) {
    message = `${n} is not a prime number (prime numbers must be greater than 1).`;
  } else {
    message = `${n} is not a prime number.`;
  }

  return {
    isPrime: result,
    number: n,
    error: null,
    message,
  };
}

module.exports = { checkPrime, isPrime, parseInput };
