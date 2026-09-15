import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// pages/       → UI pages
// services/    → API/backend communication
// context/     → global application state
// components/  → reusable UI components