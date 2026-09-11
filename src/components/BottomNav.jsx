import { NavLink, useLocation } from 'react-router-dom'
import { House, LayoutGrid, MessageCircle, Plus, UserRound } from 'lucide-react'
import styles from './BottomNav.module.css'

const tabs = [
  { path: '/home', label: 'Головна', icon: House },
  { path: '/categories', label: 'Категорії', icon: LayoutGrid },
  { path: '/add', label: 'Додати', icon: Plus, accent: true },
  { path: '/messages', label: 'Повідомлення', icon: MessageCircle },
  { path: '/profile', label: 'Профіль', icon: UserRound },
]

export default function BottomNav() {
  const location = useLocation()

  return (
    <nav className={styles.nav}>
      {tabs.map(({ path, label, icon: Icon, accent }) => {
        const active = location.pathname === path
        return (
          <NavLink
            key={path}
            to={path}
            aria-label={label}
            className={accent ? styles.accentTab : styles.tab}
            data-active={active || undefined}
          >
            {accent ? (
              <div className={styles.accentCircle}>
                <Icon aria-hidden="true" size={24} />
              </div>
            ) : (
              <>
                <Icon aria-hidden="true" className={styles.tabIcon} size={22} />
                <span className={styles.label}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        )
      })}
    </nav>
  )
}
