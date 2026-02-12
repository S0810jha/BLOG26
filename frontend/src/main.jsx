import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import AdminContextProvider  from './context/AdminContext.jsx'
import UserContextProvider from './context/UserContext.jsx'
import { ScrollToTop } from './App.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  < ScrollToTop />
  <AdminContextProvider>
    <UserContextProvider>
        <App />
    </UserContextProvider>
  </AdminContextProvider>
  </BrowserRouter>,
)
