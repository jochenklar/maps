import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { Maps } from '../src/index.js'

import config from './maps.config.js'

import '../src/bootstrap.scss'
import '../src/style.scss'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Maps config={config} />
  </StrictMode>,
)
