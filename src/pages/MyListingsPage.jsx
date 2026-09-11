import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { LISTINGS } from '../data/listings'
import { getAllUserListings, updateUserListing, deleteUserListing } from '../store/listingsStore'
import OptimizedImage from '../components/OptimizedImage'
import styles from './MyListingsPage.module.css'

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
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <span className={styles.title}>Мої оголошення</span>
        <div className={styles.headerSpacer} />
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {tabs.map(t => (
          <button key={t.key} className={styles.tabBtn} data-active={tab === t.key || undefined} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className={styles.list}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>📭</div>
            <div className={styles.emptyText}>Немає оголошень у цій категорії</div>
            <button className={`btn-primary ${styles.emptyAction}`} onClick={() => navigate('/add')}>
              + Додати оголошення
            </button>
          </div>
        ) : (
          filtered.map(item => (
            <div key={item.id} className={styles.card}>
              <button className={styles.cardInner} onClick={() => navigate(`/product/${item.id}`)}>
                <OptimizedImage src={item.images[0]} alt={item.title} className={styles.img} />
                <div className={styles.info}>
                  <div className={styles.itemHeader}>
                    <div className={styles.itemTitle}>{item.title}</div>
                    {item.status === 'paused' && <span className={styles.pausedBadge}>⏸ призупинено</span>}
                    {item.isUserListing && item.status === 'active' && <span className={styles.newBadge}>• моє</span>}
                  </div>
                  <div className={styles.itemPrice}>{item.price.toLocaleString('uk-UA')} грн</div>
                  <div className={styles.stats}>
                    <span>👁 {item.views}</span>
                    <span>❤️ {item.likes}</span>
                  </div>
                </div>
              </button>
              <button className={styles.moreBtn} onClick={e => { e.stopPropagation(); setMenuOpen(menuOpen === item.id ? null : item.id) }}>
                ⋮
              </button>
              {menuOpen === item.id && (
                <div className={styles.dropdown}>
                  <button className={styles.dropItem} onClick={() => handleMenu('view', item)}>👁 Переглянути</button>
                  {item.isUserListing && <button className={styles.dropItem} onClick={() => handleMenu('edit', item)}>✏️ Редагувати</button>}
                  {item.status !== 'paused'
                    ? <button className={styles.dropItem} onClick={() => handleMenu('pause', item)}>⏸️ Призупинити</button>
                    : <button className={styles.dropItem} data-action="resume" onClick={() => handleMenu('resume', item)}>▶️ Відновити</button>
                  }
                  <button className={styles.dropItem} onClick={() => handleMenu('promote', item)}>🚀 Підняти в пошуку</button>
                  <button className={styles.dropItem} data-action="delete" onClick={() => handleMenu('delete', item)}>🗑️ Видалити</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className={styles.bottomAction}>
        <button className="btn-primary" onClick={() => navigate('/add')}>+ Додати оголошення</button>
      </div>
    </div>
  )
}

