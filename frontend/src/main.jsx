import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Tasks from './Pages/Tasks/index.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Tasks/>
  </StrictMode>,
)
