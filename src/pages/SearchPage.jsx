import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSearch } from '../hooks/useSearch'
import { useFavorites } from '../hooks/useFavorites'
import OptimizedImage from '../components/OptimizedImage'
import styles from './SearchPage.module.css'

export default function SearchPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { query, setQuery, sort, setSort, results, clearFilters, hasActiveFilters } = useSearch(location.state?.query || '')
  const { isFavorite, toggleFavorite } = useFavorites()

  return (
    <div className={`page search-page ${styles.page}`}>
      {/* Search bar */}
      <div className={styles.searchBar}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
        <div className={styles.searchInputWrap}>
          <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="var(--text-secondary)" strokeWidth="2" /><path d="M21 21l-4-4" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" /></svg>
          <input
            className={styles.searchInput}
            placeholder="Пошук товарів..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      {/* Sort */}
      <div className={styles.sortRow}>
        <span className={styles.resultCount}>{resultLabel(results.length)}</span>
        <div className={styles.sortControls}>
          {hasActiveFilters && (
            <button className={styles.resetBtn} onClick={clearFilters}>
              Скинути
            </button>
          )}
          <select className={styles.sortSelect} value={sort} onChange={e => setSort(e.target.value)}>
            <option value="new">Новіші</option>
            <option value="price_asc">Ціна ↑</option>
            <option value="price_desc">Ціна ↓</option>
            <option value="popular">Популярні</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className={`search-results ${styles.results}`}>
        {results.length === 0 && (
          <div className={styles.emptyResults}>
            <div className={styles.emptyIcon}>🔍</div>
            <div className={styles.emptyMessage}>Нічого не знайдено</div>
          </div>
        )}
        {results.map(item => (
          <div key={item.id} className={styles.card}>
            <Link to={`/product/${item.id}`} className={styles.cardLink}>
              <OptimizedImage src={item.images[0]} alt={item.title} className={styles.image} />
              <div className={styles.body}>
                <div className={styles.itemTitle}>{item.title}</div>
                <div className={styles.itemPrice}>{item.price.toLocaleString('uk-UA')} грн</div>
                {item.negotiable && <span className={styles.negotiable}>Договірна</span>}
                <div className={styles.itemLocation}>{item.location}</div>
              </div>
            </Link>
            <button className={styles.likeBtn} onClick={e => toggleFavorite(item.id, e)}>
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
