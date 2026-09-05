import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import {
  AccountTreeRounded,
  BuildRounded,
  ExpandLess,
  ExpandMore,
  HomeRounded,
  Inventory2Rounded,
  PeopleAltRounded,
  ReceiptLongRounded,
  WarehouseRounded,
} from '@mui/icons-material'

const moduleRoutes = { MOD_RECEIPTS: '/receipts' }

function getModuleIcon(module) {
  const moduleKey = `${module.mainId ?? ''} ${module.name ?? ''}`.toLowerCase()
  if (moduleKey.includes('user') || moduleKey.includes('usuario')) return PeopleAltRounded
  if (moduleKey.includes('warehouse') || moduleKey.includes('almac')) return WarehouseRounded
  if (moduleKey.includes('article') || moduleKey.includes('articulo')) return Inventory2Rounded
  if (moduleKey.includes('receipt') || moduleKey.includes('recep')) return ReceiptLongRounded
  if (moduleKey.includes('repair') || moduleKey.includes('repar')) return BuildRounded
  return AccountTreeRounded
}

function ModuleChild({ child }) {
  const ChildIcon = getModuleIcon(child)
  return (
    <ListItemButton key={child.id ?? child.mainId} sx={{ pl: 7 }}>
      <ListItemIcon><ChildIcon /></ListItemIcon>
      <ListItemText primary={child.name} />
    </ListItemButton>
  )
}

function ModuleItem({ module, collapsed, onNavigate }) {
  const [open, setOpen] = useState(false)
  const children = module.children ?? []
  const Icon = getModuleIcon(module)
  const navigate = useNavigate()
  const location = useLocation()
  const route = moduleRoutes[module.mainId]
  const selected = Boolean(route) && location.pathname === route

  const handleClick = () => {
    if (route) {
      navigate(route)
      onNavigate?.()
      return
    }
    if (children.length) setOpen(!open)
  }

  return (
    <>
      <ListItemButton selected={selected} onClick={handleClick}>
        <ListItemIcon><Icon /></ListItemIcon>
        {!collapsed && <ListItemText primary={module.name} />}
        {!collapsed && (children.length ? (open ? <ExpandLess /> : <ExpandMore />) : null)}
      </ListItemButton>
      {!collapsed && open && children.map((child) => (
        <ModuleChild key={child.id ?? child.mainId} child={child} />
      ))}
    </>
  )
}

function NavigationContent({ modules, collapsed, onNavigate }) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleHomeClick = () => {
    navigate('/home')
    onNavigate?.()
  }

  return (
    <Box className="navigation">
      <List disablePadding>
        <ListItemButton selected={location.pathname === '/home'} onClick={handleHomeClick}>
          <ListItemIcon><HomeRounded /></ListItemIcon>
          {!collapsed && <ListItemText primary="Home" />}
        </ListItemButton>
        {modules.map((module) => (
          <ModuleItem key={module.id ?? module.mainId} module={module} collapsed={collapsed} onNavigate={onNavigate} />
        ))}
      </List>
    </Box>
  )
}

export function ModuleNavigation({ modules, mobileOpen, collapsed, onClose }) {
  return (
    <>
      <Drawer variant="temporary" open={mobileOpen} onClose={onClose} className="mobile-drawer">
        <NavigationContent modules={modules} collapsed={false} onNavigate={onClose} />
      </Drawer>
      <Drawer variant="permanent" className={`desktop-drawer ${collapsed ? 'collapsed' : ''}`}>
        <NavigationContent modules={modules} collapsed={collapsed} />
      </Drawer>
    </>
  )
}
