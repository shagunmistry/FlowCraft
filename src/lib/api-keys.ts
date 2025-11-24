import crypto from 'crypto';

/**
 * Generates a secure random API key with the format: fc_live_xxxxx...
 * @returns A 48-character API key string
 */
export function generateApiKey(): string {
  const prefix = 'fc_live_';
  const randomBytes = crypto.randomBytes(32);
  const key = randomBytes.toString('base64url'); // URL-safe base64
  return `${prefix}${key}`;
}

/**
 * Hashes an API key using SHA-256
 * @param key - The API key to hash
 * @returns The hashed key as a hex string
 */
export function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}

/**
 * Creates a preview of an API key (first 12 chars + last 4 chars)
 * @param key - The full API key
 * @returns A preview string like "fc_live_abcd...xyz1"
 */
export function createKeyPreview(key: string): string {
  if (key.length < 16) return key;
  const start = key.substring(0, 12);
  const end = key.substring(key.length - 4);
  return `${start}...${end}`;
}

/**
 * Validates API key format
 * @param key - The API key to validate
 * @returns True if the key format is valid
 */
export function isValidApiKeyFormat(key: string): boolean {
  return key.startsWith('fc_live_') && key.length > 20;
}
