import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import React from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Provider } from 'react-redux'

import App from './App.jsx'
import './index.css'
import { store } from "./redux/store";


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId="77374391142-iiogg9jhgiahle2ao0aj731ju270d3fd.apps.googleusercontent.com">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </Provider>
)
