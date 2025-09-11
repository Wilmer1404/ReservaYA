import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Resources from './pages/Resources'
import ReservationForm from './pages/ReservationForm'
import MyReservations from './pages/MyReservations'
import { AppProvider } from './context/AppContext'

export default function App() {
  return (
    <AppProvider>
      <Navbar />
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/recursos" element={<Resources />} />
          <Route path="/reservar/:resourceId" element={<ReservationForm />} />
          <Route path="/mis-reservas" element={<MyReservations />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </AppProvider>
  )
}
