import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import React from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Provider } from 'react-redux'
import { PersistGate } from "redux-persist/integration/react"

import App from './App.jsx'
import './index.css'
import { store,  persistor } from "./redux/store";


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <GoogleOAuthProvider clientId="957259333389-4r7eh038ltnbmh0ql70b8q6gnhatk3b0.apps.googleusercontent.com">
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </GoogleOAuthProvider>
    </PersistGate>
  </Provider>
)
