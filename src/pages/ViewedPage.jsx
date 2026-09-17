import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronRight, Eye } from 'lucide-react'
import { useViewHistory } from '../hooks/useViewHistory'
import OptimizedImage from '../components/OptimizedImage'
import styles from './ViewedPage.module.css'

export default function ViewedPage() {
  const navigate = useNavigate()
  const { items, clear } = useViewHistory()

  return (
    <div className={styles.dealxViewedMain}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft aria-hidden="true" size={20} strokeWidth={1.8} />
        </button>
        <span className={styles.title}>Переглянуті</span>
        {items.length > 0 && (
          <button className={styles.clearBtn} onClick={() => { if (confirm('Очистити історію?')) clear() }}>
            Очистити
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className={styles.empty}>
          <Eye className={styles.emptyIcon} aria-hidden="true" />
          <div className={styles.emptyTitle}>Немає переглянутих товарів</div>
          <div className={styles.emptyDescription}>Відкрийте будь-яке оголошення, і воно з'явиться тут</div>
          <Link className={`btn-primary ${styles.emptyAction}`} to="/home">
            Перейти до оголошень
          </Link>
        </div>
      ) : (
        <div className={styles.list}>
          <div className={styles.listCount}>
            {plural(items.length, 'товар', 'товари', 'товарів')}
          </div>
          {items.map(item => (
            <Link key={item.id} to={`/product/${item.id}`} className={styles.card}>
              <OptimizedImage src={item.images[0]} alt={item.title} className={styles.image} />
              <div className={styles.body}>
                <div className={styles.itemTitle}>{item.title}</div>
                <div className={styles.itemPrice}>{item.price.toLocaleString('uk-UA')} грн</div>
                {item.negotiable && <span className={styles.negotiable}>Договірна</span>}
                <div className={styles.itemLocation}>{item.location}</div>
              </div>
              <ChevronRight className={styles.chevron} aria-hidden="true" size={16} strokeWidth={1.8} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function plural(n, one, few, many) {
  if (n % 10 === 1 && n % 100 !== 11) return `${n} ${one}`
  if ([2,3,4].includes(n % 10) && ![12,13,14].includes(n % 100)) return `${n} ${few}`
  return `${n} ${many}`
}
