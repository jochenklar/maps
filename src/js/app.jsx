import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './components/App.jsx'

import '../scss/bootstrap.scss'
import '../scss/style.scss'
import 'bootstrap'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
