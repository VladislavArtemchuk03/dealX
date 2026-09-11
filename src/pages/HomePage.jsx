import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { CATEGORIES } from '../data/listings'
import { useFavorites } from '../hooks/useFavorites'
import { useListings } from '../hooks/useListings'
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
    <div className={`page home-page ${styles.page}`}>
      {newBanner && (
        <div className={styles.newBanner}>
          ✅ {newBanner}
        </div>
      )}
      {/* Header */}
      <div className={styles.header}>
        <div>
          <div className={styles.logo}><span className={styles.accentText}>Deal</span>X</div>
          <div className={styles.location}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="var(--accent)" /></svg>
            <span>Київ, Україна</span>
          </div>
        </div>
        <div className={styles.headerActions}>
          <IconBtn to="/favorites" title="Обрані">
            <HeartSvg />
          </IconBtn>
          <IconBtn onClick={() => alert('Нових сповіщень немає')} title="Сповіщення">
            <BellSvg />
          </IconBtn>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className={styles.searchRow}>
        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="var(--text-secondary)" strokeWidth="2" /><path d="M21 21l-4-4" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" /></svg>
          <input
            className={styles.searchInput}
            placeholder="Пошук товарів..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Link to="/search" className={styles.filterButton} title="Фільтри">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M7 12h10M10 18h4" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
        </Link>
      </form>

      {/* Hero Banner */}
      <div className={styles.banner}>
        <div className={styles.bannerContent}>
          <div className={styles.bannerTitle}>Знайди все, що потрібно.<br /><span className={styles.accentText}>Продай те, що набридло.</span></div>
          <div className={styles.bannerSub}>Легко, швидко та безпечно з DealX</div>
          <Link className={`btn-primary ${styles.addListingButton}`} to="/add">
            + Додати оголошення
          </Link>
        </div>
        <div className={styles.bannerEmoji}>🛋️</div>
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
              <div className={styles.categoryIcon}>{cat.icon}</div>
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
                  {isFavorite(item.id) ? '❤️' : '🤍'}
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
                {isFavorite(item.id) ? '❤️' : '🤍'}
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

function HeartSvg() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="white" strokeWidth="1.8" /></svg>
}
function BellSvg() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
}
