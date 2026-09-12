export function formatReceiptDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })
}

export function isNewStatus(statusDescription) {
  return (statusDescription ?? '').toLowerCase() === 'new'
}

export function isSentStatus(statusDescription) {
  const normalized = (statusDescription ?? '').toLowerCase()
  return (
    normalized.includes('sent') ||
    normalized.includes('enviad') ||
    normalized.includes('dispatch') ||
    normalized.includes('preparation') ||
    normalized.includes('ready')
  )
}

export function isReceivedStatus(statusDescription) {
  const normalized = (statusDescription ?? '').toLowerCase()
  return normalized.includes('received') || normalized.includes('recibid')
}

export function isDispatchedOrPartial(status, statusDescription) {
  if (status === 95 || status === 97) return true
  const normalized = (statusDescription ?? '').toLowerCase()
  return normalized.includes('dispatch') || normalized.includes('partial')
}

export function getAllowedStatusesForReceipt(receipt, user, allStatuses = [], hasStatusManagerWrite = false) {
  if (!hasStatusManagerWrite || !receipt) return []

  const isUserRole = user?.roleName === 'USER'

  if (isUserRole) {
    // Role USER: only allowed to change status of receipts currently in dispatched (95) or partially received (97)
    if (!isDispatchedOrPartial(receipt.status, receipt.statusDescription)) {
      return []
    }
    // Target statuses available to USER: partially received (97) and received (110)
    return allStatuses.filter((s) => s.status === 97 || s.status === 110)
  }

  // Non-USER roles (ADMIN / OWNER / managers with WRITE): can change to any active status except deleted (0)
  return allStatuses.filter((s) => s.status !== 0)
}

export function sumReceiptPrices(receipts) {
  return receipts.reduce((total, receipt) => (
    total + Number(receipt.totalAmount ?? receipt.amount ?? receipt.price ?? 0)
  ), 0)
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
