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
    <div className={`page category-app ${styles.categoryApp}`}>
      <div className={`category-header ${styles.categoryHeader}`}>
        <span className={`category-title ${styles.categoryTitle}`}>{selected ? (
          <button className={`category-back ${styles.categoryBack}`} onClick={() => setSelected(null)}>
            <ArrowLeft aria-hidden="true" size={18} strokeWidth={1.8} />
            {selected}
          </button>
        ) : 'Категорії'}</span>
      </div>

      {!selected ? (
        <div className={`category-grid ${styles.categoryGrid}`}>
          {CATEGORIES.map((cat, index) => (
            <button key={cat.id} className={`category-card ${styles.categoryCard}`} onClick={() => setSelected(cat.name)}>
              <span className={`category-icon ${styles.categoryIcon} ${styles[`categoryIconTone${(index % 5) + 1}`]}`}>
                <CategoryIcon category={cat.name} size={22} />
              </span>
              <div className={`category-name ${styles.categoryName}`}>{cat.name}</div>
              <div className={`category-count ${styles.categoryCount}`}>{listings.filter(item => item.category === cat.name).length.toLocaleString('uk-UA')} оголошень</div>
            </button>
          ))}
        </div>
      ) : (
        <div className={`category-results ${styles.categoryResults}`}>
          {filtered.length === 0 ? (
            <div className={`category-empty-results ${styles.categoryEmptyResults}`}>
              <Search className={`category-empty-icon ${styles.categoryEmptyIcon}`} aria-hidden="true" size={40} />
              <div>Немає оголошень у цій категорії</div>
              <button className={`btn-primary category-all-button ${styles.categoryAllButton}`} onClick={() => setSelected(null)}>← Всі категорії</button>
            </div>
          ) : (
            <>
              <div className={`category-results-count ${styles.categoryResultsCount}`}>{filtered.length} оголошень</div>
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
