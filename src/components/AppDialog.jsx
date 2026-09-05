import { Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, useTheme } from '@mui/material'
import { CloseRounded } from '@mui/icons-material'

// Every modal in the app must go through this component: themed backdrop veil, opaque content, and a close button.
export function AppDialog({ open, onClose, title, children, actions, onSubmit, maxWidth = 'sm', fullWidth = true }) {
  const theme = useTheme()
  const uiMode = theme.uiMode ?? 'light'

  const body = (
    <>
      <DialogContent className="app-dialog-content">{children}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </>
  )

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      className="app-dialog"
      slotProps={{
        backdrop: { className: `app-dialog-backdrop app-dialog-backdrop-${uiMode}` },
        paper: { className: `app-dialog-paper app-dialog-paper-${uiMode}` },
      }}
    >
      <DialogTitle className="app-dialog-title">
        {title}
        <IconButton className="app-dialog-close" onClick={onClose} aria-label="Cerrar">
          <CloseRounded />
        </IconButton>
      </DialogTitle>
      {onSubmit ? <Box component="form" onSubmit={onSubmit}>{body}</Box> : body}
    </Dialog>
  )
}
