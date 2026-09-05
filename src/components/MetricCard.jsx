import { Box, Typography } from '@mui/material'

// icon is a small colorful emoji glyph instead of a flat MUI icon.
export function MetricCard({ icon, value, amount, label, variant = 'navy' }) {
  const formattedAmount = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 2,
  }).format(amount)

  return (
    <Box className={`metric-card ${variant}`}>
      <span className="metric-icon-glass" aria-hidden="true">{icon}</span>
      <Typography className="metric-value">{value}</Typography>
      <Typography className="metric-amount">{formattedAmount}</Typography>
      <Typography className="metric-label">{label}</Typography>
    </Box>
  )
}
