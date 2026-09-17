import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Armchair, Bell, CheckCircle, Heart, MapPin, Search, SlidersHorizontal } from 'lucide-react'
import { CATEGORIES } from '../data/listings'
import { useFavorites } from '../hooks/useFavorites'
import { useListings } from '../hooks/useListings'
import CategoryIcon from '../components/CategoryIcon'
import OptimizedImage from '../components/OptimizedImage'
import styles from './HomePage.module.css'

export default function HomePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useState('')
  const { isFavorite, toggleFavorite } = useFavorites()
  const { listings, refresh } = useListings()
  const [newBanner, setNewBanner] = useState(null)

  // refresh + show banner when returning from a successful publish
  useEffect(() => {
    if (location.state?.newListingId) {
      refresh()
      setNewBanner('Оголошення опубліковано!')
      const t = setTimeout(() => setNewBanner(null), 3500)
      return () => clearTimeout(t)
    }
  }, [location.state?.newListingId, refresh])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) navigate('/search', { state: { query: search } })
  }

  return (
    <div className={`page home-page ${styles.dealxHomeMain}`}>
      {newBanner && (
        <div className={styles.newBanner}>
          <CheckCircle aria-hidden="true" size={18} /> {newBanner}
        </div>
      )}
      {/* Header */}
      <div className={styles.header}>
        <div>
          <div className={styles.logo}><span className={styles.accentText}>Deal</span>X</div>
          <div className={styles.location}>
            <MapPin aria-hidden="true" size={12} strokeWidth={1.8} />
            <span>Київ, Україна</span>
          </div>
        </div>
        <div className={styles.headerActions}>
          <IconBtn to="/favorites" title="Обрані">
            <Heart aria-hidden="true" size={22} strokeWidth={1.8} />
          </IconBtn>
          <IconBtn onClick={() => alert('Дана функція у розробці')} title="Сповіщення">
            <Bell aria-hidden="true" size={22} strokeWidth={1.8} />
          </IconBtn>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className={styles.searchRow}>
        <div className={styles.searchWrap}>
          <Search className={styles.searchIcon} aria-hidden="true" size={16} strokeWidth={1.8} />
          <input
            className={styles.searchInput}
            placeholder="Пошук товарів..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Link to="/search" className={styles.filterButton} title="Фільтри">
          <SlidersHorizontal aria-hidden="true" size={18} strokeWidth={1.8} />
        </Link>
      </form>

      {/* Hero Banner */}
      <div className={styles.banner}>
        <div className={styles.bannerContent}>
          <div className={styles.bannerTitle}>Знайди все, що потрібно.<br /><span className={styles.accentText}>Продай те, що набридло.</span></div>
          <div className={styles.bannerSub}>Легко, швидко та безпечно з DealX</div>
          <Link className={`btn-primary add-listings-button ${styles.addListingsButton}`} to="/add">
            + Додати оголошення
          </Link>
        </div>
        <Armchair className={styles.bannerEmoji} aria-hidden="true" size={60} strokeWidth={1.6} />
      </div>

      {/* Categories */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Категорії</span>
          <Link className={styles.seeAllButton} to="/categories">Усі ›</Link>
        </div>
        <div className={`home-categories ${styles.categoryRow}`}>
          {CATEGORIES.slice(0, 5).map(cat => (
            <Link key={cat.id} className={styles.categoryItem} to="/categories" state={{ cat: cat.name }}>
              <CategoryIcon category={cat.name} className={styles.categoryIcon} />
              <span className={styles.categoryLabel}>{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recommended */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Рекомендовані оголошення</span>
          <Link className={styles.seeAllButton} to="/search">Усі ›</Link>
        </div>
        <div className={`home-recommendations ${styles.grid}`}>
          {listings.slice(0, 3).map(item => (
            <div key={item.id} className={styles.itemCard}>
              <div className={styles.itemImageWrap}>
                <Link to={`/product/${item.id}`}><OptimizedImage src={item.images[0]} alt={item.title} className={styles.itemImage} /></Link>
                <button
                  className={styles.heartButton}
                  data-favorite={isFavorite(item.id) || undefined}
                  onClick={e => toggleFavorite(item.id, e)}
                >
                  <Heart aria-hidden="true" size={16} fill={isFavorite(item.id) ? 'var(--danger)' : 'none'} stroke={isFavorite(item.id) ? 'var(--danger)' : 'white'} />
                </button>
              </div>
              <Link to={`/product/${item.id}`} className={styles.itemLink}><div className={styles.itemBody}>
                <div className={styles.itemPrice}>{item.price.toLocaleString('uk-UA')} грн</div>
                <div className={styles.itemTitle}>{item.title}</div>
                <div className={styles.itemLocation}>{item.location}</div>
              </div></Link>
            </div>
          ))}
        </div>
      </div>

      {/* All listings */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Всі оголошення</span>
        </div>
        <div className={`home-listings ${styles.listings}`}>
          {listings.map(item => (
            <div key={item.id} className={styles.listItem}>
              <Link to={`/product/${item.id}`} className={styles.listLink}>
                <OptimizedImage src={item.images[0]} alt={item.title} className={styles.listImage} />
                <div className={styles.listBody}>
                <div className={styles.itemTitle}>{item.title}</div>
                <div className={`${styles.itemPrice} ${styles.listPrice}`}>{item.price.toLocaleString('uk-UA')} грн</div>
                {item.negotiable && <span className={styles.negotiable}>Договірна</span>}
                <div className={styles.itemLocation}>{item.location}</div>
                </div>
              </Link>
              <button className={styles.heartButtonSmall} onClick={e => toggleFavorite(item.id, e)}>
                <Heart aria-hidden="true" size={18} fill={isFavorite(item.id) ? 'var(--danger)' : 'none'} stroke={isFavorite(item.id) ? 'var(--danger)' : 'white'} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function IconBtn({ onClick, to, children, title }) {
  const props = { title, onClick, className: styles.iconButton }
  return to ? (
    <Link {...props} to={to}>
      {children}
    </Link>
  ) : (
    <button {...props}>{children}</button>
  )
}

