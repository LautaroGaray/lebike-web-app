import { Button, Typography } from '@mui/material'
import { AppDialog } from './AppDialog'

export function ConfirmDialog({ open, title, message, onCancel, onConfirm }) {
  return (
    <AppDialog
      open={open}
      onClose={onCancel}
      title={title}
      maxWidth="xs"
      actions={
        <>
          <Button onClick={onCancel}>Cancelar</Button>
          <Button onClick={onConfirm} variant="contained" color="error">
            Eliminar
          </Button>
        </>
      }
    >
      <Typography color="text.secondary">{message}</Typography>
    </AppDialog>
  )
}
