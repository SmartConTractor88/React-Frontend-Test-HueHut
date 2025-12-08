import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Rotate3DIcon } from 'lucide-react'

// using react-dom to render this component tree inside
// an element with the ID of 'root'.
createRoot(document.getElementById('root')!).render(
  // App component wrapped in a built-in StrictMode component
  <StrictMode>
    <App />
  </StrictMode>,
)
Rotate3DIcon
