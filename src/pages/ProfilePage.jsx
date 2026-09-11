import { Link, useNavigate } from 'react-router-dom'
import { useProfile } from '../hooks/useProfile'
import { useFavorites } from '../hooks/useFavorites'
import { useViewHistory } from '../hooks/useViewHistory'
import { getAllUserListings } from '../store/listingsStore'
import { useAuth } from '../hooks/useAuth'
import OptimizedImage from '../components/OptimizedImage'
import styles from './ProfilePage.module.css'

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
    <div className={`page ${styles.page}`}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.headerTitle}>DealX</span>
        <Link className={styles.settingsButton} to="/profile/edit">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="white" strokeWidth="1.8" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="white" strokeWidth="1.8" /></svg>
        </Link>
      </div>

      {/* User card */}
      <div className={styles.userCard}>
        <OptimizedImage src={displayUser.avatar} alt={displayUser.name} className={styles.avatar} />
        <div className={styles.userInfo}>
          <div className={styles.userName}>{displayUser.name}</div>
          <div className={styles.userSince}>На сайті з {displayUser.since}</div>
          {displayUser.bio ? <div className={styles.userBio}>{displayUser.bio}</div> : null}
          <div className={styles.rating}>
            <span className={styles.star}>★</span>
            <span className={styles.ratingValue}>{displayUser.rating}</span>
            <span className={styles.reviewCount}>({displayUser.reviews} відгуки)</span>
          </div>
        </div>
        <Link className={`btn-outline ${styles.editButton}`} to="/profile/edit">
          Редагувати
        </Link>
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        {[['📋', userListings.length || 12, 'Оголошень'], ['❤️', favoriteIds.length, 'Обраних'], ['👁', viewedIds.length, 'Переглянутих']].map(([, val, label]) => (
          <div key={label} className={styles.statItem}>
            <div className={styles.statNumber}>{val}</div>
            <div className={styles.statLabel}>{label}</div>
          </div>
        ))}
      </div>

      {/* Menu */}
      <div className={styles.menu}>
        {MENU_ITEMS.map(item => (
          item.route ? <Link key={item.label} className={styles.menuRow} to={item.route}>
            <span className={styles.menuIcon}>{item.icon}</span>
            <span className={styles.menuLabel}>{item.label}</span>
            {item.badge != null && item.badge > 0 && <span className={styles.badge}>{item.badge}</span>}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" /></svg>
          </Link> : (
            <button key={item.label} className={styles.menuRow}>
              <span className={styles.menuIcon}>{item.icon}</span>
              <span className={styles.menuLabel}>{item.label}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
          )
        ))}
        <button className={`${styles.menuRow} ${styles.logoutRow}`} onClick={handleLogout}>
          <span className={styles.menuIcon}>↩️</span>
          <span className={styles.menuLabel}>Вийти</span>
        </button>
      </div>
    </div>
  )
}

