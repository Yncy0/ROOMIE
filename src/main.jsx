import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import HeaderComponent from './components/HeaderComponent.jsx'
import MenuComponent from './components/navigation/MenuComponent.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HeaderComponent/>
  </StrictMode>,
)
