export function isRef(ref: any): ref is [string, string] {
  return Array.isArray(ref) && typeof ref[0] === 'string' && typeof ref[1] === 'string'
}
