import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router-dom'
import StoreContextProvider from './components/context/context.jsx'
createRoot(document.getElementById('root')).render(

  <StoreContextProvider>
      <StrictMode>
    <App />
    </StrictMode>
    </StoreContextProvider>

  ,
)
