import { useEffect, useState } from 'react'
import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import { Brand } from '../components/Brand'

function BicycleWheel() {
  const [isSpinning, setIsSpinning] = useState(false)

  useEffect(() => {
    let spinTimeout
    let nextSpinTimeout
    const scheduleSpin = () => {
      const nextDelay = 4500 + Math.random() * 6000
      nextSpinTimeout = window.setTimeout(() => {
        setIsSpinning(true)
        spinTimeout = window.setTimeout(() => {
          setIsSpinning(false)
          scheduleSpin()
        }, 850)
      }, nextDelay)
    }

    scheduleSpin()
    return () => {
      window.clearTimeout(nextSpinTimeout)
      window.clearTimeout(spinTimeout)
    }
  }, [])

  const spokes = Array.from({ length: 18 }, (_, index) => index * 20)
  const rotorHoles = Array.from({ length: 6 }, (_, index) => index * 60)

  return <Box className={`login-wheel${isSpinning ? ' is-spinning' : ''}`} aria-hidden="true"><svg viewBox="0 0 260 260" role="presentation"><defs><radialGradient id="wheel-hub" cx="35%" cy="30%"><stop offset="0" stopColor="#d9ecfa" /><stop offset=".25" stopColor="#7195b8" /><stop offset=".7" stopColor="#233e59" /><stop offset="1" stopColor="#08182a" /></radialGradient><linearGradient id="wheel-rim" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#d4e7f8" /><stop offset=".45" stopColor="#52799f" /><stop offset="1" stopColor="#142d47" /></linearGradient></defs><circle className="wheel-tire" cx="130" cy="130" r="119" /><circle className="wheel-sidewall" cx="130" cy="130" r="113" /><circle className="wheel-rim-shadow" cx="130" cy="130" r="105" /><circle className="wheel-rim" cx="130" cy="130" r="101" /><g className="wheel-rotor">{spokes.map((angle) => <g key={angle}><line className="wheel-spoke" x1="130" y1="130" x2="130" y2="30" transform={`rotate(${angle} 130 130)`} /><line className="wheel-spoke wheel-spoke-crossed" x1="130" y1="130" x2="130" y2="34" transform={`rotate(${angle + 10} 130 130)`} /><circle className="wheel-nipple" cx="130" cy="30" r="1.25" transform={`rotate(${angle} 130 130)`} /></g>)}<circle className="wheel-brake-rotor" cx="130" cy="130" r="30" />{rotorHoles.map((angle) => <circle key={angle} className="wheel-rotor-hole" cx="130" cy="106" r="2" transform={`rotate(${angle} 130 130)`} />)}<circle className="wheel-hub-ring" cx="130" cy="130" r="16" /><circle className="wheel-hub" cx="130" cy="130" r="11" /><path className="wheel-valve" d="M130 30v-11m-3 0h6" /></g></svg></Box>
}

export function LoginPage({ login, setLogin, onSubmit, isLoading }) {
  return <Box className="login-page"><BicycleWheel /><Box component="main" className="login-card"><Brand /><Box className="login-intro"><Typography className="eyebrow">OPERATIONS PLATFORM</Typography><Typography variant="h2" className="login-title">Roda<br /><span>con nosotros.</span></Typography><Typography color="text.secondary">Accede a tu centro de control para continuar.</Typography></Box><Box component="form" className="login-form" onSubmit={onSubmit}><Stack className="login-fields" spacing={0}><TextField className="login-field" label="Email" type="email" value={login.email} onChange={(event) => setLogin({ ...login, email: event.target.value })} fullWidth autoComplete="email" /><TextField className="login-field" label="Contraseña" type="password" value={login.password} onChange={(event) => setLogin({ ...login, password: event.target.value })} fullWidth autoComplete="current-password" /><Button type="submit" variant="contained" size="large" disabled={isLoading} className="glow-button login-submit">{isLoading ? 'Validando...' : 'Entrar al espacio'}</Button></Stack></Box><Typography className="login-footnote" variant="caption" color="text.secondary">Sesión protegida · Conexión cifrada</Typography></Box></Box>
}
