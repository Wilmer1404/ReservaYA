import { Link } from 'react-router-dom'

export default function GradientCard({ title, caption, to, cta, gradientClass }) {
  return (
    <div className={`p-4 text-white rounded-20 shadow-soft ${gradientClass}`}>
      <h5 className="mb-1">{title}</h5>
      <p className="mb-3 text-white-50">{caption}</p>
      <Link to={to} className="btn btn-light">{cta}</Link>
    </div>
  )
}
