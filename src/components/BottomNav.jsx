import { NavLink, useLocation } from 'react-router-dom'
import { House, LayoutGrid, MessageCircle, Plus, UserRound } from 'lucide-react'

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
    <nav style={styles.nav}>
      {tabs.map(({ path, label, icon: Icon, accent }) => {
        const active = location.pathname === path
        return (
          <NavLink
            key={path}
            to={path}
            aria-label={label}
            style={{ ...styles.tab, ...(accent ? styles.accentTab : {}) }}
          >
            {accent ? (
              <div style={styles.accentCircle}>
                <Icon aria-hidden="true" size={24} strokeWidth={2.5} />
              </div>
            ) : (
              <>
                <Icon aria-hidden="true" size={22} strokeWidth={active ? 2.25 : 1.8} />
                <span style={{ ...styles.label, color: active ? 'var(--accent)' : 'var(--text-secondary)' }}>
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

const styles = {
  nav: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: 430,
    backgroundColor: 'var(--bg-elevated)',
    borderTop: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    height: 65,
    zIndex: 100,
  },
  tab: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    background: 'transparent',
    color: 'var(--text-secondary)',
    padding: '6px 0',
    height: '100%',
  },
  accentTab: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    height: '100%',
  },
  accentCircle: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    backgroundColor: 'var(--accent)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
  label: {
    fontSize: 10,
    fontWeight: 500,
  },
}
