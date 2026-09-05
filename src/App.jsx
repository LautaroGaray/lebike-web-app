import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material'
import { authService, modulesService, session } from './service'
import { ErrorDialog } from './components/ErrorDialog'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { ReceiptsPage } from './pages/ReceiptsPage'
import { createAppTheme, getAvailableThemeModes } from './theme/appTheme'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Application />
    </BrowserRouter>
  )
}

function Application() {
  const [user, setUser] = useState(null)
  const [modules, setModules] = useState([])
  const [login, setLogin] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState('light')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [navigationCollapsed, setNavigationCollapsed] = useState(false)
  const navigate = useNavigate()
  const isOwner = user?.roleName === 'OWNER'
  const availableModes = getAvailableThemeModes(user?.roleName)
  const theme = useMemo(() => createAppTheme(mode), [mode])
  const isMobile = useMediaQuery('(max-width:720px)')

  // Re-syncs the in-memory permissions store from React state, so a stale session survives Fast Refresh/HMR reloads during development.
  useEffect(() => {
    session.setModules(modules)
  }, [modules])

  const handleMenu = () => {
    if (isMobile) {
      setMobileOpen((current) => !current)
      return
    }
    setNavigationCollapsed((current) => !current)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      
        console.log('Payload de login enviado al backend:', login)
      
      const authResponse = await authService.login(login)
      const authToken = authResponse.data?.token
      if (!authToken) {
        console.error('Login response missing authentication token:', authResponse)
        throw new Error('No se pudo iniciar sesión. Intentá nuevamente.')
      }
      const authenticatedUser = {
        email: login.email,
        roleName: authResponse.data?.role,
      }
      session.setAuthentication(authToken, authenticatedUser)
      const modulesResponse = await modulesService.findByUser(authenticatedUser.email)
      session.setModules(modulesResponse.data ?? [])
      setUser(authenticatedUser)
      setModules(modulesResponse.data ?? [])
      setMode('light')
      navigate('/home', { replace: true })
    } catch (loginError) {
      setError(loginError.message || 'No se pudo iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch (logoutError) {
      console.error('Logout request failed:', logoutError)
    } finally {
      session.clear()
      setUser(null)
      setModules([])
      setMode('light')
      navigate('/login', { replace: true })
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route
          path="/login"
          element={<LoginPage login={login} setLogin={setLogin} onSubmit={handleLogin} isLoading={isLoading} />}
        />
        <Route
          path="/home"
          element={
            user ? (
              <HomePage
                user={user}
                mode={mode}
                setMode={setMode}
                availableModes={availableModes}
                isOwner={isOwner}
                modules={modules}
                mobileOpen={mobileOpen}
                navigationCollapsed={navigationCollapsed}
                onMenu={handleMenu}
                onClose={() => setMobileOpen(false)}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/receipts"
          element={
            user ? (
              <ReceiptsPage
                user={user}
                mode={mode}
                setMode={setMode}
                availableModes={availableModes}
                modules={modules}
                mobileOpen={mobileOpen}
                navigationCollapsed={navigationCollapsed}
                onMenu={handleMenu}
                onClose={() => setMobileOpen(false)}
                onLogout={handleLogout}
                onError={setError}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to={user ? '/home' : '/login'} replace />} />
      </Routes>
      <ErrorDialog message={error} onClose={() => setError('')} />
    </ThemeProvider>
  )
}

export default App
