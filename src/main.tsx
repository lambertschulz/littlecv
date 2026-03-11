import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { registerBundledFonts } from './fonts/register'
import './index.css'

registerBundledFonts()

// Note: StrictMode removed due to incompatibility with @react-pdf/renderer.
// react-pdf's internal PDF document state gets corrupted by StrictMode's
// double-invocation of effects. This is a known upstream issue.
createRoot(document.getElementById('root')!).render(<App />)
