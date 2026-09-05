import { useState } from 'react'
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { AccountTreeRounded, DashboardRounded, ExpandLess, ExpandMore, ViewSidebarRounded } from '@mui/icons-material'

function ModuleItem({ module, collapsed }) {
  const [open, setOpen] = useState(false)
  const children = module.children ?? []
  return <><ListItemButton onClick={() => children.length && setOpen(!open)}><ListItemIcon><AccountTreeRounded /></ListItemIcon>{!collapsed && <ListItemText primary={module.name} />}{!collapsed && (children.length ? (open ? <ExpandLess /> : <ExpandMore />) : null)}</ListItemButton>{!collapsed && open && children.map((child) => <ListItemButton key={child.id ?? child.mainId} sx={{ pl: 7 }}><ListItemText primary={child.name} /></ListItemButton>)}</>
}

function NavigationContent({ modules, collapsed, onToggle }) {
  return <Box className="navigation"><Box className="navigation-heading"><ListItemButton className={`navigation-toggle ${collapsed ? 'is-collapsed' : ''}`} onClick={onToggle} aria-label={collapsed ? 'Expandir navegación' : 'Contraer navegación'} title={collapsed ? 'Expandir navegación' : 'Contraer navegación'}><ViewSidebarRounded /></ListItemButton></Box><List disablePadding><ListItemButton selected><ListItemIcon><DashboardRounded /></ListItemIcon>{!collapsed && <ListItemText primary="Resumen" />}</ListItemButton>{modules.map((module) => <ModuleItem key={module.id ?? module.mainId} module={module} collapsed={collapsed} />)}</List></Box>
}

export function ModuleNavigation({ modules, mobileOpen, onClose }) {
  const [collapsed, setCollapsed] = useState(false)
  return <><Drawer variant="temporary" open={mobileOpen} onClose={onClose} className="mobile-drawer"><NavigationContent modules={modules} collapsed={false} onToggle={onClose} /></Drawer><Drawer variant="permanent" className={`desktop-drawer ${collapsed ? 'collapsed' : ''}`}><NavigationContent modules={modules} collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} /></Drawer></>
}
