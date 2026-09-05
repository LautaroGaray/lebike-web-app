import { Box, Typography } from '@mui/material'

// Places the filter's name above its control instead of relying on MUI's floating inside-label pattern.
export function FilterField({ label, className, children }) {
  return (
    <Box className={`filter-field ${className ?? ''}`}>
      <Typography className="filter-field-label">{label}</Typography>
      {children}
    </Box>
  )
}
