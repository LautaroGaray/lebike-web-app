import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'

export function ErrorDialog({ message, onClose }) {
  return <Dialog open={Boolean(message)} onClose={onClose} className="error-dialog"><DialogTitle>Algo salió mal</DialogTitle><DialogContent><Typography color="text.secondary">{message}</Typography></DialogContent><DialogActions><Button onClick={onClose} variant="contained">Entendido</Button></DialogActions></Dialog>
}
