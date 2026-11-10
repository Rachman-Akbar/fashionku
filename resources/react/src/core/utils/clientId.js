let sequence = 0;

export function createClientId(prefix = "item") {
  sequence += 1;
  return `${prefix}-${Date.now().toString(36)}-${sequence.toString(36)}`;
}
