import { Link, useNavigate } from 'react-router-dom'
import { useViewHistory } from '../hooks/useViewHistory'
import OptimizedImage from '../components/OptimizedImage'

export default function ViewedPage() {
  const navigate = useNavigate()
  const { items, clear } = useViewHistory()

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>
      <div style={s.header}>
        <button style={s.backBtn} onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
        <span style={s.title}>Переглянуті</span>
        {items.length > 0 && (
          <button style={s.clearBtn} onClick={() => { if (confirm('Очистити історію?')) clear() }}>
            Очистити
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div style={s.empty}>
          <div style={{ fontSize: 52 }}>👁</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginTop: 16 }}>Немає переглянутих товарів</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8 }}>Відкрийте будь-яке оголошення, і воно з'явиться тут</div>
          <Link className="btn-primary" style={s.emptyAction} to="/home">
            Перейти до оголошень
          </Link>
        </div>
      ) : (
        <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>
            {items.length} {plural(items.length, 'товар', 'товари', 'товарів')}
          </div>
          {items.map(item => (
            <Link key={item.id} to={`/product/${item.id}`} style={s.card}>
              <OptimizedImage src={item.images[0]} alt={item.title} style={s.img} />
              <div style={s.body}>
                <div style={s.itemTitle}>{item.title}</div>
                <div style={s.itemPrice}>{item.price.toLocaleString('uk-UA')} грн</div>
                {item.negotiable && <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Договірна</span>}
                <div style={s.itemLoc}>{item.location}</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><path d="M9 18l6-6-6-6" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" /></svg>
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

const s = {
  header: { display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: '1px solid var(--border)' },
  backBtn: { background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  title: { flex: 1, fontSize: 17, fontWeight: 600 },
  clearBtn: { background: 'none', border: 'none', color: 'var(--danger)', fontSize: 13, cursor: 'pointer' },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '80px 32px 0' },
  emptyAction: { display: 'inline-flex', width: 'auto', marginTop: 24, alignItems: 'center', justifyContent: 'center' },
  card: { display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-card)', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', cursor: 'pointer', textAlign: 'left', paddingRight: 12 },
  img: { width: 80, height: 80, objectFit: 'cover', flexShrink: 0 },
  body: { flex: 1, padding: '10px 0' },
  itemTitle: { fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 3 },
  itemPrice: { fontSize: 15, fontWeight: 700, color: 'var(--accent)', marginBottom: 2 },
  itemLoc: { fontSize: 11, color: 'var(--text-secondary)', marginTop: 3 },
}
