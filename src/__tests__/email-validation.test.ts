import { describe, it, expect } from 'vitest';

// Newsletter email validation logic
const isValidEmail = (email: string) =>
  !!email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

describe('newsletter email validation', () => {
  it('accepts a valid email', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
  });

  it('rejects a non-email string', () => {
    expect(isValidEmail('not-an-email')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(isValidEmail('')).toBe(false);
  });

  it('rejects email without domain', () => {
    expect(isValidEmail('user@')).toBe(false);
  });

  it('rejects email without local part', () => {
    expect(isValidEmail('@domain.com')).toBe(false);
  });

  it('trims whitespace before validating', () => {
    expect(isValidEmail('  user@example.com  ')).toBe(true);
  });
});
