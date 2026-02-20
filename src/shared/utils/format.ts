export function formatNumber(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value
  
  if (isNaN(num)) return '0'

  if (num >= 1_000_000_000_000) {
    const value = (num / 1_000_000_000_000).toFixed(2).replace(/\.00$/, '')
    return parseFloat(value).toLocaleString(undefined, { maximumFractionDigits: 2 }) + '조'
  }
  if (num >= 100_000_000) {
    const value = (num / 100_000_000).toFixed(2).replace(/\.00$/, '')
    return parseFloat(value).toLocaleString(undefined, { maximumFractionDigits: 2 }) + '억'
  }
  if (num >= 10_000) {
    const value = (num / 10_000).toFixed(2).replace(/\.00$/, '')
    return parseFloat(value).toLocaleString(undefined, { maximumFractionDigits: 2 }) + '만'
  }
  
    return num.toLocaleString()
  
  }
  
  
  
export function formatFullNumber(value: number | string | undefined | null): string {
  if (value === undefined || value === null || value === '') return '0'
  
  const str = value.toString().split('.')[0]
  const cleanStr = str.replace(/[^0-9-]/g, '').replace(/(?!^)-/g, '')
  
  try {
    return BigInt(cleanStr).toLocaleString()
  } catch (e) {
    return str
  }
}
  
  