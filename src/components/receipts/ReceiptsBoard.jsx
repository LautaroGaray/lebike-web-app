import { useEffect, useMemo, useState } from 'react'
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  IconButton,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { AddRounded, ClearRounded, DeleteRounded, EditRounded, VisibilityRounded } from '@mui/icons-material'
import { receiptsService, warehousesService } from '../../service'
import { CollapsiblePanel } from '../CollapsiblePanel'
import { DataTable } from '../DataTable'
import { MetricCard } from '../MetricCard'
import { FilterField } from '../FilterField'
import { ReceiptStatusChip } from './ReceiptStatusChip'
import { ReceiptDetailDialog } from './ReceiptDetailDialog'
import { ReceiptFormDialog } from './ReceiptFormDialog'
import { ConfirmDialog } from '../ConfirmDialog'
import {
  formatReceiptAmount,
  formatReceiptDate,
  isNewStatus,
  isReceivedStatus,
  isSentStatus,
  sumReceiptPrices,
  sortReceipts,
} from './receiptUtils'

const ROWS_PER_PAGE = 10

function nextLocalId(receipts) {
  return receipts.reduce((max, receipt) => Math.max(max, receipt.id ?? 0), 0) + 1
}

function getUserKey(receipt) {
  return receipt.userId ?? receipt.userEmail
}

