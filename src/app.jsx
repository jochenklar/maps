import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import config from 'virtual:maps-config'

import App from './components/App.jsx'

import './bootstrap.scss'
import './app.scss'
import 'virtual:maps-css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App config={config} />
  </StrictMode>,
)
