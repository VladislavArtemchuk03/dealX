import { Link, useNavigate } from 'react-router-dom'
import { useProfile } from '../hooks/useProfile'
import { useFavorites } from '../hooks/useFavorites'
import { useViewHistory } from '../hooks/useViewHistory'
import { getAllUserListings } from '../store/listingsStore'
import { useAuth } from '../hooks/useAuth'
import OptimizedImage from '../components/OptimizedImage'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { profile } = useProfile()
  const { user, logout } = useAuth()
  const { favoriteIds } = useFavorites()
  const { ids: viewedIds } = useViewHistory()
  const userListings = getAllUserListings()
  const displayUser = user || profile

  const MENU_ITEMS = [
    { icon: '📋', label: 'Мої оголошення', badge: userListings.length || 12, route: '/my-listings' },
    { icon: '❤️', label: 'Обране', badge: favoriteIds.length || null, route: '/favorites' },
    { icon: '✉️', label: 'Повідомлення', badge: 3, route: '/messages' },
    { icon: '👁', label: 'Переглянуті', badge: viewedIds.length || null, route: '/viewed' },
    { icon: '⚙️', label: 'Налаштування', badge: null, route: null },
    { icon: '🤝', label: 'Підтримка', badge: null, route: null },
  ]

  const handleLogout = () => {
    if (confirm('Ви впевнені, що хочете вийти?')) {
      logout()
      navigate('/auth', { replace: true })
    }
  }

  return (
    <div className="page" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div style={s.header}>
        <span style={s.headerTitle}>DealX</span>
        <Link style={s.settingsBtn} to="/profile/edit">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="white" strokeWidth="1.8" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="white" strokeWidth="1.8" /></svg>
        </Link>
      </div>

      {/* User card */}
      <div style={s.userCard}>
        <OptimizedImage src={displayUser.avatar} alt={displayUser.name} style={s.avatar} />
        <div style={{ flex: 1 }}>
          <div style={s.userName}>{displayUser.name}</div>
          <div style={s.userSince}>На сайті з {displayUser.since}</div>
          {displayUser.bio ? <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>{displayUser.bio}</div> : null}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
            <span style={{ color: 'var(--star)' }}>★</span>
            <span style={{ fontWeight: 700, fontSize: 15 }}>{displayUser.rating}</span>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>({displayUser.reviews} відгуки)</span>
          </div>
        </div>
        <Link className="btn-outline" style={{ padding: '8px 14px', fontSize: 13, width: 'auto' }} to="/profile/edit">
          Редагувати
        </Link>
      </div>

      {/* Stats */}
      <div style={s.statsRow}>
        {[['📋', userListings.length || 12, 'Оголошень'], ['❤️', favoriteIds.length, 'Обраних'], ['👁', viewedIds.length, 'Переглянутих']].map(([, val, label]) => (
          <div key={label} style={s.statItem}>
            <div style={s.statNum}>{val}</div>
            <div style={s.statLabel}>{label}</div>
          </div>
        ))}
      </div>

      {/* Menu */}
      <div style={{ padding: '0 16px' }}>
        {MENU_ITEMS.map(item => (
          item.route ? <Link key={item.label} style={s.menuRow} to={item.route}>
            <span style={{ fontSize: 20, width: 28 }}>{item.icon}</span>
            <span style={s.menuLabel}>{item.label}</span>
            {item.badge != null && item.badge > 0 && <span style={s.badge}>{item.badge}</span>}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" /></svg>
          </Link> : (
            <button key={item.label} style={s.menuRow}>
              <span style={{ fontSize: 20, width: 28 }}>{item.icon}</span>
              <span style={s.menuLabel}>{item.label}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
          )
        ))}
        <button style={{ ...s.menuRow, color: 'var(--danger)' }} onClick={handleLogout}>
          <span style={{ fontSize: 20, width: 28 }}>↩️</span>
          <span style={{ ...s.menuLabel, color: 'var(--danger)' }}>Вийти</span>
        </button>
      </div>
    </div>
  )
}

const s = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 16px 12px' },
  headerTitle: { fontSize: 20, fontWeight: 700, color: '#fff' },
  settingsBtn: { background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  userCard: { display: 'flex', alignItems: 'center', gap: 14, padding: '16px', background: 'var(--bg-card)', margin: '0 16px 16px', borderRadius: 14, border: '1px solid var(--border)' },
  avatar: { width: 58, height: 58, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent)' },
  userName: { fontSize: 17, fontWeight: 700 },
  userSince: { fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 },
  statsRow: { display: 'flex', margin: '0 16px 20px', background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' },
  statItem: { flex: 1, padding: '14px 0', textAlign: 'center', borderRight: '1px solid var(--border)' },
  statNum: { fontSize: 20, fontWeight: 800, color: 'var(--accent)' },
  statLabel: { fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 },
  menuRow: { display: 'flex', alignItems: 'center', gap: 12, background: 'none', border: 'none', width: '100%', padding: '15px 4px', borderBottom: '1px solid var(--border)', cursor: 'pointer', textAlign: 'left', color: '#fff' },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: 500 },
  badge: { background: 'var(--accent)', color: 'var(--bg)', fontSize: 11, fontWeight: 700, minWidth: 20, height: 20, borderRadius: 10, padding: '0 6px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
}
