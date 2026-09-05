import { AuthenticatedLayout } from '../layouts/AuthenticatedLayout'

export function HomePage({ user, mode, setMode, availableModes, modules, mobileOpen, navigationCollapsed, onMenu, onClose, onLogout }) {
  return <AuthenticatedLayout user={user} mode={mode} setMode={setMode} availableModes={availableModes} modules={modules} mobileOpen={mobileOpen} navigationCollapsed={navigationCollapsed} onMenu={onMenu} onClose={onClose} onLogout={onLogout} />
}
