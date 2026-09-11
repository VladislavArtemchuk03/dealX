import { useParams, useNavigate } from 'react-router-dom'
import { useProduct } from '../hooks/useProduct'
import OptimizedImage from '../components/OptimizedImage'
import styles from './ProductPage.module.css'

export default function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    item,
    activeImage, setActiveImage, prevImage, nextImage,
    isLiked, toggleLike,
    showDelivery, setShowDelivery,
    showAllSpecs, setShowAllSpecs,
    visibleSpecs, specs,
  } = useProduct(id)

  const handleShare = async () => {
    const shareData = { title: item?.title || 'Оголошення DealX', url: window.location.href }
    try {
      if (navigator.share) await navigator.share(shareData)
      else {
        await navigator.clipboard.writeText(shareData.url)
        alert('Посилання скопійовано')
      }
    } catch {
      // Sharing can be cancelled by the user.
    }
  }

  if (!item) return <div className={styles.notFound}>Товар не знайдено</div>

  return (
    <div className={styles.page}>
      {/* Top bar */}
      <div className={styles.topBar}>
          <button className={styles.backBtn} onClick={() => navigate(-1)} aria-label="Назад">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div className={styles.topActions}>
          <button className={styles.iconBtn} onClick={toggleLike} title="До обраних" aria-label="До обраних">
            <svg width="22" height="22" viewBox="0 0 24 24" fill={isLiked ? 'var(--danger)' : 'none'}>
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke={isLiked ? 'var(--danger)' : 'white'} strokeWidth="1.8" />
            </svg>
          </button>
          <button className={styles.iconBtn} onClick={handleShare} title="Поділитися" aria-label="Поділитися">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="18" cy="5" r="3" stroke="white" strokeWidth="1.8" /><circle cx="6" cy="12" r="3" stroke="white" strokeWidth="1.8" /><circle cx="18" cy="19" r="3" stroke="white" strokeWidth="1.8" /><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke="white" strokeWidth="1.8" /></svg>
          </button>
        </div>
      </div>

      {/* Image gallery */}
      <div className={styles.gallery}>
        <OptimizedImage src={item.images[activeImage]} alt={item.title} loading="eager" fetchPriority="high" className={styles.mainImg} />
        {item.images.length > 1 && (
          <>
            <button className={styles.arrowLeft} onClick={prevImage} aria-label="Попереднє фото">‹</button>
            <button className={styles.arrowRight} onClick={nextImage} aria-label="Наступне фото">›</button>
            <div className={styles.dots}>
              {item.images.map((_, i) => (
                <button key={i} className={styles.dot} data-active={i === activeImage || undefined} onClick={() => setActiveImage(i)} aria-label={`Фото ${i + 1}`} aria-current={i === activeImage ? 'true' : undefined} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {item.images.length > 1 && (
        <div className={styles.thumbRow}>
          {item.images.map((img, i) => (
            <button key={i} className={styles.thumb} data-active={i === activeImage || undefined} onClick={() => setActiveImage(i)} aria-label={`Фото ${i + 1}`} aria-current={i === activeImage ? 'true' : undefined}>
              <OptimizedImage src={img} alt="" className={styles.thumbImage} />
            </button>
          ))}
        </div>
      )}

      <div className={styles.content}>
        {/* Title & Price */}
        <h1 className={styles.title}>{item.title}</h1>
        <div className={styles.price}>{item.price.toLocaleString('uk-UA')} грн</div>
        {item.negotiable && <div className={styles.negotiable}>Договірна</div>}
        <div className={styles.location}>{item.location}</div>

        {/* Actions */}
        <div className={styles.actions}>
          <button className="btn-primary" onClick={() => setShowDelivery(true)}>
            🚚 Купити з доставкою
          </button>
          <button className="btn-outline" onClick={() => navigate(`/chat/${item.id}`)}>
            ✉️ Написати продавцю
          </button>
        </div>

        {/* Seller */}
        <button className={styles.sellerCard} onClick={() => navigate(`/chat/${item.id}`)} aria-label={`Написати продавцю ${item.seller.name}`}>
          <OptimizedImage src={item.seller.avatar} alt={item.seller.name} className={styles.avatar} />
          <div className={styles.sellerInfo}>
            <div className={styles.sellerName}>{item.seller.name}</div>
            <div className={styles.sellerSince}>На сайті з {item.seller.since}</div>
            <div className={styles.rating}>
              <span className={styles.star}>★</span>
              <span className={styles.ratingValue}>{item.seller.rating}</span>
              <span className={styles.reviewCount}>({item.seller.reviews} відгуки)</span>
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>

        {/* Characteristics */}
        <div className={styles.specsCard}>
          <div className={styles.sectionHeading}>Характеристики</div>
          {visibleSpecs.map(sp => (
            <div key={sp.label} className={styles.specRow}>
              <span className={styles.specLabel}>{sp.label}</span>
              <span className={styles.specVal}>{sp.value}</span>
            </div>
          ))}
          {specs.length > 4 && (
            <button className={styles.moreBtn} onClick={() => setShowAllSpecs(p => !p)}>
              {showAllSpecs ? 'Приховати ›' : 'Показати всі характеристики ›'}
            </button>
          )}
        </div>

        {/* Description */}
        <div className={styles.specsCard}>
          <div className={`${styles.sectionHeading} ${styles.descriptionHeading}`}>Опис</div>
          <p className={styles.description}>{item.description}</p>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <span>👁 {item.views} переглядів</span>
          <span>❤️ {item.likes} в обраних</span>
        </div>
      </div>

      {/* Contact modal — replaced by SellerChatPage, kept for delivery only */}

      {/* Delivery modal */}
      {showDelivery && (
        <Modal onClose={() => setShowDelivery(false)} title="Замовити доставку">
          <div className={styles.deliveryDescription}>
            Доставка Новою поштою або Укрпоштою. Відправлення після оплати.
          </div>
          <div className={styles.specRow}><span className={styles.specLabel}>Товар</span><span className={styles.specVal}>{item.title}</span></div>
          <div className={styles.specRow}><span className={styles.specLabel}>Ціна</span><span className={`${styles.specVal} ${styles.deliveryPrice}`}>{item.price.toLocaleString('uk-UA')} грн</span></div>
          <div className={styles.specRow}><span className={styles.specLabel}>Доставка</span><span className={styles.specVal}>~80-120 грн</span></div>
          <button className={`btn-primary ${styles.confirmButton}`} onClick={() => { setShowDelivery(false); alert('Замовлення оформлено!') }}>
            Підтвердити замовлення
          </button>
        </Modal>
      )}
    </div>
  )
}

function Modal({ onClose, title, children }) {
  return (
    <div className={styles.modal} role="dialog" aria-modal="true" aria-label={title}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <span className={styles.modalTitle}>{title}</span>
          <button onClick={onClose} className={styles.closeModal} aria-label="Закрити">×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

