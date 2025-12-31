import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ColorSchemeProvider } from './contexts/ColorSchemeContext'
import { ViewModeProvider } from './contexts/ViewModeContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ColorSchemeProvider>
      <ViewModeProvider>
        <App />
      </ViewModeProvider>
    </ColorSchemeProvider>
  </StrictMode>,
)
