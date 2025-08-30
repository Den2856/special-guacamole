import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { FavoritesProvider } from './context/FavoritesContext'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>        
          <FavoritesProvider>
            <App/>
          </FavoritesProvider> 
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  </StrictMode>
)
