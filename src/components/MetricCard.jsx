import { Box, Typography } from '@mui/material'

export function MetricCard({ image, icon, value, amount, label, variant = 'white-navy' }) {
  const formattedAmount = typeof amount === 'number'
    ? new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        maximumFractionDigits: 2,
      }).format(amount)
    : null

  return (
    <Box className={`metric-card ${variant}`}>
      <Box className="metric-card-header">
        {image ? (
          <img src={image} alt="" className="metric-card-img" />
        ) : icon ? (
          <span className="metric-icon-glass" aria-hidden="true">{icon}</span>
        ) : null}
        <Typography className="metric-label">{label}</Typography>
      </Box>
      <Box className="metric-card-body">
        <Typography className="metric-value">{value}</Typography>
        {formattedAmount && (
          <Typography className="metric-amount">{formattedAmount}</Typography>
        )}
      </Box>
    </Box>
  )
}
