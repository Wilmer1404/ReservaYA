import { useEffect, useMemo, useState } from 'react'
import api from '../api/axios'
import ResourceCard from '../components/ResourceCard'

export default function Resources() {
  const [resources, setResources] = useState([])
  const [category, setCategory] = useState('')
  const [q, setQ] = useState('')

  useEffect(() => {
    const params = category ? { categoria: category } : {}
    api.get('/recursos', { params })
      .then(({data}) => setResources(data))
  }, [category])

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return resources
    return resources.filter(r =>
      r.name?.toLowerCase().includes(term) ||
      r.description?.toLowerCase().includes(term) ||
      r.location?.toLowerCase().includes(term)
    )
  }, [q, resources])

  const categories = ['Deportes', 'Estudio', 'Tecnología']

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-3">
        <h3 className="mb-0">Explorar Recursos</h3>
        <div className="ms-auto d-flex gap-2">
          <input
            className="form-control" style={{minWidth:280}} placeholder="Buscar por nombre, descripción u ubicación…"
            value={q} onChange={e=>setQ(e.target.value)}
          />
          <select className="form-select w-auto" value={category} onChange={e=>setCategory(e.target.value)}>
            <option value="">Todas las categorías</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="row g-3">
        {filtered.map(r => (
          <div className="col-md-4" key={r.id}>
            <ResourceCard r={r} />
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-muted">No se encontraron recursos.</div>
        )}
      </div>
    </div>
  )
}
