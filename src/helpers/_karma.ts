export const recordIDRegex = /^[\S]{10,}$/
export function isReference(data: any) {
  return Array.isArray(data)
    && data.length === 2
    && recordIDRegex.test(data[0].toString())
    && recordIDRegex.test(data[1].toString())
}
