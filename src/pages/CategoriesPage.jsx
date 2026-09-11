import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CATEGORIES } from '../data/listings'
import { getAllListings } from '../store/listingsStore'
import OptimizedImage from '../components/OptimizedImage'

export default function CategoriesPage() {
  const location = useLocation()
  const [selected, setSelected] = useState(location.state?.cat || null)
  const listings = getAllListings()

  const filtered = selected ? listings.filter(l => l.category === selected) : []

  return (
    <div className="page categories-page" style={{ background: 'var(--bg)' }}>
      <div style={s.header}>
        <span style={s.title}>{selected ? (
          <button style={s.backInline} onClick={() => setSelected(null)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
            {selected}
          </button>
        ) : 'Категорії'}</span>
      </div>

      {!selected ? (
        <div className="categories-grid" style={s.catGrid}>
          {CATEGORIES.map(cat => (
            <button key={cat.id} style={s.catCard} onClick={() => setSelected(cat.name)}>
              <div style={s.catIcon}>{cat.icon}</div>
              <div style={s.catName}>{cat.name}</div>
              <div style={s.catCount}>{listings.filter(item => item.category === cat.name).length.toLocaleString('uk-UA')} оголошень</div>
            </button>
          ))}
        </div>
      ) : (
        <div className="category-results" style={{ padding: '0 16px' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: 60, color: 'var(--text-secondary)' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
              <div>Немає оголошень у цій категорії</div>
              <button className="btn-primary" style={{ marginTop: 20 }} onClick={() => setSelected(null)}>← Всі категорії</button>
            </div>
          ) : (
            <>
              <div style={{ color: 'var(--text-secondary)', fontSize: 13, padding: '12px 0 16px' }}>{filtered.length} оголошень</div>
              <div className="category-listings" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {filtered.map(item => (
                  <Link key={item.id} to={`/product/${item.id}`} style={s.listItem}>
                    <OptimizedImage src={item.images[0]} alt={item.title} style={s.listImg} />
                    <div style={s.listBody}>
                      <div style={s.itemTitle}>{item.title}</div>
                      <div style={s.itemPrice}>{item.price.toLocaleString('uk-UA')} грн</div>
                      {item.negotiable && <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Договірна</span>}
                      <div style={s.itemLoc}>{item.location}</div>
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

const s = {
  header: { padding: '16px 16px 12px', borderBottom: '1px solid var(--border)' },
  title: { fontSize: 20, fontWeight: 700, display: 'block' },
  backInline: { display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: '#fff', fontSize: 18, fontWeight: 700, cursor: 'pointer', padding: 0 },
  catGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: 16 },
  catCard: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px 14px', textAlign: 'left', cursor: 'pointer', transition: 'border-color 0.2s' },
  catIcon: { fontSize: 28, marginBottom: 8 },
  catName: { fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 4 },
  catCount: { fontSize: 12, color: 'var(--text-secondary)' },
  listItem: { display: 'flex', gap: 12, background: 'var(--bg-card)', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', cursor: 'pointer', textAlign: 'left', alignItems: 'center', paddingRight: 12 },
  listImg: { width: 90, height: 90, objectFit: 'cover', flexShrink: 0 },
  listBody: { flex: 1, padding: '10px 0', display: 'flex', flexDirection: 'column', gap: 2 },
  itemTitle: { fontSize: 14, fontWeight: 600, color: '#fff' },
  itemPrice: { fontSize: 15, fontWeight: 700, color: 'var(--accent)' },
  itemLoc: { fontSize: 11, color: 'var(--text-secondary)' },
}
