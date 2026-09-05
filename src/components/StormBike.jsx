import { Box } from '@mui/material'

export function StormBike() {
  return <Box className="storm-bike" aria-hidden="true"><svg viewBox="0 0 520 180" role="presentation"><g className="bike-glow" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="145" cy="126" r="43" /><circle cx="378" cy="126" r="43" /><path d="M145 126 215 72 278 126 145 126 245 126 215 72 260 46 304 126 378 126" /><path d="M260 46h35M304 126l18-48h26M322 78h24" /><path d="M238 48l22-2 10 12" /></g><g className="bike-sparks" fill="none" stroke="currentColor" strokeLinecap="round"><path d="M50 64 72 52 64 76 91 64" /><path d="M410 55 434 42 426 69 460 54" /><path d="M103 32 116 21 112 42 132 33" /></g></svg></Box>
}
