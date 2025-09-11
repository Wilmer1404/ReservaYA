import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
          <span className="logo me-2">📅</span> ReservaYa
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div id="nav" className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto gap-2">
            <li className="nav-item"><NavLink className="nav-link" to="/recursos">Explorar</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/mis-reservas">Mis Reservas</NavLink></li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
