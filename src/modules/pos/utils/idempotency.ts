export function generateIdempotencyKey(prefix = "pos-sale") {
  const cryptoValue = globalThis.crypto?.randomUUID?.()
  return cryptoValue ?? `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`
}