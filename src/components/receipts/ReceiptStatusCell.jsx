import { useState } from 'react'
import {
  Box,
  CircularProgress,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material'
import { ArrowDropDownRounded } from '@mui/icons-material'
import { ReceiptStatusChip } from './ReceiptStatusChip'

export function ReceiptStatusCell({ receipt, allowedStatuses = [], onStatusChange, isUpdating = false }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  if (!allowedStatuses || allowedStatuses.length === 0) {
    return <ReceiptStatusChip statusDescription={receipt.statusDescription} />
  }

  const handleClick = (event) => {
    event.stopPropagation()
    if (isUpdating) return
    setAnchorEl(event.currentTarget)
  }

  const handleClose = (event) => {
    event?.stopPropagation?.()
    setAnchorEl(null)
  }

  const handleSelectStatus = (newStatus) => (event) => {
    event.stopPropagation()
    handleClose(event)
    if (newStatus !== receipt.status) {
      onStatusChange(receipt, newStatus)
    }
  }

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
      <Tooltip title="Hacé clic para cambiar estado">
        <Box
          onClick={handleClick}
          sx={{
            cursor: isUpdating ? 'wait' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            borderRadius: 16,
            transition: 'transform 0.15s ease, filter 0.15s ease',
            '&:hover': {
              filter: 'brightness(1.1)',
              transform: 'scale(1.02)',
            },
          }}
        >
          <ReceiptStatusChip statusDescription={receipt.statusDescription} />
          {isUpdating ? (
            <CircularProgress size={16} sx={{ ml: 0.5 }} />
          ) : (
            <ArrowDropDownRounded fontSize="small" sx={{ ml: -0.5, opacity: 0.8 }} />
          )}
        </Box>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              minWidth: 160,
              mt: 0.5,
              borderRadius: 2,
              boxShadow: 4,
            },
          },
        }}
      >
        {allowedStatuses.map((option) => {
          const isSelected = option.status === receipt.status
          return (
            <MenuItem
              key={option.status}
              selected={isSelected}
              onClick={handleSelectStatus(option.status)}
              sx={{
                textTransform: 'capitalize',
                fontSize: 13,
                fontWeight: isSelected ? 700 : 500,
                py: 0.8,
              }}
            >
              {option.description}
            </MenuItem>
          )
        })}
      </Menu>
    </Box>
  )
}
