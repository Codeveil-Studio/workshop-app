import { Link, useLocation } from 'react-router-dom'

function Sidebar() {
  const location = useLocation()
  const items = [
    { to: '/dashboard', label: 'Overview' },
    { to: '/logs', label: 'Time Logs' },
    { to: '/reports', label: 'Reports' },
  ]
  return (
    <aside className="hidden md:block w-60 shrink-0 border-r bg-white min-h-[calc(100vh-56px)]">
      <div className="p-3">
        {items.map(it => (
          <Link key={it.to} to={it.to} className={`block px-3 py-2 rounded-lg text-sm mb-1 ${location.pathname===it.to ? 'bg-slate-100 font-medium' : 'text-slate-600 hover:text-slate-900'}`}>{it.label}</Link>
        ))}
      </div>
    </aside>
  )
}

export default Sidebar


