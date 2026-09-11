import { useRef, useEffect } from 'react'
import { useMessages } from '../hooks/useMessages'
import { useAuth } from '../hooks/useAuth'
import OptimizedImage from '../components/OptimizedImage'
import styles from './MessagesPage.module.css'

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
      <div className={styles.chatPage}>
        <div className={styles.chatHeader}>
          <button className={styles.backBtn} onClick={closeChat}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
          <OptimizedImage src={activeChat.avatar} className={styles.chatAvatar} alt={activeChat.name} />
          <div>
            <div className={styles.chatName}>{activeChat.name}</div>
          </div>
          <button className={styles.menuBtn} onClick={() => alert('Додаткові дії будуть доступні після підключення сервера')} aria-label="Додаткові дії">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="5" r="1" fill="white" /><circle cx="12" cy="12" r="1" fill="white" /><circle cx="12" cy="19" r="1" fill="white" /></svg>
          </button>
        </div>
        <div className={styles.messages}>
          {msgs.map((msg) => (
            <div key={msg.id} className={styles.messageRow} data-own={msg.senderId === user.id}>
              <div className={styles.bubble} data-own={msg.senderId === user.id}>
                <div className={styles.messageText}>{msg.text}</div>
                <div className={styles.messageTime} data-own={msg.senderId === user.id}>{msg.time}</div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className={styles.inputRow}>
          <input className={styles.msgInput} aria-label="Повідомлення" placeholder="Написати повідомлення..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage(input)} />
          <button className={styles.sendBtn} onClick={() => sendMessage(input)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="var(--bg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`page ${styles.page}`}>
      <div className={styles.header}>
        <span className={styles.title}>Повідомлення</span>
        {unreadCount > 0 && <span className={styles.totalBadge}>{unreadCount}</span>}
      </div>
      {contacts.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>✉️</div>
          <div className={styles.emptyText}>Немає повідомлень</div>
        </div>
      ) : (
        <div className={styles.contacts}>
          {contacts.map(contact => {
            const messages = getMessages(contact)
            const lastMessage = messages[messages.length - 1]
            const unread = getUnreadCount(contact)
            return (
            <button key={`${contact.type}-${contact.id}`} className={styles.contactRow} onClick={() => openChat(contact)}>
              <div className={styles.avatarWrap}>
                <OptimizedImage src={contact.avatar} alt={contact.name} className={styles.avatar} />
                {unread > 0 && <span className={styles.unreadDot}>{unread}</span>}
              </div>
              <div className={styles.contactBody}>
                <div className={styles.contactMeta}>
                  <span className={styles.contactName}>{contact.name}</span>
                  <span className={styles.contactTime}>{lastMessage?.time || ''}</span>
                </div>
                <div className={styles.lastMessage}>{lastMessage?.text || 'Почніть розмову'}</div>
              </div>
            </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

