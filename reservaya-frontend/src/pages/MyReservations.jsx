import { useEffect, useMemo, useState } from 'react'
import api from '../api/axios'
import { useApp } from '../context/AppContext'
import ReservationRow from '../components/ReservationRow'

export default function MyReservations() {
  const { user } = useApp()
  const [list, setList] = useState([])

  const load = async () => {
    const { data } = await api.get('/reservas', { params: { userId: user.id }})
    setList(data)
  }

  useEffect(() => { load() }, [])

  const stats = useMemo(() => ({
    total: list.length,
    confirmed: list.filter(r => r.status === 'CONFIRMED').length,
    pending: list.filter(r => r.status === 'PENDING').length,
    completed: list.filter(r => r.status === 'COMPLETED').length,
  }), [list])

  const cancel = async (id) => { await api.delete(`/reservas/${id}`); load() }

  return (
    <div>
      <h3 className="mb-3">Mis Reservas</h3>

      <div className="card card-elevated mb-3">
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between rounded-20 p-4 gradient-indigo text-white">
            <div>
              <div className="fw-semibold fs-5">{user.name}</div>
              <div className="text-white-50">{user.email}</div>
            </div>
            <div className="d-flex gap-3">
              <div className="text-center">
                <div className="fs-4 fw-bold">{stats.total}</div>
                <div className="small text-white-50">Total</div>
              </div>
              <div className="text-center">
                <div className="fs-4 fw-bold">{stats.confirmed}</div>
                <div className="small text-white-50">Confirmadas</div>
              </div>
              <div className="text-center">
                <div className="fs-4 fw-bold">{stats.pending}</div>
                <div className="small text-white-50">Pendientes</div>
              </div>
              <div className="text-center">
                <div className="fs-4 fw-bold">{stats.completed}</div>
                <div className="small text-white-50">Completadas</div>
              </div>
            </div>
          </div>

          <ul className="nav nav-pills mt-3">
            <li className="nav-item"><span className="nav-link active">Próximas</span></li>
            <li className="nav-item"><span className="nav-link">Historial</span></li>
          </ul>

          <div className="table-responsive mt-3">
            <table className="table align-middle">
              <thead>
                <tr><th>Recurso</th><th>Inicio</th><th>Fin</th><th>Estado</th><th></th></tr>
              </thead>
              <tbody>
                {list.map(r => <ReservationRow key={r.id} r={r} onCancel={cancel} />)}
              </tbody>
            </table>
            {list.length === 0 && <div className="text-muted">No tienes reservas aún.</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
