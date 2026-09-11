import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { CATEGORIES } from '../data/listings'
import { useFavorites } from '../hooks/useFavorites'
import { useListings } from '../hooks/useListings'
import OptimizedImage from '../components/OptimizedImage'

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
    <div className="page home-page" style={{ background: 'var(--bg)', padding: 0 }}>
      {newBanner && (
        <div style={{ background: 'var(--accent)', color: 'var(--bg)', textAlign: 'center', padding: '10px 16px', fontWeight: 600, fontSize: 14, position: 'sticky', top: 0, zIndex: 20 }}>
          ✅ {newBanner}
        </div>
      )}
      {/* Header */}
      <div style={s.header}>
        <div>
          <div style={s.logo}><span style={{ color: 'var(--accent)' }}>Deal</span>X</div>
          <div style={s.location}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="var(--accent)" /></svg>
            <span>Київ, Україна</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <IconBtn to="/favorites" title="Обрані">
            <HeartSvg />
          </IconBtn>
          <IconBtn onClick={() => alert('Нових сповіщень немає')} title="Сповіщення">
            <BellSvg />
          </IconBtn>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} style={s.searchRow}>
        <div style={s.searchWrap}>
          <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="var(--text-secondary)" strokeWidth="2" /><path d="M21 21l-4-4" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" /></svg>
          <input
            style={s.searchInput}
            placeholder="Пошук товарів..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Link to="/search" style={s.filterBtn} title="Фільтри">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M7 12h10M10 18h4" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
        </Link>
      </form>

      {/* Hero Banner */}
      <div style={s.banner}>
        <div style={{ flex: 1 }}>
          <div style={s.bannerTitle}>Знайди все, що потрібно.<br /><span style={{ color: 'var(--accent)' }}>Продай те, що набридло.</span></div>
          <div style={s.bannerSub}>Легко, швидко та безпечно з DealX</div>
          <Link className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', width: 'auto', padding: '10px 12px', fontSize: 12, whiteSpace: 'nowrap', marginTop: 20 }} to="/add">
            + Додати оголошення
          </Link>
        </div>
        <div style={{ fontSize: 60, alignSelf: 'center' }}>🛋️</div>
      </div>

      {/* Categories */}
      <div style={s.section}>
        <div style={s.sectionHeader}>
          <span style={s.sectionTitle}>Категорії</span>
          <Link style={s.seeAllBtn} to="/categories">Усі ›</Link>
        </div>
        <div className="home-categories" style={s.catRow}>
          {CATEGORIES.slice(0, 5).map(cat => (
            <Link key={cat.id} style={s.catItem} to="/categories" state={{ cat: cat.name }}>
              <div style={s.catIcon}>{cat.icon}</div>
              <span style={s.catLabel}>{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recommended */}
      <div style={s.section}>
        <div style={s.sectionHeader}>
          <span style={s.sectionTitle}>Рекомендовані оголошення</span>
          <Link style={s.seeAllBtn} to="/search">Усі ›</Link>
        </div>
        <div className="home-recommendations" style={s.grid}>
          {listings.slice(0, 3).map(item => (
            <div key={item.id} style={{ ...s.itemCard, cursor: 'pointer' }}>
              <div style={{ position: 'relative' }}>
                <Link to={`/product/${item.id}`}><OptimizedImage src={item.images[0]} alt={item.title} style={s.itemImg} /></Link>
                <button
                  style={{ ...s.heartBtn, color: isFavorite(item.id) ? 'var(--danger)' : '#fff' }}
                  onClick={e => toggleFavorite(item.id, e)}
                >
                  {isFavorite(item.id) ? '❤️' : '🤍'}
                </button>
              </div>
              <Link to={`/product/${item.id}`} style={{ display: 'block' }}><div style={s.itemBody}>
                <div style={s.itemPrice}>{item.price.toLocaleString('uk-UA')} грн</div>
                <div style={s.itemTitle}>{item.title}</div>
                <div style={s.itemLocation}>{item.location}</div>
              </div></Link>
            </div>
          ))}
        </div>
      </div>

      {/* All listings */}
      <div style={s.section}>
        <div style={s.sectionHeader}>
          <span style={s.sectionTitle}>Всі оголошення</span>
        </div>
        <div className="home-listings" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {listings.map(item => (
            <div key={item.id} style={{ ...s.listItem, cursor: 'pointer' }}>
              <Link to={`/product/${item.id}`} style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 1, minWidth: 0 }}>
                <OptimizedImage src={item.images[0]} alt={item.title} style={s.listImg} />
                <div style={s.listBody}>
                <div style={s.itemTitle}>{item.title}</div>
                <div style={{ ...s.itemPrice, fontSize: 15 }}>{item.price.toLocaleString('uk-UA')} грн</div>
                {item.negotiable && <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Договірна</span>}
                <div style={s.itemLocation}>{item.location}</div>
                </div>
              </Link>
              <button style={s.heartBtnSm} onClick={e => toggleFavorite(item.id, e)}>
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
  const props = { title, onClick, style: { background: 'none', padding: 4, display: 'flex', alignItems: 'center' } }
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

const s = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 16px 8px' },
  logo: { fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: -0.5 },
  location: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 },
  searchRow: { display: 'flex', gap: 10, padding: '0 16px 16px', alignItems: 'center' },
  searchWrap: { flex: 1, position: 'relative' },
  searchInput: { width: '100%', padding: '10px 12px 10px 38px', borderRadius: 10, fontSize: 14, background: 'var(--bg-card)', border: '1px solid var(--border)', color: '#fff' },
  filterBtn: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 },
  banner: { margin: '0 16px 20px', background: 'var(--bg-card)', borderRadius: 14, padding: '20px 18px', display: 'flex', gap: 16, overflow: 'hidden' },
  bannerTitle: { fontSize: 18, fontWeight: 700, lineHeight: 1.3, color: '#fff' },
  bannerSub: { fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 },
  section: { padding: '0 16px 20px' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: 600, color: '#fff' },
  seeAllBtn: { background: 'none', color: 'var(--accent)', fontSize: 14, fontWeight: 500 },
  catRow: { display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 },
  catItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 14px', flexShrink: 0, cursor: 'pointer', minWidth: 72 },
  catIcon: { fontSize: 24 },
  catLabel: { fontSize: 11, color: 'var(--text-secondary)', textAlign: 'center', whiteSpace: 'nowrap' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 },
  itemCard: { background: 'var(--bg-card)', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', cursor: 'pointer', textAlign: 'left', position: 'relative' },
  itemImg: { width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' },
  heartBtn: { position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.3)', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, cursor: 'pointer', border: 'none' },
  itemBody: { padding: '8px 10px 10px' },
  itemPrice: { fontSize: 14, fontWeight: 700, color: 'var(--accent)' },
  itemTitle: { fontSize: 13, color: '#fff', marginTop: 2, fontWeight: 500 },
  itemLocation: { fontSize: 11, color: 'var(--text-secondary)', marginTop: 3 },
  listItem: { display: 'flex', gap: 12, background: 'var(--bg-card)', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', cursor: 'pointer', textAlign: 'left', alignItems: 'center', padding: '0 12px 0 0' },
  listImg: { width: 90, height: 90, objectFit: 'cover', flexShrink: 0 },
  listBody: { flex: 1, padding: '10px 0', display: 'flex', flexDirection: 'column', gap: 2 },
  heartBtnSm: { background: 'none', border: 'none', fontSize: 16, cursor: 'pointer', flexShrink: 0 },
}
