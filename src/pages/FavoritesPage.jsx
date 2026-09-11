import { Link, useNavigate } from 'react-router-dom'
import { useFavorites } from '../hooks/useFavorites'
import { getAllListings } from '../store/listingsStore'
import OptimizedImage from '../components/OptimizedImage'
import styles from './FavoritesPage.module.css'

export default function FavoritesPage() {
  const navigate = useNavigate()
  const { favoriteIds, toggleFavorite } = useFavorites()
  const items = favoriteIds.map(id => getAllListings().find(l => l.id === id)).filter(Boolean)

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
        <span className={styles.title}>Обране</span>
        {items.length > 0 && <span className={styles.count}>{items.length}</span>}
      </div>

      {items.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>❤️</div>
          <div className={styles.emptyTitle}>Обране порожнє</div>
          <div className={styles.emptyDescription}>Натискайте ❤️ на товарах, щоб зберегти їх тут</div>
          <Link className={`btn-primary ${styles.emptyAction}`} to="/home">
            Перейти до оголошень
          </Link>
        </div>
      ) : (
        <div className={styles.list}>
          <div className={styles.listCount}>{items.length} збережених товарів</div>
          {items.map(item => (
            <div key={item.id} className={styles.card}>
              <Link className={styles.cardInner} to={`/product/${item.id}`}>
                <OptimizedImage src={item.images[0]} alt={item.title} className={styles.image} />
                <div className={styles.body}>
                  <div className={styles.itemTitle}>{item.title}</div>
                  <div className={styles.itemPrice}>{item.price.toLocaleString('uk-UA')} грн</div>
                  {item.negotiable && <span className={styles.negotiable}>Договірна</span>}
                  <div className={styles.itemLocation}>{item.location}</div>
                </div>
              </Link>
              <button className={styles.removeBtn} onClick={e => toggleFavorite(item.id, e)} title="Видалити з обраного">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--danger)">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="var(--danger)" strokeWidth="1.8" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
