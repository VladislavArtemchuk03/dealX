import { Link, NavLink, useLocation } from 'react-router-dom'
import { Heart, House, LayoutGrid, MessageCircle, Plus, UserRound } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import OptimizedImage from './OptimizedImage'

const NAV_ITEMS = [
  { path: '/home', label: 'Головна', icon: House },
  { path: '/categories', label: 'Категорії', icon: LayoutGrid },
  { path: '/messages', label: 'Повідомлення', icon: MessageCircle },
  { path: '/favorites', label: 'Обране', icon: Heart },
  { path: '/profile', label: 'Профіль', icon: UserRound },
]

export default function SideNav() {
  const location = useLocation()
  const { user } = useAuth()

  return (
    <aside className="side-nav">
      <Link className="side-nav-logo" to="/home">
        <span style={{ color: 'var(--accent)' }}>Deal</span>X
      </Link>

      <nav className="side-nav-items">
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
          const active = location.pathname === path || (path !== '/home' && location.pathname.startsWith(path))
          return (
            <NavLink key={path} to={path} className={`side-nav-item${active ? ' side-nav-active' : ''}`}>
              <Icon aria-hidden="true" size={20} strokeWidth={active ? 2.25 : 1.8} />
              <span>{label}</span>
            </NavLink>
          )
        })}
      </nav>

      <Link className="side-nav-add" to="/add">
        <Plus aria-hidden="true" size={19} /> Додати оголошення
      </Link>

      {user && (
        <Link className="side-nav-user" to="/profile">
          <OptimizedImage src={user.avatar} alt={user.name} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{user.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{user.email}</div>
          </div>
        </Link>
      )}
    </aside>
  )
}
