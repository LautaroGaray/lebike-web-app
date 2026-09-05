import { useState } from 'react'
import { Box, Button, Divider, List, ListItem, ListItemText, Stack, Typography } from '@mui/material'
import { HistoryRounded } from '@mui/icons-material'
import { AppDialog } from '../AppDialog'
import { ReceiptStatusChip } from './ReceiptStatusChip'
import { ReceiptHistoryDialog } from './ReceiptHistoryDialog'
import { receiptsService } from '../../service'
import { formatReceiptAmount, formatReceiptDate } from './receiptUtils'

export function ReceiptDetailDialog({ open, onClose, receipt, getWarehouseLabel, isOwner }) {
  const [history, setHistory] = useState({ open: false, isLoading: false, entries: [] })

  if (!receipt) return null

  const handleOpenHistory = async () => {
    setHistory({ open: true, isLoading: true, entries: [] })
    try {
      const response = await receiptsService.history({ receiptId: receipt.id })
      setHistory({ open: true, isLoading: false, entries: response.data ?? [] })
    } catch {
      setHistory({ open: true, isLoading: false, entries: [] })
    }
  }

  return (
    <>
      <AppDialog
        open={open}
        onClose={onClose}
        title={`Recepción ${receipt.receiptKey}`}
        actions={
          <>
            {isOwner && (
              <Button startIcon={<HistoryRounded />} onClick={handleOpenHistory}>
                Ver historial
              </Button>
            )}
            <Button onClick={onClose} variant="contained">Cerrar</Button>
          </>
        }
      >
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <ReceiptStatusChip statusDescription={receipt.statusDescription} />
            <Typography variant="body2" color="text.secondary">
              Creada el {formatReceiptDate(receipt.creationDate)}
            </Typography>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
            <Box>
              <Typography variant="caption" color="text.secondary">Origen</Typography>
              <Typography fontWeight={700}>{getWarehouseLabel(receipt.origin)}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Destino</Typography>
              <Typography fontWeight={700}>{getWarehouseLabel(receipt.destiny)}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Usuario</Typography>
              <Typography fontWeight={700}>{receipt.username || receipt.userEmail}</Typography>
            </Box>
          </Stack>
          <Box>
            <Typography variant="caption" color="text.secondary">Descripción</Typography>
            <Typography>{receipt.description || 'Sin descripción'}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Importe total</Typography>
            <Typography fontWeight={700}>{formatReceiptAmount(receipt.totalAmount)}</Typography>
          </Box>
          <Divider />
          <Box>
            <Typography variant="caption" color="text.secondary">Artículos</Typography>
            <List dense disablePadding>
              {(receipt.details ?? []).map((detail) => (
                <ListItem key={detail.id} disableGutters>
                    <ListItemText
                      primary={detail.articleName}
                      secondary={`${detail.articleSku} · ${detail.supplier || 'Proveedor no informado'} · ${formatReceiptAmount(detail.salePrice)}`}
                    />
                </ListItem>
              ))}
              {!(receipt.details ?? []).length && (
                <Typography color="text.secondary">Esta recepción no tiene artículos cargados.</Typography>
              )}
            </List>
          </Box>
        </Stack>
      </AppDialog>
      <ReceiptHistoryDialog
        open={history.open}
        onClose={() => setHistory((current) => ({ ...current, open: false }))}
        receiptKey={receipt.receiptKey}
        entries={history.entries}
        isLoading={history.isLoading}
      />
    </>
  )
}
