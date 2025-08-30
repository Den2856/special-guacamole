import { Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'
import ProtectedRoute from './components/ProtectedRoute'
import CartPage from './pages/CartPage'
import FavoritesPage from './pages/FavoritesPage'
import IndoorPlants from './pages/category/IndoorPlantsPage'
import OutdoorPlants from './pages/category/OutdoorPlantsPage'
import Succulents from './pages/category/SucculentsPage'
import AirPurifying from './pages/category/AirPurifyingPage'
import PlantTypePage from './pages/PlantTypePage'
import Privacy from './pages/PrivacyPage'
import Contact from './pages/ContactPage'
import ProfilePage from './pages/ProfilePage'


export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />

        <Route path='/favorites' element={<FavoritesPage/>} />
        <Route path='/profile' element={<ProfilePage/>} />
        
        <Route path="/types-of-plants" element={<PlantTypePage />} />
        <Route path="/indoor-plants" element={<IndoorPlants />} />
        <Route path="/outdoor-plants" element={<OutdoorPlants />} />
        <Route path="/succulents" element={<Succulents />} />
        <Route path="/air-purifying" element={<AirPurifying />} />

        <Route path="/privacy" element={<Privacy />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  )
}
