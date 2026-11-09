export function normalizeProductImage(image) {
  if (typeof image !== 'string') return ''

  let value = image.trim()
  if (value.endsWith(',')) value = value.slice(0, -1).trim()
  if (
    (value.startsWith("'") && value.endsWith("'")) ||
    (value.startsWith('"') && value.endsWith('"'))
  ) {
    value = value.slice(1, -1).trim()
  }
  return value
}

export function resolveProductImage(image) {
  const value = normalizeProductImage(image)
  if (!value) return ''

  if (/^(https?:)?\/\//i.test(value) || value.startsWith('/')) return value

  const relativePath = value.replace(/^(?:\.\/)?images\//i, '')
  return `/images/${relativePath}`
}
