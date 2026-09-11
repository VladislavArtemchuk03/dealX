import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { LISTINGS } from '../data/listings'
import { getAllUserListings, updateUserListing, deleteUserListing } from '../store/listingsStore'
import OptimizedImage from '../components/OptimizedImage'

function buildList() {
  const userOnes = getAllUserListings().map(l => ({ ...l, status: l.paused ? 'paused' : 'active', isUserListing: true }))
  const staticOnes = LISTINGS.map((l, i) => ({ ...l, status: i < 2 ? 'active' : i < 4 ? 'pending' : 'done', isUserListing: false }))
  return [...userOnes, ...staticOnes]
}

export default function MyListingsPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('active')
  const [menuOpen, setMenuOpen] = useState(null)
  const [list, setList] = useState(buildList)

  const refresh = useCallback(() => setList(buildList()), [])

  const active = list.filter(l => l.status === 'active')
  const paused = list.filter(l => l.status === 'paused')
  const pending = list.filter(l => l.status === 'pending')
  const done = list.filter(l => l.status === 'done')

  const tabs = [
    { key: 'active', label: `Активні (${active.length})` },
    { key: 'paused', label: `Призупинені (${paused.length})` },
    { key: 'pending', label: `Очікують (${pending.length})` },
    { key: 'done', label: `Завершені (${done.length})` },
  ]

  const filtered = { active, paused, pending, done }[tab] || []

  const handleMenu = (action, item) => {
    setMenuOpen(null)
    if (action === 'view') {
      navigate(`/product/${item.id}`)
    } else if (action === 'edit') {
      navigate(`/add`, { state: { editId: item.id } })
    } else if (action === 'pause') {
      if (item.isUserListing) {
        updateUserListing(item.id, { paused: true })
        refresh()
      } else {
        setList(prev => prev.map(l => l.id === item.id ? { ...l, status: 'paused' } : l))
      }
    } else if (action === 'resume') {
      if (item.isUserListing) {
        updateUserListing(item.id, { paused: false })
        refresh()
      } else {
        setList(prev => prev.map(l => l.id === item.id ? { ...l, status: 'active' } : l))
      }
    } else if (action === 'delete') {
      if (confirm(`Видалити оголошення "${item.title}"?\nЦю дію не можна скасувати.`)) {
        if (item.isUserListing) {
          deleteUserListing(item.id)
          refresh()
        } else {
          setList(prev => prev.filter(l => l.id !== item.id))
        }
      }
    } else if (action === 'promote') {
      alert(`Оголошення "${item.title}" підняте в пошуку! 🚀`)
    }
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 90 }}>
      {/* Header */}
      <div style={s.header}>
        <button style={s.backBtn} onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <span style={s.title}>Мої оголошення</span>
        <div style={{ width: 38 }} />
      </div>

      {/* Tabs */}
      <div style={s.tabs}>
        {tabs.map(t => (
          <button key={t.key} style={{ ...s.tabBtn, ...(tab === t.key ? s.tabActive : {}) }} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div style={{ padding: '0 16px' }}>
        {filtered.length === 0 ? (
          <div style={s.empty}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
            <div style={{ fontSize: 15, color: 'var(--text-secondary)' }}>Немає оголошень у цій категорії</div>
            <button className="btn-primary" style={{ marginTop: 20 }} onClick={() => navigate('/add')}>
              + Додати оголошення
            </button>
          </div>
        ) : (
          filtered.map(item => (
            <div key={item.id} style={s.card}>
              <button style={s.cardInner} onClick={() => navigate(`/product/${item.id}`)}>
                <OptimizedImage src={item.images[0]} alt={item.title} style={s.img} />
                <div style={s.info}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={s.itemTitle}>{item.title}</div>
                    {item.status === 'paused' && <span style={s.pausedBadge}>⏸ призупинено</span>}
                    {item.isUserListing && item.status === 'active' && <span style={s.newBadge}>• моє</span>}
                  </div>
                  <div style={s.itemPrice}>{item.price.toLocaleString('uk-UA')} грн</div>
                  <div style={s.stats}>
                    <span>👁 {item.views}</span>
                    <span>❤️ {item.likes}</span>
                  </div>
                </div>
              </button>
              <button style={s.moreBtn} onClick={e => { e.stopPropagation(); setMenuOpen(menuOpen === item.id ? null : item.id) }}>
                ⋮
              </button>
              {menuOpen === item.id && (
                <div style={s.dropdown}>
                  <button style={s.dropItem} onClick={() => handleMenu('view', item)}>👁 Переглянути</button>
                  {item.isUserListing && <button style={s.dropItem} onClick={() => handleMenu('edit', item)}>✏️ Редагувати</button>}
                  {item.status !== 'paused'
                    ? <button style={s.dropItem} onClick={() => handleMenu('pause', item)}>⏸️ Призупинити</button>
                    : <button style={{ ...s.dropItem, color: '#4caf50' }} onClick={() => handleMenu('resume', item)}>▶️ Відновити</button>
                  }
                  <button style={s.dropItem} onClick={() => handleMenu('promote', item)}>🚀 Підняти в пошуку</button>
                  <button style={{ ...s.dropItem, color: 'var(--danger)' }} onClick={() => handleMenu('delete', item)}>🗑️ Видалити</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, padding: '16px', background: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
        <button className="btn-primary" onClick={() => navigate('/add')}>+ Додати оголошення</button>
      </div>
    </div>
  )
}

const s = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid var(--border)' },
  backBtn: { background: 'none', border: 'none', cursor: 'pointer', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 17, fontWeight: 600 },
  tabs: { display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 8px', overflowX: 'auto', scrollbarWidth: 'none' },
  tabBtn: { flexShrink: 0, padding: '11px 10px', background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500, cursor: 'pointer', borderBottom: '2px solid transparent', whiteSpace: 'nowrap' },
  tabActive: { color: 'var(--accent)', borderBottom: '2px solid var(--accent)' },
  card: { position: 'relative', background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)', marginBottom: 10, marginTop: 10, overflow: 'visible' },
  cardInner: { display: 'flex', alignItems: 'center', width: 'calc(100% - 44px)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' },
  img: { width: 80, height: 80, objectFit: 'cover', borderRadius: '12px 0 0 12px', flexShrink: 0 },
  info: { padding: '10px 12px', flex: 1 },
  itemTitle: { fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 4 },
  itemPrice: { fontSize: 15, fontWeight: 700, color: 'var(--accent)', marginBottom: 4 },
  stats: { display: 'flex', gap: 10, fontSize: 12, color: 'var(--text-secondary)' },
  moreBtn: { position: 'absolute', right: 0, top: 0, height: '100%', width: 44, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  dropdown: { position: 'absolute', right: 44, top: 0, background: 'var(--bg-elevated)', borderRadius: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.4)', zIndex: 50, minWidth: 180, overflow: 'hidden', border: '1px solid var(--border)' },
  dropItem: { display: 'block', width: '100%', padding: '13px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 14, color: '#fff', borderBottom: '1px solid var(--border)' },
  pausedBadge: { fontSize: 10, background: 'rgba(255,100,0,0.15)', color: '#ff9500', borderRadius: 4, padding: '2px 6px', fontWeight: 600, flexShrink: 0 },
  newBadge: { fontSize: 10, background: 'rgba(255,183,3,0.15)', color: 'var(--accent)', borderRadius: 4, padding: '2px 6px', fontWeight: 600, flexShrink: 0 },
}
