import { useEffect, useState } from 'react'
import { Button, MenuItem, Stack, TextField } from '@mui/material'
import { AppDialog } from '../AppDialog'

const emptyForm = { origin: '', destiny: '', description: '', status: '', articleIds: '' }

export function ReceiptFormDialog({ open, mode, initialValues, warehouses, statusOptions, onClose, onSubmit, isSubmitting }) {
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (!open) return
    setForm(initialValues ? { ...emptyForm, ...initialValues } : emptyForm)
  }, [open, initialValues])

  const isEdit = mode === 'edit'
  const isValid = form.origin && form.destiny && form.origin !== form.destiny

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!isValid) return
    onSubmit(form)
  }

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={isEdit ? 'Editar recepción' : 'Nueva recepción'}
      maxWidth="xs"
      onSubmit={handleSubmit}
      actions={
        <>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={!isValid || isSubmitting} className="glow-button">
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </Button>
        </>
      }
    >
      <Stack spacing={2.2}>
        <TextField select label="Depósito de origen" value={form.origin} onChange={handleChange('origin')} fullWidth required>
          {warehouses.map((warehouse) => (
            <MenuItem key={warehouse.code} value={warehouse.code}>{warehouse.name}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Depósito de destino"
          value={form.destiny}
          onChange={handleChange('destiny')}
          fullWidth
          required
          error={Boolean(form.origin) && form.origin === form.destiny}
          helperText={form.origin === form.destiny && form.destiny ? 'El destino debe ser distinto al origen' : ' '}
        >
          {warehouses.map((warehouse) => (
            <MenuItem key={warehouse.code} value={warehouse.code}>{warehouse.name}</MenuItem>
          ))}
        </TextField>
        {isEdit && (
          <TextField select label="Estado" value={form.status} onChange={handleChange('status')} fullWidth>
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
          </TextField>
        )}
        <TextField
          label="Descripción"
          value={form.description}
          onChange={handleChange('description')}
          fullWidth
          multiline
          minRows={2}
        />
        {!isEdit && (
          <TextField
            label="Artículos (IDs separados por coma)"
            value={form.articleIds}
            onChange={handleChange('articleIds')}
            fullWidth
            helperText="Ejemplo: 1, 2, 5"
          />
        )}
      </Stack>
    </AppDialog>
  )
}
