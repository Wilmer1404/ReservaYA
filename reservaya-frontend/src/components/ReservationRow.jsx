export default function ReservationRow({ r, onCancel }) {
  const fmt = (s) => new Date(s).toLocaleString()
  const badgeClass =
    r.status === 'CONFIRMED' ? 'text-bg-success' :
    r.status === 'PENDING'   ? 'text-bg-warning' : 'text-bg-secondary'

  return (
    <tr>
      <td className="fw-semibold">{r.resourceName}</td>
      <td>{fmt(r.startAt)}</td>
      <td>{fmt(r.endAt)}</td>
      <td><span className={`badge ${badgeClass}`}>{r.status}</span></td>
      <td className="text-end">
        <button className="btn btn-outline-danger btn-sm" onClick={() => onCancel(r.id)}>Cancelar</button>
      </td>
    </tr>
  )
}
