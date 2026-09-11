import { useRef, useEffect } from 'react'
import { useMessages } from '../hooks/useMessages'
import { useAuth } from '../hooks/useAuth'
import OptimizedImage from '../components/OptimizedImage'

export default function MessagesPage() {
  const { user } = useAuth()
  const {
    contacts,
    activeChat, openChat, closeChat,
    input, setInput,
    sendMessage,
    getMessages,
    getUnreadCount,
    unreadCount,
  } = useMessages()
  const bottomRef = useRef(null)
  const messageCount = activeChat ? getMessages(activeChat).length : 0

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeChat?.id, messageCount])

  if (activeChat) {
    const msgs = getMessages(activeChat)
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={s.chatHeader}>
          <button style={s.backBtn} onClick={closeChat}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
          <OptimizedImage src={activeChat.avatar} style={s.chatAvatar} alt="" />
          <div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{activeChat.name}</div>
          </div>
          <button style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => alert('Додаткові дії будуть доступні після підключення сервера')} aria-label="Додаткові дії">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="5" r="1" fill="white" /><circle cx="12" cy="12" r="1" fill="white" /><circle cx="12" cy="19" r="1" fill="white" /></svg>
          </button>
        </div>
        <div style={s.messages}>
          {msgs.map((msg) => (
            <div key={msg.id} style={{ display: 'flex', justifyContent: msg.senderId === user.id ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
              <div style={{ ...s.bubble, background: msg.senderId === user.id ? 'var(--accent)' : 'var(--bg-card)', color: msg.senderId === user.id ? 'var(--bg)' : 'var(--text)' }}>
                <div style={{ fontSize: 14 }}>{msg.text}</div>
                <div style={{ fontSize: 10, color: msg.senderId === user.id ? 'rgba(0,0,0,0.5)' : 'var(--text-secondary)', marginTop: 4, textAlign: 'right' }}>{msg.time}</div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div style={s.inputRow}>
          <input style={{ ...s.msgInput }} aria-label="Повідомлення" placeholder="Написати повідомлення..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage(input)} />
          <button style={s.sendBtn} onClick={() => sendMessage(input)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="var(--bg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page" style={{ background: 'var(--bg)' }}>
      <div style={s.header}>
        <span style={s.title}>Повідомлення</span>
        {unreadCount > 0 && <span style={s.totalBadge}>{unreadCount}</span>}
      </div>
      {contacts.length === 0 ? (
        <div style={{ textAlign: 'center', paddingTop: 80 }}>
          <div style={{ fontSize: 48 }}>✉️</div>
          <div style={{ color: 'var(--text-secondary)', marginTop: 12 }}>Немає повідомлень</div>
        </div>
      ) : (
        <div style={{ padding: '0 16px' }}>
          {contacts.map(contact => {
            const messages = getMessages(contact)
            const lastMessage = messages[messages.length - 1]
            const unread = getUnreadCount(contact)
            return (
            <button key={`${contact.type}-${contact.id}`} style={s.msgRow} onClick={() => openChat(contact)}>
              <div style={{ position: 'relative' }}>
                <OptimizedImage src={contact.avatar} alt={contact.name} style={s.avatar} />
                {unread > 0 && <span style={s.unreadDot}>{unread}</span>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>{contact.name}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{lastMessage?.time || ''}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: 240 }}>{lastMessage?.text || 'Почніть розмову'}</div>
              </div>
            </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

const s = {
  header: { padding: '16px 16px 12px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 },
  title: { fontSize: 20, fontWeight: 700 },
  totalBadge: { background: 'var(--accent)', color: 'var(--bg)', fontSize: 11, fontWeight: 700, minWidth: 20, height: 20, borderRadius: 10, padding: '0 6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
  msgRow: { display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid var(--border)', background: 'none', border_bottom: '1px solid var(--border)', width: '100%', cursor: 'pointer', textAlign: 'left' },
  avatar: { width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' },
  unreadDot: { position: 'absolute', top: 0, right: 0, background: 'var(--accent)', color: 'var(--bg)', fontSize: 10, fontWeight: 700, width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  chatHeader: { display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' },
  backBtn: { background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  chatAvatar: { width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' },
  messages: { flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 140px)' },
  bubble: { maxWidth: '75%', borderRadius: 12, padding: '10px 14px' },
  inputRow: { display: 'flex', gap: 10, padding: '12px 16px', borderTop: '1px solid var(--border)', background: 'var(--bg)', position: 'sticky', bottom: 0 },
  msgInput: { flex: 1, padding: '12px 14px', borderRadius: 24, fontSize: 14 },
  sendBtn: { width: 44, height: 44, borderRadius: '50%', background: 'var(--accent)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
}
