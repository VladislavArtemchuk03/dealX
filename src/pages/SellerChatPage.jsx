import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { getAllListings } from '../store/listingsStore'
import OptimizedImage from '../components/OptimizedImage'

const BOT_REPLY = 'test'

export default function SellerChatPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const item = getAllListings().find(l => l.id === Number(productId))

  const seller = item?.seller || location.state?.seller || { name: 'Продавець', avatar: 'https://i.pravatar.cc/150?img=32' }
  const productTitle = item?.title || location.state?.title || 'Товар'

  const [messages, setMessages] = useState([
    { id: 1, from: 'them', text: `Доброго дня! Цікавить "${productTitle}"?`, time: 'Зараз' },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const msgIdRef = useRef(10)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const sendMessage = () => {
    const text = input.trim()
    if (!text) return
    const msg = { id: ++msgIdRef.current, from: 'me', text, time: nowTime() }
    setMessages(prev => [...prev, msg])
    setInput('')
    setTyping(true)
    const delay = 900 + Math.random() * 1500
    setTimeout(() => {
      setTyping(false)
      setMessages(prev => [...prev, { id: ++msgIdRef.current, from: 'them', text: BOT_REPLY, time: nowTime() }])
    }, delay)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const quickMessages = ['Чи ще актуально?', 'Яка остаточна ціна?', 'Де можна забрати?', 'Відправляєте поштою?']

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <button style={s.backBtn} onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
        <OptimizedImage src={seller.avatar} alt={seller.name} style={s.avatar} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{seller.name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{productTitle}</div>
        </div>
        {item && (
          <button style={s.productThumb} onClick={() => navigate(`/product/${item.id}`)}>
            <OptimizedImage src={item.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </button>
        )}
      </div>

      {/* Product context bar */}
      {item && (
        <button style={s.productBar} onClick={() => navigate(`/product/${item.id}`)}>
          <OptimizedImage src={item.images[0]} alt="" style={s.productBarImg} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{item.title}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)' }}>{item.price.toLocaleString('uk-UA')} грн</div>
          </div>
          <span style={{ marginLeft: 'auto', color: 'var(--accent)', fontSize: 12 }}>Переглянути ›</span>
        </button>
      )}

      {/* Messages */}
      <div style={s.messages}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', justifyContent: msg.from === 'me' ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
            {msg.from === 'them' && <OptimizedImage src={seller.avatar} alt="" style={s.msgAvatar} />}
            <div style={{ ...s.bubble, background: msg.from === 'me' ? 'var(--accent)' : 'var(--bg-card)', color: msg.from === 'me' ? 'var(--bg)' : 'var(--text)', marginLeft: msg.from === 'them' ? 8 : 0 }}>
              <div style={{ fontSize: 14, lineHeight: 1.5 }}>{msg.text}</div>
              <div style={{ fontSize: 10, color: msg.from === 'me' ? 'rgba(0,0,0,0.45)' : 'var(--text-secondary)', marginTop: 4, textAlign: 'right' }}>{msg.time}</div>
            </div>
          </div>
        ))}
        {typing && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <OptimizedImage src={seller.avatar} alt="" style={s.msgAvatar} />
            <div style={{ ...s.bubble, background: 'var(--bg-card)', padding: '10px 14px' }}>
              <div style={s.typingDots}>
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick messages */}
      <div style={s.quickRow}>
        {quickMessages.map(q => (
          <button key={q} style={s.quickBtn} onClick={() => setInput(q)}>
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={s.inputRow}>
        <textarea
          ref={inputRef}
          style={s.textArea}
          aria-label="Повідомлення"
          placeholder="Написати повідомлення..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          rows={1}
        />
        <button style={{ ...s.sendBtn, opacity: input.trim() ? 1 : 0.5 }} onClick={sendMessage} disabled={!input.trim()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="var(--bg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </div>
  )
}

function nowTime() {
  return new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })
}

const s = {
  page: { display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg)', overflow: 'hidden' },
  header: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg-card)', flexShrink: 0 },
  backBtn: { background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0 },
  avatar: { width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 },
  productThumb: { width: 40, height: 40, borderRadius: 8, overflow: 'hidden', flexShrink: 0, border: '1px solid var(--border)', padding: 0, cursor: 'pointer' },
  productBar: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)', cursor: 'pointer', border: 'none', width: '100%', textAlign: 'left', flexShrink: 0 },
  productBarImg: { width: 44, height: 44, borderRadius: 8, objectFit: 'cover', flexShrink: 0 },
  messages: { flex: 1, overflowY: 'auto', padding: '16px' },
  msgAvatar: { width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, alignSelf: 'flex-end' },
  bubble: { maxWidth: '72%', borderRadius: 14, padding: '10px 14px' },
  typingDots: { display: 'flex', gap: 4, alignItems: 'center', height: 18 },
  quickRow: { display: 'flex', gap: 8, padding: '8px 16px', overflowX: 'auto', flexShrink: 0, borderTop: '1px solid var(--border)' },
  quickBtn: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '6px 12px', fontSize: 12, color: 'var(--text)', whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: 0 },
  inputRow: { display: 'flex', gap: 10, padding: '10px 16px 14px', background: 'var(--bg)', flexShrink: 0 },
  textArea: { flex: 1, padding: '10px 14px', borderRadius: 20, fontSize: 14, resize: 'none', maxHeight: 100, lineHeight: 1.5 },
  sendBtn: { width: 44, height: 44, borderRadius: '50%', background: 'var(--accent)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, alignSelf: 'flex-end' },
}
