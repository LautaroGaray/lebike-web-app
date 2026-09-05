import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { AppDialog } from '../AppDialog'
import { ReceiptStatusChip } from './ReceiptStatusChip'
import { formatReceiptDate } from './receiptUtils'

export function ReceiptHistoryDialog({ open, onClose, receiptKey, entries, isLoading }) {
  return (
    <AppDialog open={open} onClose={onClose} title={`Historial de estados · ${receiptKey}`}>
      {isLoading && (
        <Typography color="text.secondary">Cargando historial...</Typography>
      )}
      {!isLoading && !entries.length && (
        <Typography color="text.secondary">Todavía no hay cambios de estado registrados.</Typography>
      )}
      {!isLoading && Boolean(entries.length) && (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Estado anterior</TableCell>
              <TableCell>Estado nuevo</TableCell>
              <TableCell>Usuario</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{formatReceiptDate(entry.changedAt)}</TableCell>
                <TableCell>
                  {entry.previousStatusDescription ? (
                    <ReceiptStatusChip statusDescription={entry.previousStatusDescription} />
                  ) : '—'}
                </TableCell>
                <TableCell>
                  <ReceiptStatusChip statusDescription={entry.newStatusDescription} />
                </TableCell>
                <TableCell>{entry.userEmail}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </AppDialog>
  )
}
