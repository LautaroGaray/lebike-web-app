import { useMemo, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { authService, modulesService, rolesService, session, usersService } from './service'
import { ErrorDialog } from './components/ErrorDialog'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { createAppTheme, getAvailableThemeModes } from './theme/appTheme'
import './App.css'

function App() {
  return <BrowserRouter><Application /></BrowserRouter>
}

function Application() {
  const [user, setUser] = useState(null)
  const [modules, setModules] = useState([])
  const [login, setLogin] = useState({ username: 'jdoe', password: 'P@ssw0rd' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState('light')
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const isOwner = user?.roleName === 'OWNER'
  const availableModes = getAvailableThemeModes(user?.roleName)
  const theme = useMemo(() => createAppTheme(mode), [mode])

  const handleLogin = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      const authResponse = await authService.login(login)
      const usersResponse = await usersService.findAll()
      const nextUser = usersResponse.data?.find((item) => item.nickName === login.username) ?? usersResponse.data?.[0]
      const roleResponse = await rolesService.findCurrentUserRole()
      const authenticatedUser = { ...nextUser, roleName: roleResponse.data?.roleName ?? nextUser?.roleName }
      session.setAuthentication(authResponse.data.token, authenticatedUser)
      const modulesResponse = await modulesService.findByUser()
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

  const handleLogout = () => {
    session.clear()
    setUser(null)
    setModules([])
    setMode('light')
    navigate('/login', { replace: true })
  }

  return <ThemeProvider theme={theme}><CssBaseline /><Routes><Route path="/login" element={<LoginPage login={login} setLogin={setLogin} onSubmit={handleLogin} isLoading={isLoading} />} /><Route path="/home" element={user ? <HomePage user={user} mode={mode} setMode={setMode} availableModes={availableModes} isOwner={isOwner} modules={modules} mobileOpen={mobileOpen} onMenu={() => setMobileOpen(true)} onClose={() => setMobileOpen(false)} onLogout={handleLogout} /> : <Navigate to="/login" replace />} /><Route path="*" element={<Navigate to={user ? '/home' : '/login'} replace />} /></Routes><ErrorDialog message={error} onClose={() => setError('')} /></ThemeProvider>
}

export default App
