import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSearch } from '../hooks/useSearch'
import { useFavorites } from '../hooks/useFavorites'
import OptimizedImage from '../components/OptimizedImage'

export default function SearchPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { query, setQuery, sort, setSort, results, clearFilters, hasActiveFilters } = useSearch(location.state?.query || '')
  const { isFavorite, toggleFavorite } = useFavorites()

  return (
    <div className="page search-page" style={{ background: 'var(--bg)' }}>
      {/* Search bar */}
      <div style={s.searchBar}>
        <button style={s.backBtn} onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
        <div style={{ flex: 1, position: 'relative' }}>
          <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="var(--text-secondary)" strokeWidth="2" /><path d="M21 21l-4-4" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" /></svg>
          <input
            style={s.searchInput}
            placeholder="Пошук товарів..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      {/* Sort */}
      <div style={s.sortRow}>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{resultLabel(results.length)}</span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {hasActiveFilters && (
            <button style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 12, cursor: 'pointer' }} onClick={clearFilters}>
              Скинути
            </button>
          )}
          <select style={{ ...s.sortSelect }} value={sort} onChange={e => setSort(e.target.value)}>
            <option value="new">Новіші</option>
            <option value="price_asc">Ціна ↑</option>
            <option value="price_desc">Ціна ↓</option>
            <option value="popular">Популярні</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="search-results" style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {results.length === 0 && (
          <div style={{ textAlign: 'center', paddingTop: 60, color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: 40 }}>🔍</div>
            <div style={{ marginTop: 12 }}>Нічого не знайдено</div>
          </div>
        )}
        {results.map(item => (
          <div key={item.id} style={s.card}>
            <Link to={`/product/${item.id}`} style={s.cardLink}>
              <OptimizedImage src={item.images[0]} alt={item.title} style={s.img} />
              <div style={s.body}>
                <div style={s.itemTitle}>{item.title}</div>
                <div style={s.itemPrice}>{item.price.toLocaleString('uk-UA')} грн</div>
                {item.negotiable && <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Договірна</span>}
                <div style={s.itemLoc}>{item.location}</div>
              </div>
            </Link>
            <button style={s.likeBtn} onClick={e => toggleFavorite(item.id, e)}>
              {isFavorite(item.id) ? '❤️' : '🤍'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function resultLabel(count) {
  if (count % 10 === 1 && count % 100 !== 11) return `${count} результат`
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return `${count} результати`
  return `${count} результатів`
}

const s = {
  searchBar: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: '1px solid var(--border)' },
  backBtn: { background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  searchInput: { width: '100%', padding: '10px 12px 10px 38px', borderRadius: 10, fontSize: 14 },
  sortRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px' },
  sortSelect: { padding: '6px 10px', borderRadius: 8, fontSize: 13, background: 'var(--bg-card)' },
  card: { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 42px', alignItems: 'stretch', background: 'var(--bg-card)', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', cursor: 'pointer', textAlign: 'left' },
  cardLink: { display: 'grid', gridTemplateColumns: '90px minmax(0, 1fr)', alignItems: 'center', gap: 12, minWidth: 0 },
  img: { width: 90, height: 90, objectFit: 'cover', flexShrink: 0 },
  body: { flex: 1, minWidth: 0, padding: '10px 0' },
  itemTitle: { display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden', overflowWrap: 'break-word', hyphens: 'auto', fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 3 },
  itemPrice: { fontSize: 15, fontWeight: 700, color: 'var(--accent)', marginBottom: 2 },
  itemLoc: { fontSize: 11, color: 'var(--text-secondary)', marginTop: 3 },
  likeBtn: { width: 42, background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 },
}
