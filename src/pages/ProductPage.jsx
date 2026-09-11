import { useParams, useNavigate } from 'react-router-dom'
import { useProduct } from '../hooks/useProduct'
import OptimizedImage from '../components/OptimizedImage'

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

  if (!item) return <div style={{ padding: 32, color: 'var(--text-secondary)' }}>Товар не знайдено</div>

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 30 }}>
      {/* Top bar */}
      <div style={s.topBar}>
          <button style={s.backBtn} onClick={() => navigate(-1)} aria-label="Назад">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={s.iconBtn} onClick={toggleLike} title="До обраних" aria-label="До обраних">
            <svg width="22" height="22" viewBox="0 0 24 24" fill={isLiked ? 'var(--danger)' : 'none'}>
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke={isLiked ? 'var(--danger)' : 'white'} strokeWidth="1.8" />
            </svg>
          </button>
          <button style={s.iconBtn} onClick={handleShare} title="Поділитися" aria-label="Поділитися">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="18" cy="5" r="3" stroke="white" strokeWidth="1.8" /><circle cx="6" cy="12" r="3" stroke="white" strokeWidth="1.8" /><circle cx="18" cy="19" r="3" stroke="white" strokeWidth="1.8" /><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke="white" strokeWidth="1.8" /></svg>
          </button>
        </div>
      </div>

      {/* Image gallery */}
      <div style={{ position: 'relative', background: 'var(--bg-elevated)' }}>
        <OptimizedImage src={item.images[activeImage]} alt={item.title} loading="eager" fetchPriority="high" style={s.mainImg} />
        {item.images.length > 1 && (
          <>
            <button style={s.arrowLeft} onClick={prevImage} aria-label="Попереднє фото">‹</button>
            <button style={s.arrowRight} onClick={nextImage} aria-label="Наступне фото">›</button>
            <div style={s.dots}>
              {item.images.map((_, i) => (
                <button key={i} style={{ ...s.dot, background: i === activeImage ? 'var(--accent)' : 'var(--text-secondary)' }} onClick={() => setActiveImage(i)} aria-label={`Фото ${i + 1}`} aria-current={i === activeImage ? 'true' : undefined} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {item.images.length > 1 && (
        <div style={s.thumbRow}>
          {item.images.map((img, i) => (
            <button key={i} style={{ ...s.thumb, border: i === activeImage ? '2px solid var(--accent)' : '2px solid transparent' }} onClick={() => setActiveImage(i)} aria-label={`Фото ${i + 1}`} aria-current={i === activeImage ? 'true' : undefined}>
              <OptimizedImage src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      )}

      <div style={{ padding: '16px 16px 0' }}>
        {/* Title & Price */}
        <h1 style={s.title}>{item.title}</h1>
        <div style={s.price}>{item.price.toLocaleString('uk-UA')} грн</div>
        {item.negotiable && <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>Договірна</div>}
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>{item.location}</div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          <button className="btn-primary" onClick={() => setShowDelivery(true)}>
            🚚 Купити з доставкою
          </button>
          <button className="btn-outline" onClick={() => navigate(`/chat/${item.id}`)}>
            ✉️ Написати продавцю
          </button>
        </div>

        {/* Seller */}
        <button style={s.sellerCard} onClick={() => navigate(`/chat/${item.id}`)} aria-label={`Написати продавцю ${item.seller.name}`}>
          <OptimizedImage src={item.seller.avatar} alt={item.seller.name} style={s.avatar} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{item.seller.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>На сайті з {item.seller.since}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
              <span style={{ color: 'var(--star)', fontSize: 14 }}>★</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{item.seller.rating}</span>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>({item.seller.reviews} відгуки)</span>
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>

        {/* Characteristics */}
        <div style={s.specsCard}>
          <div style={{ fontWeight: 600, marginBottom: 12 }}>Характеристики</div>
          {visibleSpecs.map(sp => (
            <div key={sp.label} style={s.specRow}>
              <span style={s.specLabel}>{sp.label}</span>
              <span style={s.specVal}>{sp.value}</span>
            </div>
          ))}
          {specs.length > 4 && (
            <button style={s.moreBtn} onClick={() => setShowAllSpecs(p => !p)}>
              {showAllSpecs ? 'Приховати ›' : 'Показати всі характеристики ›'}
            </button>
          )}
        </div>

        {/* Description */}
        <div style={s.specsCard}>
          <div style={{ fontWeight: 600, marginBottom: 10 }}>Опис</div>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.description}</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-secondary)', padding: '8px 0 24px' }}>
          <span>👁 {item.views} переглядів</span>
          <span>❤️ {item.likes} в обраних</span>
        </div>
      </div>

      {/* Contact modal — replaced by SellerChatPage, kept for delivery only */}

      {/* Delivery modal */}
      {showDelivery && (
        <Modal onClose={() => setShowDelivery(false)} title="Замовити доставку">
          <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
            Доставка Новою поштою або Укрпоштою. Відправлення після оплати.
          </div>
          <div style={s.specRow}><span style={s.specLabel}>Товар</span><span style={s.specVal}>{item.title}</span></div>
          <div style={s.specRow}><span style={s.specLabel}>Ціна</span><span style={{ ...s.specVal, color: 'var(--accent)', fontWeight: 700 }}>{item.price.toLocaleString('uk-UA')} грн</span></div>
          <div style={s.specRow}><span style={s.specLabel}>Доставка</span><span style={s.specVal}>~80-120 грн</span></div>
          <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => { setShowDelivery(false); alert('Замовлення оформлено!') }}>
            Підтвердити замовлення
          </button>
        </Modal>
      )}
    </div>
  )
}

function Modal({ onClose, title, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'flex-end', maxWidth: 430, margin: '0 auto' }} role="dialog" aria-modal="true" aria-label={title}>
      <div style={{ background: 'var(--bg-card)', borderRadius: '16px 16px 0 0', width: '100%', padding: '20px 16px 30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <span style={{ fontWeight: 700, fontSize: 16 }}>{title}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, color: 'var(--text-secondary)', cursor: 'pointer' }} aria-label="Закрити">×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

const s = {
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, zIndex: 10 },
  backBtn: { background: 'rgba(0,0,0,0.4)', border: 'none', borderRadius: '50%', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  iconBtn: { background: 'rgba(0,0,0,0.4)', border: 'none', borderRadius: '50%', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  mainImg: { width: '100%', aspectRatio: '16 / 9', objectFit: 'cover', display: 'block' },
  arrowLeft: { position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.4)', border: 'none', color: '#fff', fontSize: 28, width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 },
  arrowRight: { position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.4)', border: 'none', color: '#fff', fontSize: 28, width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 },
  dots: { position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: '50%', border: 'none', cursor: 'pointer', padding: 0 },
  thumbRow: { display: 'flex', gap: 8, padding: '10px 16px' },
  thumb: { width: 56, height: 56, borderRadius: 8, overflow: 'hidden', padding: 0, cursor: 'pointer', flexShrink: 0 },
  title: { fontSize: 20, fontWeight: 700, marginBottom: 8 },
  price: { fontSize: 24, fontWeight: 800, color: 'var(--accent)', marginBottom: 4 },
  sellerCard: { display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-card)', borderRadius: 12, padding: '12px 14px', marginBottom: 14, width: '100%', border: '1px solid var(--border)', cursor: 'pointer', textAlign: 'left' },
  avatar: { width: 46, height: 46, borderRadius: '50%', objectFit: 'cover' },
  specsCard: { background: 'var(--bg-card)', borderRadius: 12, padding: '14px', marginBottom: 14, border: '1px solid var(--border)' },
  specRow: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' },
  specLabel: { fontSize: 13, color: 'var(--text-secondary)' },
  specVal: { fontSize: 13, fontWeight: 500 },
  moreBtn: { background: 'none', border: 'none', color: 'var(--accent)', fontSize: 13, cursor: 'pointer', marginTop: 10, padding: 0 },
}
