import { Link } from 'react-router-dom'

export default function ResourceCard({ r }) {
  return (
    <div className="card card-elevated h-100">
      <img
        src={r.imageUrl || 'https://images.unsplash.com/photo-1518602164572-6ca133d6aa48?q=80&w=1200&auto=format&fit=crop'}
        alt={r.name} className="card-img-top" style={{objectFit:'cover', height:180}}
      />
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <span className="badge text-bg-secondary">{r.category?.name || r.categoryName || 'Recurso'}</span>
          <span className="badge text-bg-success badge-pill">Disponible</span>
        </div>
        <h5 className="card-title">{r.name}</h5>
        <p className="text-muted small mb-2">{r.location} · Cap: {r.capacity}</p>
        <p className="card-text">{r.description}</p>
        <div className="d-flex justify-content-between align-items-center">
          <span className="fw-semibold">{r.hourlyPrice ? `$${r.hourlyPrice}/hora` : 'Gratis'}</span>
          <Link to={`/reservar/${r.id}`} className="btn btn-dark btn-sm">Reservar Ahora</Link>
        </div>
      </div>
    </div>
  )
}
