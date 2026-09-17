import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft, Search } from 'lucide-react'
import { CATEGORIES } from '../data/listings'
import { getAllListings } from '../store/listingsStore'
import CategoryIcon from '../components/CategoryIcon'
import OptimizedImage from '../components/OptimizedImage'
import styles from './CategoriesPage.module.css'

export default function CategoriesPage() {
  const location = useLocation()
  const [selected, setSelected] = useState(location.state?.cat || null)
  const listings = getAllListings()

  const filtered = selected ? listings.filter(l => l.category === selected) : []

  return (
    <div className={`page categories-page ${styles.dealxCategoriesMain}`}>
      <div className={styles.header}>
        <span className={styles.title}>{selected ? (
          <button className={styles.backInline} onClick={() => setSelected(null)}>
            <ArrowLeft aria-hidden="true" size={18} strokeWidth={1.8} />
            {selected}
          </button>
        ) : 'Категорії'}</span>
      </div>

      {!selected ? (
        <div className={`categories-grid ${styles.categoryGrid}`}>
          {CATEGORIES.map(cat => (
            <button key={cat.id} className={styles.categoryCard} onClick={() => setSelected(cat.name)}>
              <CategoryIcon category={cat.name} className={styles.categoryIcon} size={28} />
              <div className={styles.categoryName}>{cat.name}</div>
              <div className={styles.categoryCount}>{listings.filter(item => item.category === cat.name).length.toLocaleString('uk-UA')} оголошень</div>
            </button>
          ))}
        </div>
      ) : (
        <div className={`category-results ${styles.results}`}>
          {filtered.length === 0 ? (
            <div className={styles.emptyResults}>
              <Search className={styles.emptyIcon} aria-hidden="true" size={40} />
              <div>Немає оголошень у цій категорії</div>
              <button className={`btn-primary ${styles.allCategoriesBtn}`} onClick={() => setSelected(null)}>← Всі категорії</button>
            </div>
          ) : (
            <>
              <div className={styles.resultsCount}>{filtered.length} оголошень</div>
              <div className={`category-listings ${styles.listings}`}>
                {filtered.map(item => (
                  <Link key={item.id} to={`/product/${item.id}`} className={styles.listItem}>
                    <OptimizedImage src={item.images[0]} alt={item.title} className={styles.listImage} />
                    <div className={styles.listBody}>
                      <div className={styles.itemTitle}>{item.title}</div>
                      <div className={styles.itemPrice}>{item.price.toLocaleString('uk-UA')} грн</div>
                      {item.negotiable && <span className={styles.negotiable}>Договірна</span>}
                      <div className={styles.itemLocation}>{item.location}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
