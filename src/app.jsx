import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './components/App.jsx'

import './bootstrap.scss'
import './app.scss'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
