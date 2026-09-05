import { CollapsiblePanel } from './CollapsiblePanel'

export function DataTablePanel({ title, children, defaultExpanded = true }) {
  return (
    <CollapsiblePanel title={title} defaultExpanded={defaultExpanded} className="data-table-panel">
      {children}
    </CollapsiblePanel>
  )
}
