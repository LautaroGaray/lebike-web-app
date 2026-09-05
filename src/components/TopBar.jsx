import { Avatar, Box, Divider, IconButton, MenuItem, Select, Stack, Toolbar, Tooltip, Typography } from '@mui/material'
import { DarkMode, LightMode, LogoutRounded, MenuRounded } from '@mui/icons-material'
import { Brand } from './Brand'

export function TopBar({ user, mode, setMode, availableModes, onLogout, onMenu }) {
  const initial = user.nickName?.charAt(0).toUpperCase() || '?'
  return <Box component="header" className="topbar"><Toolbar><IconButton className="mobile-menu" onClick={onMenu}><MenuRounded /></IconButton><Brand /><Box sx={{ flex: 1 }} /><Tooltip title={mode === 'dark' ? 'Modo claro' : 'Modo oscuro'}><IconButton onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}>{mode === 'dark' ? <LightMode /> : <DarkMode />}</IconButton></Tooltip><Select variant="standard" value={mode} onChange={(event) => setMode(event.target.value)} className="theme-select" disableUnderline>{availableModes.map((availableMode) => <MenuItem key={availableMode} value={availableMode}>{availableMode.charAt(0).toUpperCase() + availableMode.slice(1)}</MenuItem>)}</Select><Divider orientation="vertical" flexItem className="top-divider" /><Stack direction="row" alignItems="center" spacing={1.2} className="profile"><Avatar className={`avatar avatar-${initial.toLowerCase()}`}>{initial}</Avatar><Box><Typography variant="body2" fontWeight={700}>{user.nickName}</Typography><Typography variant="caption" color="text.secondary">{user.roleName}</Typography></Box></Stack><Tooltip title="Cerrar sesión"><IconButton onClick={onLogout}><LogoutRounded /></IconButton></Tooltip></Toolbar></Box>
}
