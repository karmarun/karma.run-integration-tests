export const idRegex = /^[\S]{10,}$/

export function isReference(data: any) {
  return Array.isArray(data)
    && data.length === 2
    && idRegex.test(data[0].toString())
    && idRegex.test(data[1].toString())
}
