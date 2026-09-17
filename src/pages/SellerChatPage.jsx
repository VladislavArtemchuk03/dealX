import { useMemo, useRef, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Send } from 'lucide-react'
import { getAllListings } from '../store/listingsStore'
import { useMessages } from '../hooks/useMessages'
import OptimizedImage from '../components/OptimizedImage'
import styles from './SellerChatPage.module.css'

export default function SellerChatPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const item = getAllListings().find(l => l.id === Number(productId))

  const seller = item?.seller || location.state?.seller || { name: 'Продавець', avatar: 'https://i.pravatar.cc/150?img=32' }
  const productTitle = item?.title || location.state?.title || 'Товар'
  const contact = useMemo(() => ({
    id: `product-${productId}`,
    type: 'seller',
    name: seller.name,
    avatar: seller.avatar,
  }), [productId, seller.avatar, seller.name])
  const { activeChat, openChat, closeChat, input, setInput, sendMessage, getMessages } = useMessages()
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const messages = activeChat?.id === contact.id ? getMessages(activeChat) : []

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  useEffect(() => {
    openChat(contact)
  }, [contact, openChat])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSend = () => sendMessage(input)

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const quickMessages = ['Чи ще актуально?', 'Яка остаточна ціна?', 'Де можна забрати?', 'Відправляєте поштою?']

  return (
    <div className={styles.dealxSellerChatMain}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => { closeChat(); navigate(-1) }} aria-label="Назад">
          <ArrowLeft aria-hidden="true" size={20} strokeWidth={1.8} />
        </button>
        <OptimizedImage src={seller.avatar} alt={seller.name} className={styles.avatar} />
        <div className={styles.sellerInfo}>
          <div className={styles.sellerName}>{seller.name}</div>
          <div className={styles.productName}>{productTitle}</div>
        </div>
        {item && (
          <button className={styles.productThumb} onClick={() => navigate(`/product/${item.id}`)} aria-label="Відкрити оголошення">
            <OptimizedImage src={item.images[0]} alt="" className={styles.fullImage} />
          </button>
        )}
      </div>

      {item && (
        <button className={styles.productBar} onClick={() => navigate(`/product/${item.id}`)}>
          <OptimizedImage src={item.images[0]} alt="" className={styles.productBarImage} />
          <div>
            <div className={styles.productBarTitle}>{item.title}</div>
            <div className={styles.productBarPrice}>{item.price.toLocaleString('uk-UA')} грн</div>
          </div>
          <span className={styles.productLink}>Переглянути ›</span>
        </button>
      )}

      <div className={styles.messages}>
        {messages.map(msg => (
          <div key={msg.id} className={styles.messageRow}>
            <div className={styles.bubble}>
              <div className={styles.messageText}>{msg.text}</div>
              <div className={styles.messageTime}>{msg.time}</div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className={styles.quickRow}>
        {quickMessages.map(q => (
          <button key={q} className={styles.quickButton} onClick={() => setInput(q)}>
            {q}
          </button>
        ))}
      </div>

      <div className={styles.inputRow}>
        <textarea
          ref={inputRef}
          className={styles.textArea}
          aria-label="Повідомлення"
          placeholder="Написати повідомлення..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          rows={1}
        />
        <button className={styles.sendButton} onClick={handleSend} disabled={!input.trim()} aria-label="Надіслати повідомлення">
          <Send aria-hidden="true" size={20} strokeWidth={1.8} />
        </button>
      </div>
    </div>
  )
}

