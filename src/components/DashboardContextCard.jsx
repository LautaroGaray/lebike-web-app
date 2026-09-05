import { Box, Typography } from '@mui/material'

export function DashboardContextCard({ icon, label, value, tone, onClick }) {
  const isInteractive = typeof onClick === 'function'

  return (
    <Box
      component={isInteractive ? 'button' : 'div'}
      type={isInteractive ? 'button' : undefined}
      className={`dashboard-context-card ${tone}${isInteractive ? ' is-interactive' : ''}`}
      onClick={onClick}
    >
      <span className="dashboard-context-card-icon" aria-hidden="true">{icon}</span>
      <Box className="dashboard-context-card-content">
        <Typography className="dashboard-context-card-label">{label}</Typography>
        <Typography className="dashboard-context-card-value">{value}</Typography>
      </Box>
    </Box>
  )
}