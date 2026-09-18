import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Heart, Search } from 'lucide-react'
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
    <div className={`page search-page ${styles.dealxSearchMain}`}>
      {/* Пошуковий рядок */}
      <div className={styles.searchBar}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft aria-hidden="true" size={20} strokeWidth={1.8} />
        </button>
        <div className={styles.searchInputWrap}>
          <Search className={styles.searchIcon} aria-hidden="true" size={16} strokeWidth={1.8} />
          <input
            className={styles.searchInput}
            placeholder="Пошук товарів..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      {/* Сортування */}
      <div className={styles.sortRow}>
        <span className={styles.resultCount}>{resultLabel(results.length)}</span>
        <div className={styles.sortControls}>
          {hasActiveFilters && (
            <button className={styles.resetBtn} onClick={clearFilters}>
              Скинути
            </button>
          )}
          <select className={styles.sortSelect} value={sort} onChange={e => setSort(e.target.value)}>
            <option value="new">Нові товари</option>
            <option value="popular">Популярні товари</option>
            <option value="price_desc">Дорожчі товари</option>
            <option value="price_asc">Дешевші товари</option>
          </select>
        </div>
      </div>

      {/* Результати */}
      <div className={`search-results ${styles.results}`}>
        {results.length === 0 && (
          <div className={styles.emptyResults}>
            <Search className={styles.emptyIcon} aria-hidden="true" />
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
              <Heart aria-hidden="true" size={20} fill={isFavorite(item.id) ? 'var(--danger)' : 'none'} stroke={isFavorite(item.id) ? 'var(--danger)' : 'currentColor'} />
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
