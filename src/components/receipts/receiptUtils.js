export function formatReceiptDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })
}

export function isNewStatus(statusDescription) {
  return (statusDescription ?? '').toLowerCase() === 'new'
}

export function isSentStatus(statusDescription) {
  const normalized = (statusDescription ?? '').toLowerCase()
  return normalized.includes('sent') || normalized.includes('enviad')
}

export function isReceivedStatus(statusDescription) {
  const normalized = (statusDescription ?? '').toLowerCase()
  return normalized.includes('received') || normalized.includes('recibid')
}

export function sumReceiptPrices(receipts) {
  return receipts.reduce((total, receipt) => total + Number(receipt.price ?? 0), 0)
}

export function formatReceiptAmount(value) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 2,
  }).format(value ?? 0)
}

function getSortValue(receipt, sortBy) {
  if (sortBy === 'creationDate') return new Date(receipt.creationDate).getTime()
  if (sortBy === 'status') return (receipt.statusDescription ?? '').toLowerCase()
  if (sortBy === 'username') return (receipt.username || receipt.userEmail || '').toLowerCase()
  return receipt[sortBy]
}

export function sortReceipts(receipts, sortBy, sortDirection) {
  const direction = sortDirection === 'desc' ? -1 : 1
  return [...receipts].sort((a, b) => {
    const valueA = getSortValue(a, sortBy)
    const valueB = getSortValue(b, sortBy)
    if (valueA < valueB) return -1 * direction
    if (valueA > valueB) return 1 * direction
    return 0
  })
}
