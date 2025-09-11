import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import GradientCard from '../components/GradientCard'
import ResourceCard from '../components/ResourceCard'
import api from '../api/axios'
import { useApp } from '../context/AppContext'

export default function Dashboard() {
  const { user } = useApp()
  const [nextReservations, setNextReservations] = useState([])
  const [featured, setFeatured] = useState([])

  useEffect(() => {
    // Próximas reservas (simple: trae todas y muestra primeras 2)
    api.get('/reservas', { params: { userId: user.id }})
      .then(({data}) => setNextReservations(data.slice(0,1)))
      .catch(()=>{})

    // Recursos destacados (primeros 3)
    api.get('/recursos')
      .then(({data}) => setFeatured(data.slice(0,3)))
      .catch(()=>{})
  }, [user.id])

  return (
    <div>
      <h2 className="mb-1">Bienvenido, {user.name.split(' ')[0]}</h2>
      <p className="text-muted">Gestiona tus reservas y descubre recursos disponibles en tu institución</p>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <GradientCard
            title="Nueva Reserva"
            caption="Reserva un recurso para tu próxima actividad"
            cta="Hacer Reserva"
            to="/recursos"
            gradientClass="gradient-blue"
          />
        </div>
        <div className="col-md-4">
          <GradientCard
            title="Explorar Recursos"
            caption="Descubre todos los espacios disponibles"
            cta="Ver Recursos"
            to="/recursos"
            gradientClass="gradient-indigo"
          />
        </div>
        <div className="col-md-4">
          <GradientCard
            title="Mis Reservas"
            caption="Revisa y gestiona tus reservas activas"
            cta="Ver Reservas"
            to="/mis-reservas"
            gradientClass="gradient-purple"
          />
        </div>
      </div>

      <div className="row g-3">
        <div className="col-lg-6">
          <div className="card card-elevated">
            <div className="card-body">
              <h5 className="card-title mb-1">Próximas Reservas</h5>
              <p className="text-muted small mb-3">Tus reservas confirmadas y pendientes</p>
              {nextReservations.length === 0 && <div className="text-muted">No tienes reservas próximas.</div>}
              {nextReservations.map(r => (
                <div key={r.id} className="border rounded-20 p-3 d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-semibold">{r.resourceName}</div>
                    <div className="small text-muted">
                      {new Date(r.startAt).toLocaleDateString()} · {new Date(r.startAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                      {' - '}{new Date(r.endAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                    </div>
                    {r.purpose && <div className="small mt-1">Propósito: {r.purpose}</div>}
                  </div>
                  <span className="badge text-bg-success">Confirmada</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card card-elevated">
            <div className="card-body">
              <h5 className="card-title mb-1">Recursos Destacados</h5>
              <p className="text-muted small mb-3">Espacios populares disponibles para reservar</p>
              <div className="row g-3">
                {featured.map(r => (
                  <div className="col-md-12" key={r.id}>
                    <ResourceCard r={r} />
                  </div>
                ))}
              </div>
              <div className="text-end mt-2">
                <Link to="/recursos" className="btn btn-outline-secondary btn-sm">Ver todos</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
