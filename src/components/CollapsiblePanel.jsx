import { useState } from 'react'
import { Box, Collapse, Typography } from '@mui/material'
import { ExpandLessRounded, ExpandMoreRounded } from '@mui/icons-material'

export function CollapsiblePanel({ title, children, defaultExpanded = true, className = '' }) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  const toggle = () => setExpanded((current) => !current)

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggle()
    }
  }

  return (
    <Box className={`collapsible-panel ${className}`}>
      <Box
        className="collapsible-panel-header"
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        onClick={toggle}
        onKeyDown={handleKeyDown}
      >
        <Typography className="collapsible-panel-title">{title}</Typography>
        {expanded ? <ExpandLessRounded /> : <ExpandMoreRounded />}
      </Box>
      <Collapse in={expanded}>
        <Box className="collapsible-panel-body">{children}</Box>
      </Collapse>
    </Box>
  )
}
