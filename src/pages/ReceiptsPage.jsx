import { Box, Typography } from '@mui/material'
import { AuthenticatedLayout } from '../layouts/AuthenticatedLayout'
import { ReceiptsBoard } from '../components/receipts/ReceiptsBoard'

export function ReceiptsPage({ user, mode, setMode, availableModes, modules, mobileOpen, navigationCollapsed, onMenu, onClose, onLogout, onError }) {
  const receiptsModule = modules.find((module) => module.mainId === 'MOD_RECEIPTS')
  const permissions = receiptsModule?.permissions ?? {}
  const canWrite = permissions.WRITE === true
  const canRead = permissions.WRITE === true || permissions.READ === true
  const isOwner = user?.roleName === 'OWNER'

  return (
    <AuthenticatedLayout
      user={user}
      mode={mode}
      setMode={setMode}
      availableModes={availableModes}
      modules={modules}
      mobileOpen={mobileOpen}
      navigationCollapsed={navigationCollapsed}
      onMenu={onMenu}
      onClose={onClose}
      onLogout={onLogout}
    >
      <Box className="content-area">
        {canRead ? (
          <ReceiptsBoard user={user} canWrite={canWrite} isOwner={isOwner} modules={modules} onError={onError} />
        ) : (
          <Typography color="text.secondary">No tenés permisos para ver este módulo.</Typography>
        )}
      </Box>
    </AuthenticatedLayout>
  )
}
