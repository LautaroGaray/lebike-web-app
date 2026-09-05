import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material'
import { DataTablePanel } from './DataTablePanel'

export function DataTable({
  title,
  columns,
  rows,
  rowKey,
  isLoading,
  emptyMessage,
  page,
  rowsPerPage,
  rowCount,
  onPageChange,
  sortBy,
  sortDirection,
  onSortChange,
  defaultExpanded,
}) {
  const getRowKey = typeof rowKey === 'function' ? rowKey : (row) => row[rowKey]
  const columnCount = columns.length

  return (
    <DataTablePanel title={title} defaultExpanded={defaultExpanded}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.key} align={column.align} className={column.className}>
                  {column.sortable ? (
                    <TableSortLabel
                      active={sortBy === column.key}
                      direction={sortBy === column.key ? sortDirection : 'asc'}
                      onClick={() => onSortChange?.(column.key)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading && rows.map((row) => (
              <TableRow key={getRowKey(row)} hover>
                {columns.map((column) => (
                  <TableCell key={column.key} align={column.align} className={column.className}>
                    {column.render ? column.render(row) : row[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {!isLoading && !rows.length && (
              <TableRow>
                <TableCell colSpan={columnCount} align="center">
                  <Typography color="text.secondary">{emptyMessage}</Typography>
                </TableCell>
              </TableRow>
            )}
            {isLoading && (
              <TableRow>
                <TableCell colSpan={columnCount} align="center">
                  <Typography color="text.secondary">Cargando...</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {typeof rowCount === 'number' && (
          <TablePagination
            component="div"
            count={rowCount}
            page={page}
            onPageChange={onPageChange}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[rowsPerPage]}
          />
        )}
      </TableContainer>
    </DataTablePanel>
  )
}
