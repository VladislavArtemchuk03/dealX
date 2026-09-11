import { Link, useNavigate } from 'react-router-dom'
import { useViewHistory } from '../hooks/useViewHistory'
import OptimizedImage from '../components/OptimizedImage'
import styles from './ViewedPage.module.css'

export default function ViewedPage() {
  const navigate = useNavigate()
  const { items, clear } = useViewHistory()

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
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
          <div className={styles.emptyIcon}>👁</div>
          <div className={styles.emptyTitle}>Немає переглянутих товарів</div>
          <div className={styles.emptyDescription}>Відкрийте будь-яке оголошення, і воно з'явиться тут</div>
          <Link className={`btn-primary ${styles.emptyAction}`} to="/home">
            Перейти до оголошень
          </Link>
        </div>
      ) : (
        <div className={styles.list}>
          <div className={styles.listCount}>
            {items.length} {plural(items.length, 'товар', 'товари', 'товарів')}
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
              <svg className={styles.chevron} width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" /></svg>
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
