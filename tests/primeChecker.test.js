const { checkPrime, isPrime, parseInput } = require('../src/primeChecker');

// ── isPrime core ──────────────────────────────────────────────────────────────
describe('isPrime()', () => {
  test('returns false for numbers < 2', () => {
    expect(isPrime(0)).toBe(false);
    expect(isPrime(1)).toBe(false);
    expect(isPrime(-1)).toBe(false);
    expect(isPrime(-17)).toBe(false);
  });

  test('returns true for 2 (smallest prime)', () => {
    expect(isPrime(2)).toBe(true);
  });

  test('returns true for 3', () => {
    expect(isPrime(3)).toBe(true);
  });

  test('returns false for 4', () => {
    expect(isPrime(4)).toBe(false);
  });

  test('returns true for known small primes', () => {
    [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47].forEach(p => {
      expect(isPrime(p)).toBe(true);
    });
  });

  test('returns false for known composites', () => {
    [4, 6, 8, 9, 10, 12, 15, 16, 18, 20, 25, 100].forEach(n => {
      expect(isPrime(n)).toBe(false);
    });
  });

  test('handles large prime (1,000,003)', () => {
    expect(isPrime(1000003)).toBe(true);
  });

  test('handles large composite (1,000,000)', () => {
    expect(isPrime(1000000)).toBe(false);
  });

  test('returns false for even numbers > 2', () => {
    [4, 100, 9998, 1000000].forEach(n => {
      expect(isPrime(n)).toBe(false);
    });
  });
});

// ── parseInput ─────────────────────────────────────────────────────────────────
describe('parseInput()', () => {
  test('parses valid integer string', () => {
    expect(parseInput('17')).toEqual({ value: 17 });
    expect(parseInput('0')).toEqual({ value: 0 });
    expect(parseInput('-5')).toEqual({ value: -5 });
  });

  test('returns error for empty string', () => {
    expect(parseInput('')).toHaveProperty('error');
    expect(parseInput('   ')).toHaveProperty('error');
  });

  test('returns error for decimal input', () => {
    expect(parseInput('3.14')).toHaveProperty('error');
    expect(parseInput('2.0')).toHaveProperty('error');
  });

  test('returns error for non-numeric strings', () => {
    expect(parseInput('abc')).toHaveProperty('error');
    expect(parseInput('12abc')).toHaveProperty('error');
    expect(parseInput('hello')).toHaveProperty('error');
  });
});

// ── checkPrime() full integration ──────────────────────────────────────────────
describe('checkPrime()', () => {
  test('correctly identifies prime number', () => {
    const res = checkPrime(17);
    expect(res.isPrime).toBe(true);
    expect(res.number).toBe(17);
    expect(res.error).toBeNull();
    expect(res.message).toMatch(/prime/i);
  });

  test('correctly identifies non-prime number', () => {
    const res = checkPrime(4);
    expect(res.isPrime).toBe(false);
    expect(res.number).toBe(4);
    expect(res.error).toBeNull();
    expect(res.message).toMatch(/not a prime/i);
  });

  test('handles string input "97"', () => {
    const res = checkPrime('97');
    expect(res.isPrime).toBe(true);
  });

  test('returns error for non-integer string', () => {
    const res = checkPrime('abc');
    expect(res.isPrime).toBeNull();
    expect(res.error).not.toBeNull();
  });

  test('returns error for decimal string', () => {
    const res = checkPrime('3.14');
    expect(res.isPrime).toBeNull();
    expect(res.error).not.toBeNull();
  });

  test('returns error for empty string', () => {
    const res = checkPrime('');
    expect(res.isPrime).toBeNull();
    expect(res.error).not.toBeNull();
  });

  test('handles 0 as non-prime', () => {
    const res = checkPrime(0);
    expect(res.isPrime).toBe(false);
    expect(res.number).toBe(0);
  });

  test('handles 1 as non-prime', () => {
    const res = checkPrime(1);
    expect(res.isPrime).toBe(false);
  });

  test('handles negative numbers as non-prime', () => {
    const res = checkPrime(-7);
    expect(res.isPrime).toBe(false);
    expect(res.number).toBe(-7);
  });

  test('handles 2 as prime', () => {
    expect(checkPrime(2).isPrime).toBe(true);
  });

  test('handles large prime (7919)', () => {
    expect(checkPrime(7919).isPrime).toBe(true);
  });
});
