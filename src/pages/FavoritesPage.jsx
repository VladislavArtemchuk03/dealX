import { Link, useNavigate } from 'react-router-dom'
import { useFavorites } from '../hooks/useFavorites'
import { getAllListings } from '../store/listingsStore'
import OptimizedImage from '../components/OptimizedImage'

export default function FavoritesPage() {
  const navigate = useNavigate()
  const { favoriteIds, toggleFavorite } = useFavorites()
  const items = favoriteIds.map(id => getAllListings().find(l => l.id === id)).filter(Boolean)

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>
      <div style={s.header}>
        <button style={s.backBtn} onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
        <span style={s.title}>Обране</span>
        {items.length > 0 && <span style={s.count}>{items.length}</span>}
      </div>

      {items.length === 0 ? (
        <div style={s.empty}>
          <div style={{ fontSize: 52 }}>❤️</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginTop: 16 }}>Обране порожнє</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8 }}>Натискайте ❤️ на товарах, щоб зберегти їх тут</div>
          <Link className="btn-primary" style={s.emptyAction} to="/home">
            Перейти до оголошень
          </Link>
        </div>
      ) : (
        <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>{items.length} збережених товарів</div>
          {items.map(item => (
            <div key={item.id} style={s.card}>
              <Link style={s.cardInner} to={`/product/${item.id}`}>
                <OptimizedImage src={item.images[0]} alt={item.title} style={s.img} />
                <div style={s.body}>
                  <div style={s.itemTitle}>{item.title}</div>
                  <div style={s.itemPrice}>{item.price.toLocaleString('uk-UA')} грн</div>
                  {item.negotiable && <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Договірна</span>}
                  <div style={s.itemLoc}>{item.location}</div>
                </div>
              </Link>
              <button style={s.removeBtn} onClick={e => toggleFavorite(item.id, e)} title="Видалити з обраного">
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

const s = {
  header: { display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: '1px solid var(--border)' },
  backBtn: { background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  title: { flex: 1, fontSize: 17, fontWeight: 600 },
  count: { background: 'var(--accent)', color: 'var(--bg)', fontSize: 11, fontWeight: 700, minWidth: 22, height: 22, borderRadius: 11, padding: '0 7px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '80px 32px 0' },
  emptyAction: { display: 'inline-flex', width: 'auto', marginTop: 24, alignItems: 'center', justifyContent: 'center' },
  card: { display: 'flex', alignItems: 'center', background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' },
  cardInner: { display: 'flex', alignItems: 'center', gap: 12, flex: 1, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' },
  img: { width: 80, height: 80, objectFit: 'cover', flexShrink: 0 },
  body: { padding: '10px 0', flex: 1 },
  itemTitle: { fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 3 },
  itemPrice: { fontSize: 15, fontWeight: 700, color: 'var(--accent)', marginBottom: 2 },
  itemLoc: { fontSize: 11, color: 'var(--text-secondary)', marginTop: 3 },
  removeBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '0 14px', height: 80, display: 'flex', alignItems: 'center' },
}
