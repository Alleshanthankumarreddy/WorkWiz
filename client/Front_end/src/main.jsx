import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import React from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="77374391142-iiogg9jhgiahle2ao0aj731ju270d3fd.apps.googleusercontent.com">
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </GoogleOAuthProvider>
)
