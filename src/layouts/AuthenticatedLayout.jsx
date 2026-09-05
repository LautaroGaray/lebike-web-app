import { Box } from '@mui/material'
import { ModuleNavigation } from '../components/ModuleNavigation'
import { TopBar } from '../components/TopBar'

export function AuthenticatedLayout({
  children,
  user,
  mode,
  setMode,
  availableModes,
  modules,
  mobileOpen,
  navigationCollapsed,
  onMenu,
  onClose,
  onLogout,
}) {
  return (
    <Box className={`app-shell ${mode}`}>
      <TopBar user={user} mode={mode} setMode={setMode} availableModes={availableModes} onLogout={onLogout} onMenu={onMenu} />
      <Box className={`workspace ${navigationCollapsed ? 'collapsed' : ''}`}>
        <ModuleNavigation modules={modules} mobileOpen={mobileOpen} collapsed={navigationCollapsed} onClose={onClose} />
        {children}
      </Box>
    </Box>
  )
}
