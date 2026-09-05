import { Box } from '@mui/material'
import { ModuleNavigation } from '../components/ModuleNavigation'
import { TopBar } from '../components/TopBar'

export function AuthenticatedLayout({ children, user, mode, setMode, availableModes, modules, mobileOpen, onMenu, onClose, onLogout }) {
  return <Box className={`app-shell ${mode}`}><TopBar user={user} mode={mode} setMode={setMode} availableModes={availableModes} onLogout={onLogout} onMenu={onMenu} /><Box className="workspace"><ModuleNavigation modules={modules} mobileOpen={mobileOpen} onClose={onClose} />{children}</Box></Box>
}
