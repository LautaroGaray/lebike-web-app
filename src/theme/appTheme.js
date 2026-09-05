import { createTheme } from '@mui/material'

export const themeModes = { LIGHT: 'light', DARK: 'dark', PREMIUM: 'premium' }

export const themeModesByRole = {
  USER: [themeModes.LIGHT, themeModes.DARK],
  ADMIN: [themeModes.LIGHT, themeModes.DARK],
  OWNER: [themeModes.LIGHT, themeModes.DARK, themeModes.PREMIUM],
}

const themePresets = {
  light: { palette: { mode: 'light', primary: { main: '#193b66', light: '#587fae', dark: '#102846', contrastText: '#fff' }, secondary: { main: '#4e78b7', light: '#86a8d7', dark: '#345987', contrastText: '#fff' }, background: { default: '#f5f7fb', paper: 'rgba(255, 255, 255, 0.78)' }, text: { primary: '#12233e', secondary: '#60708a' } } },
  dark: { palette: { mode: 'dark', primary: { main: '#8db3df', light: '#b9d1ee', dark: '#5e86b5', contrastText: '#08182d' }, secondary: { main: '#aec6e9', light: '#d0e0f5', dark: '#7899c7', contrastText: '#0b1d34' }, background: { default: '#071426', paper: 'rgba(16, 36, 60, 0.92)' }, text: { primary: '#f5f8fd', secondary: '#b8c7da' } } },
  premium: { palette: { mode: 'dark', primary: { main: '#e0ad58', light: '#f1cd8a', dark: '#a87828', contrastText: '#21180b' }, secondary: { main: '#e17b62', light: '#f0a18f', dark: '#a94b36', contrastText: '#2a110b' }, background: { default: '#171614', paper: 'rgba(39, 34, 27, 0.8)' }, text: { primary: '#f4ead9', secondary: '#cbbda8' } } },
}

export function getAvailableThemeModes(roleName) {
  return themeModesByRole[roleName] ?? themeModesByRole.USER
}

export function createAppTheme(mode) {
  return createTheme({ ...(themePresets[mode] ?? themePresets.light), typography: { fontFamily: 'Manrope, Avenir Next, sans-serif' }, shape: { borderRadius: 14 }, components: { MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 700 } } }, MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } } } })
}
