import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart } from 'lucide-react'
import { useFavorites } from '../hooks/useFavorites'
import { getAllListings } from '../store/listingsStore'
import OptimizedImage from '../components/OptimizedImage'
import styles from './FavoritesPage.module.css'

export default function FavoritesPage() {
  const navigate = useNavigate()
  const { favoriteIds, toggleFavorite } = useFavorites()
  const items = favoriteIds.map(id => getAllListings().find(l => l.id === id)).filter(Boolean)

  return (
    <div className={styles.dealxFavoritesMain}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft aria-hidden="true" size={20} strokeWidth={1.8} />
        </button>
        <span className={styles.title}>Обране</span>
        {items.length > 0 && <span className={styles.count}>{items.length}</span>}
      </div>

      {items.length === 0 ? (
        <div className={styles.empty}>
          <Heart className={styles.emptyIcon} aria-hidden="true" />
          <div className={styles.emptyTitle}>Обране порожнє</div>
          <div className={styles.emptyDescription}>Додавайте товари до обраного, щоб зберегти їх тут</div>
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
                <Heart aria-hidden="true" size={20} fill="var(--danger)" stroke="var(--danger)" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
