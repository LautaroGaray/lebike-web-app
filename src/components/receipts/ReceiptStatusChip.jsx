import { Chip } from '@mui/material'

const statusColorByKeyword = [
  { keyword: 'new', color: 'info' },
  { keyword: 'preparation', color: 'warning' },
  { keyword: 'ready', color: 'info' },
  { keyword: 'transit', color: 'warning' },
  { keyword: 'dispatch', color: 'warning' },
  { keyword: 'partial', color: 'secondary' },
  { keyword: 'complet', color: 'success' },
  { keyword: 'received', color: 'success' },
  { keyword: 'cancel', color: 'error' },
  { keyword: 'reject', color: 'error' },
  { keyword: 'deleted', color: 'error' },
]

function resolveStatusColor(statusDescription) {
  const normalized = (statusDescription ?? '').toLowerCase()
  const match = statusColorByKeyword.find((entry) => normalized.includes(entry.keyword))
  return match?.color ?? 'default'
}

export function ReceiptStatusChip({ statusDescription }) {
  return (
    <Chip
      size="small"
      className="receipt-status-chip"
      color={resolveStatusColor(statusDescription)}
      label={statusDescription || 'Sin estado'}
    />
  )
}