export function ReceiptsBoard({ user, canWrite, isOwner, onError }) {
  const [warehouses, setWarehouses] = useState([])
  const [receipts, setReceipts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCodes, setSelectedCodes] = useState([])
  const [selectedStatuses, setSelectedStatuses] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [sort, setSort] = useState({ by: 'creationDate', direction: 'desc' })
  const [page, setPage] = useState(0)
  const [detailReceipt, setDetailReceipt] = useState(null)
  const [formDialog, setFormDialog] = useState({ open: false, mode: 'create', receipt: null })
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let active = true

    async function load() {
      setIsLoading(true)
      try {
        const [warehousesResponse, receiptsResponse] = await Promise.all([
          warehousesService.findAll(),
          receiptsService.findAll({ page: 1, size: ROWS_PER_PAGE, criteria: {} }),
        ])
        if (!active) return
        setWarehouses(warehousesResponse.data ?? [])
        setReceipts(receiptsResponse.data ?? [])
      } catch (loadError) {
        if (active) onError(loadError.message || 'No se pudieron cargar las recepciones')
      } finally {
        if (active) setIsLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [onError])

  const getWarehouseLabel = (code) => {
    const warehouse = warehouses.find((item) => item.code === code)
    return warehouse ? warehouse.name : '—'
  }

  const warehouseFilteredReceipts = useMemo(() => {
    if (!selectedCodes.length) return receipts
    return receipts.filter((receipt) => (
      selectedCodes.includes(receipt.origin) || selectedCodes.includes(receipt.destiny)
    ))
  }, [receipts, selectedCodes])

  const filteredReceipts = useMemo(() => {
    return warehouseFilteredReceipts.filter((receipt) => {
      if (selectedStatuses.length && !selectedStatuses.includes(receipt.status)) return false
      if (selectedUsers.length && !selectedUsers.includes(getUserKey(receipt))) return false
      const creationTime = new Date(receipt.creationDate).getTime()
      if (dateFrom && creationTime < new Date(`${dateFrom}T00:00:00`).getTime()) return false
      if (dateTo && creationTime > new Date(`${dateTo}T23:59:59`).getTime()) return false
      return true
    })
  }, [warehouseFilteredReceipts, selectedStatuses, selectedUsers, dateFrom, dateTo])

  const sortedReceipts = useMemo(() => (
    sortReceipts(filteredReceipts, sort.by, sort.direction)
  ), [filteredReceipts, sort])

  const pagedReceipts = sortedReceipts.slice(page * ROWS_PER_PAGE, page * ROWS_PER_PAGE + ROWS_PER_PAGE)

  // Metrics always reflect only the warehouse selection, over the data loaded from the backend.
  const newCount = warehouseFilteredReceipts.filter((receipt) => isNewStatus(receipt.statusDescription)).length
  const sentCount = warehouseFilteredReceipts.filter((receipt) => isSentStatus(receipt.statusDescription)).length
  const receivedCount = warehouseFilteredReceipts.filter((receipt) => isReceivedStatus(receipt.statusDescription)).length
  const newReceipts = warehouseFilteredReceipts.filter((receipt) => isNewStatus(receipt.statusDescription))
  const sentReceipts = warehouseFilteredReceipts.filter((receipt) => isSentStatus(receipt.statusDescription))
  const receivedReceipts = warehouseFilteredReceipts.filter((receipt) => isReceivedStatus(receipt.statusDescription))

  const statusOptions = useMemo(() => {
    const seen = new Map()
    receipts.forEach((receipt) => seen.set(receipt.status, receipt.statusDescription))
    return Array.from(seen.entries()).map(([value, label]) => ({ value, label }))
  }, [receipts])

  const userOptions = useMemo(() => {
    const seen = new Map()
    receipts.forEach((receipt) => {
      const key = getUserKey(receipt)
      if (!seen.has(key)) seen.set(key, receipt.username || receipt.userEmail)
    })
    return Array.from(seen.entries()).map(([value, label]) => ({ value, label }))
  }, [receipts])

  const handleWarehouseFilterChange = (event) => {
    const value = event.target.value
    setSelectedCodes(typeof value === 'string' ? value.split(',') : value)
    setPage(0)
  }

  const handleStatusFilterChange = (event) => {
    const value = event.target.value
    setSelectedStatuses(typeof value === 'string' ? value.split(',') : value)
    setPage(0)
  }

  const handleUserFilterChange = (event) => {
    const value = event.target.value
    setSelectedUsers(typeof value === 'string' ? value.split(',') : value)
    setPage(0)
  }

  const handleSortChange = (columnKey) => {
    setSort((current) => {
      if (current.by === columnKey) {
        return { by: columnKey, direction: current.direction === 'asc' ? 'desc' : 'asc' }
      }
      return { by: columnKey, direction: 'asc' }
    })
  }

  const handleClearFilters = () => {
    setSelectedCodes([])
    setSelectedStatuses([])
    setSelectedUsers([])
    setDateFrom('')
    setDateTo('')
    setPage(0)
  }

  const handleEdit = (receipt) => {
    setFormDialog({
      open: true,
      mode: 'edit',
      receipt,
      initialValues: {
        origin: receipt.origin,
        destiny: receipt.destiny,
        description: receipt.description,
        status: receipt.status,
      },
    })
  }

  const closeForm = () => setFormDialog((current) => ({ ...current, open: false }))

  const handleSubmitForm = async (values) => {
    setIsSubmitting(true)
    try {
      if (formDialog.mode === 'create') {
        const articleIds = values.articleIds
          .split(',')
          .map((value) => Number(value.trim()))
          .filter((value) => !Number.isNaN(value))
        const response = await receiptsService.register({
          origin: values.origin,
          destiny: values.destiny,
          description: values.description,
          userId: user.id,
          articleIds,
        })
        const created = { ...response.data, id: nextLocalId(receipts) }
        setReceipts((current) => [created, ...current])
      } else {
        const response = await receiptsService.edit({
          id: formDialog.receipt.id,
          status: values.status,
          origin: values.origin,
          destiny: values.destiny,
          description: values.description,
        })
        setReceipts((current) => current.map((receipt) => (
          receipt.id === formDialog.receipt.id ? { ...receipt, ...response.data, id: receipt.id } : receipt
        )))
      }
      closeForm()
    } catch (submitError) {
      onError(submitError.message || 'No se pudo guardar la recepción')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
    try {
      await receiptsService.delete({ id: deleteTarget.id })
      setReceipts((current) => current.filter((receipt) => receipt.id !== deleteTarget.id))
    } catch (deleteError) {
      onError(deleteError.message || 'No se pudo eliminar la recepción')
    } finally {
      setDeleteTarget(null)
    }
  }

  const columns = [
    { key: 'receiptKey', label: 'Código de recepción' },
    {
      key: 'status',
      label: 'Estado',
      sortable: true,
      render: (receipt) => <ReceiptStatusChip statusDescription={receipt.statusDescription} />,
    },
    {
      key: 'origin',
      label: 'Origen',
      render: (receipt) => getWarehouseLabel(receipt.origin),
    },
    {
      key: 'destiny',
      label: 'Destino',
      render: (receipt) => getWarehouseLabel(receipt.destiny),
    },
    {
      key: 'price',
      label: 'Importe total',
      className: 'receipt-amount-cell',
      render: (receipt) => formatReceiptAmount(receipt.price),
    },
    {
      key: 'description',
      label: 'Descripción',
      className: 'receipt-description-cell receipt-col-description',
      render: (receipt) => receipt.description,
    },
    {
      key: 'creationDate',
      label: 'Fecha de creación',
      className: 'receipt-col-date',
      sortable: true,
      render: (receipt) => formatReceiptDate(receipt.creationDate),
    },
    {
      key: 'actions',
      label: 'Acciones',
      align: 'right',
      render: (receipt) => (
        <>
          <Tooltip title="Ver detalle">
            <IconButton size="small" onClick={() => setDetailReceipt(receipt)}>
              <VisibilityRounded fontSize="small" />
            </IconButton>
          </Tooltip>
          {canWrite && (
            <Tooltip title="Editar">
              <IconButton size="small" onClick={() => handleEdit(receipt)}>
                <EditRounded fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {canWrite && (
            <Tooltip title="Eliminar">
              <IconButton size="small" onClick={() => setDeleteTarget(receipt)}>
                <DeleteRounded fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </>
      ),
    },
  ]

  return (
    <Box className="receipts-board">
      <Typography variant="h5" className="receipts-title">Recepciones - envío de mercadería</Typography>

      <Box className="receipts-warehouse-row">
        <FilterField label="Depósitos" className="filter-field-warehouse">
          <Autocomplete
            multiple
            fullWidth
            disableCloseOnSelect
            options={warehouses}
            value={warehouses.filter((warehouse) => selectedCodes.includes(warehouse.code))}
            getOptionLabel={(warehouse) => warehouse.name}
            isOptionEqualToValue={(option, value) => option.code === value.code}
            onChange={(_, selectedWarehouses) => {
              setSelectedCodes(selectedWarehouses.map((warehouse) => warehouse.code))
              setPage(0)
            }}
            aria-label="Depósitos"
            className="warehouse-autocomplete"
            renderOption={({ key, ...optionProps }, warehouse, { selected }) => (
              <li key={key} {...optionProps}>
                <Checkbox checked={selected} />
                {warehouse.name}
              </li>
            )}
            renderInput={(params) => {
              const { inputProps, ...textFieldProps } = params
              return (
                <TextField
                  {...textFieldProps}
                  placeholder={selectedCodes.length ? '' : 'Todos los depósitos'}
                  slotProps={{
                    htmlInput: {
                      ...inputProps,
                      'aria-label': 'Depósitos',
                    },
                  }}
                />
              )
            }}
          />
        </FilterField>
      </Box>

      <CollapsiblePanel
        title="Filtros"
        className="receipts-filters-panel"
        defaultExpanded={false}
      >
        <Box className="receipts-filters-row">
        <FilterField label="Estado">
          <Select
            multiple
            fullWidth
            value={selectedStatuses}
            onChange={handleStatusFilterChange}
            input={<OutlinedInput notched={false} />}
            aria-label="Estado"
            MenuProps={{ slotProps: { paper: { className: 'receipt-filter-menu' } } }}
            renderValue={(selected) => {
              const label = selected
                .map((value) => statusOptions.find((option) => option.value === value)?.label)
                .filter(Boolean)
                .join(', ')
              return <span title={label}>{label || 'Todos los estados'}</span>
            }}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Checkbox checked={selectedStatuses.includes(option.value)} />
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FilterField>

        <FilterField label="Usuario">
          <Select
            multiple
            fullWidth
            value={selectedUsers}
            onChange={handleUserFilterChange}
            input={<OutlinedInput notched={false} />}
            aria-label="Usuario"
            MenuProps={{ slotProps: { paper: { className: 'receipt-filter-menu' } } }}
            renderValue={(selected) => {
              const label = selected
                .map((value) => userOptions.find((option) => option.value === value)?.label)
                .filter(Boolean)
                .join(', ')
              return <span title={label}>{label || 'Todos los usuarios'}</span>
            }}
          >
            {userOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Checkbox checked={selectedUsers.includes(option.value)} />
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FilterField>

        <FilterField label="Desde">
          <TextField
            type="date"
            value={dateFrom}
            onChange={(event) => { setDateFrom(event.target.value); setPage(0) }}
          />
        </FilterField>

        <FilterField label="Hasta">
          <TextField
            type="date"
            value={dateTo}
            onChange={(event) => { setDateTo(event.target.value); setPage(0) }}
          />
        </FilterField>

        <Box className="receipts-filters-actions">
          <Button
            variant="outlined"
            className="filters-clear-button"
            startIcon={<ClearRounded />}
            onClick={handleClearFilters}
          >
            Borrar filtros
          </Button>
          {canWrite && (
            <Box component="button" type="button" className="receipt-create-card" disabled>
              <span className="receipt-create-icon"><AddRounded /></span>
              <span className="receipt-create-text">
                <strong>Nueva recepción</strong>
                <small>Registrar envío de mercadería</small>
              </span>
            </Box>
          )}
        </Box>
        </Box>
      </CollapsiblePanel>

      <DataTable
        title="Listado de recepciones - envíos"
        columns={columns}
        rows={pagedReceipts}
        rowKey="id"
        isLoading={isLoading}
        emptyMessage="No hay recepciones para los filtros seleccionados."
        page={page}
        rowsPerPage={ROWS_PER_PAGE}
        rowCount={filteredReceipts.length}
        onPageChange={(_, nextPage) => setPage(nextPage)}
        sortBy={sort.by}
        sortDirection={sort.direction}
        onSortChange={handleSortChange}
      />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} className="receipt-metrics">
        <MetricCard icon="🆕" value={newCount} amount={sumReceiptPrices(newReceipts)} label="Recepciones nuevas" />
        <MetricCard icon="📤" value={sentCount} amount={sumReceiptPrices(sentReceipts)} label="Recepciones enviadas" />
        <MetricCard icon="📥" value={receivedCount} amount={sumReceiptPrices(receivedReceipts)} label="Recepciones recibidas" />
      </Stack>

      <ReceiptDetailDialog
        open={Boolean(detailReceipt)}
        onClose={() => setDetailReceipt(null)}
        receipt={detailReceipt}
        getWarehouseLabel={getWarehouseLabel}
        isOwner={isOwner}
      />
      <ReceiptFormDialog
        open={formDialog.open}
        mode={formDialog.mode}
        initialValues={formDialog.initialValues}
        warehouses={warehouses}
        statusOptions={statusOptions}
        onClose={closeForm}
        onSubmit={handleSubmitForm}
        isSubmitting={isSubmitting}
      />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Eliminar recepción"
        message={`¿Seguro querés eliminar la recepción ${deleteTarget?.receiptKey ?? ''}?`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  )
}
