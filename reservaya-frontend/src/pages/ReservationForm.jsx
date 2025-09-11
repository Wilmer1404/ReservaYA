import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios'
import { useApp } from '../context/AppContext'

export default function ReservationForm() {
  const { resourceId } = useParams()
  const { user } = useApp()
  const navigate = useNavigate()

  const [date, setDate] = useState('')
  const [start, setStart] = useState('14:00')
  const [end, setEnd] = useState('16:00')
  const [purpose, setPurpose] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    try {
      const startAt = new Date(`${date}T${start}:00`).toISOString()
      const endAt = new Date(`${date}T${end}:00`).toISOString()
      
      console.log('Enviando reserva:', {
        resourceId: Number(resourceId),
        userId: user.id,
        purpose,
        startAt,
        endAt
      })
      
      await api.post('/reservas', {
        resourceId: Number(resourceId),
        userId: user.id,
        purpose,
        startAt,
        endAt
      })
      
      alert('Reserva creada exitosamente!')
      navigate('/mis-reservas')
    } catch (error) {
      console.error('Error al crear reserva:', error.response?.data || error)
      alert(`Error: ${error.response?.data?.message || 'No se pudo crear la reserva'}`)
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-lg-6">
        <div className="card card-elevated">
          <div className="card-body">
            <h4 className="mb-3">Nueva Reserva</h4>
            <form className="vstack gap-3" onSubmit={submit}>
              <div>
                <label className="form-label">Fecha</label>
                <input type="date" required className="form-control" value={date} onChange={e=>setDate(e.target.value)} />
              </div>
              <div className="d-flex gap-3">
                <div className="flex-grow-1">
                  <label className="form-label">Inicio</label>
                  <input type="time" required className="form-control" value={start} onChange={e=>setStart(e.target.value)} />
                </div>
                <div className="flex-grow-1">
                  <label className="form-label">Fin</label>
                  <input type="time" required className="form-control" value={end} onChange={e=>setEnd(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="form-label">Propósito</label>
                <input className="form-control" placeholder="Entrenamiento del equipo…" value={purpose} onChange={e=>setPurpose(e.target.value)} />
              </div>
              <button className="btn btn-primary">Confirmar reserva</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
