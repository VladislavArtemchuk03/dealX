import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight, ClipboardList, Eye, Handshake, Heart, LogOut, MessageCircle, Settings, Star } from 'lucide-react'
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
    { icon: ClipboardList, label: 'Мої оголошення', badge: userListings.length || 12, route: '/my-listings' },
    { icon: Heart, label: 'Обране', badge: favoriteIds.length || null, route: '/favorites' },
    { icon: MessageCircle, label: 'Повідомлення', badge: 3, route: '/messages' },
    { icon: Eye, label: 'Переглянуті', badge: viewedIds.length || null, route: '/viewed' },
    { icon: Settings, label: 'Налаштування', badge: null, route: null },
    { icon: Handshake, label: 'Підтримка', badge: null, route: null },
  ]

  const handleLogout = () => {
    if (confirm('Ви впевнені, що хочете вийти?')) {
      logout()
      navigate('/auth', { replace: true })
    }
  }

  return (
    <div className={`page ${styles.dealxProfileMain}`}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.headerTitle}>DealX</span>
        <Link className={styles.settingsButton} to="/profile/edit">
          <Settings aria-hidden="true" size={22} strokeWidth={1.8} />
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
            <Star className={styles.star} aria-hidden="true" size={14} fill="currentColor" />
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
        {[[userListings.length || 12, 'Оголошень'], [favoriteIds.length, 'Обраних'], [viewedIds.length, 'Переглянутих']].map(([val, label]) => (
          <div key={label} className={styles.statItem}>
            <div className={styles.statNumber}>{val}</div>
            <div className={styles.statLabel}>{label}</div>
          </div>
        ))}
      </div>

      {/* Menu */}
      <div className={styles.menu}>
        {MENU_ITEMS.map(({ icon: Icon, label, badge, route }) => (
          route ? <Link key={label} className={styles.menuRow} to={route}>
            <span className={styles.menuIcon}><Icon aria-hidden="true" /></span>
            <span className={styles.menuLabel}>{label}</span>
            {badge != null && badge > 0 && <span className={styles.badge}>{badge}</span>}
            <ChevronRight aria-hidden="true" size={16} strokeWidth={1.8} />
          </Link> : (
            <button key={label} className={styles.menuRow} onClick={() => alert('Дана функція у розробці')}>
              <span className={styles.menuIcon}><Icon aria-hidden="true" /></span>
              <span className={styles.menuLabel}>{label}</span>
              <ChevronRight aria-hidden="true" size={16} strokeWidth={1.8} />
            </button>
          )
        ))}
        <button className={`${styles.menuRow} ${styles.logoutRow}`} onClick={handleLogout}>
          <span className={styles.menuIcon}><LogOut aria-hidden="true" /></span>
          <span className={styles.menuLabel}>Вийти</span>
        </button>
      </div>
    </div>
  )
}

