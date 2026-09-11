import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { adminUpdateRegisteredUser, deleteRegisteredUser, getRegisteredUsers } from '../store/authStore'
import OptimizedImage from '../components/OptimizedImage'

const emptyDraft = { name: '', email: '', phone: '', location: '', bio: '' }

export default function AdminAccountsPage() {
  const navigate = useNavigate()
  const { logout, switchAccount } = useAuth()
  const [accounts, setAccounts] = useState(getRegisteredUsers)
  const [selectedId, setSelectedId] = useState(() => getRegisteredUsers()[0]?.id ?? null)
  const [draft, setDraft] = useState(() => getRegisteredUsers()[0] || emptyDraft)
  const [message, setMessage] = useState('')

  const selectAccount = account => {
    setSelectedId(account.id)
    setDraft(account)
    setMessage('')
  }

  const refreshAccounts = (preferredId = selectedId) => {
    const nextAccounts = getRegisteredUsers()
    setAccounts(nextAccounts)
    const selected = nextAccounts.find(account => account.id === preferredId) || nextAccounts[0]
    setSelectedId(selected?.id ?? null)
    setDraft(selected || emptyDraft)
  }

  const saveAccount = () => {
    const result = adminUpdateRegisteredUser(selectedId, draft)
    if (result?.error) {
      setMessage(result.error)
      return
    }
    refreshAccounts(selectedId)
    setMessage('Зміни збережено')
  }

  const removeAccount = account => {
    if (!confirm(`Видалити акаунт ${account.email}?`)) return
    const result = deleteRegisteredUser(account.id)
    if (result?.error) {
      setMessage(result.error)
      return
    }
    refreshAccounts()
    setMessage('Акаунт видалено')
  }

  const openAccount = account => {
    const result = switchAccount(account.id)
    if (result?.user) navigate('/home', { replace: true })
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <div className="admin-kicker">DealX</div>
          <h1>Керування акаунтами</h1>
          <p>{accounts.length} зареєстрованих акаунтів</p>
        </div>
        <button className="btn-outline admin-logout" onClick={() => { logout(); navigate('/auth', { replace: true }) }}>Вийти</button>
      </header>

      <main className="admin-content">
        <section className="admin-list" aria-label="Перелік акаунтів">
          {accounts.length === 0 ? (
            <div className="admin-empty">Зареєстрованих акаунтів поки немає.</div>
          ) : accounts.map(account => (
            <article key={account.id} className={`admin-account${selectedId === account.id ? ' admin-account-active' : ''}`}>
              <button className="admin-account-select" onClick={() => selectAccount(account)}>
                <OptimizedImage src={account.avatar} alt="" />
                <span>
                  <strong>{account.name || 'Без імені'}</strong>
                  <small>{account.email}</small>
                </span>
              </button>
              <div className="admin-account-actions">
                <button className="admin-icon-button" onClick={() => openAccount(account)} title="Увійти як цей користувач" aria-label={`Увійти як ${account.email}`}>↗</button>
                <button className="admin-icon-button admin-delete" onClick={() => removeAccount(account)} title="Видалити акаунт" aria-label={`Видалити ${account.email}`}>×</button>
              </div>
            </article>
          ))}
        </section>

        <section className="admin-editor">
          {selectedId ? (
            <>
              <div className="admin-editor-heading">
                <h2>Дані акаунта</h2>
                <button className="btn-primary admin-switch" onClick={() => openAccount(draft)}>Відкрити акаунт</button>
              </div>
              <div className="admin-fields">
                <AdminField label="Ім'я" value={draft.name} onChange={value => setDraft(current => ({ ...current, name: value }))} />
                <AdminField label="Email" type="email" value={draft.email} onChange={value => setDraft(current => ({ ...current, email: value }))} />
                <AdminField label="Телефон" value={draft.phone || ''} onChange={value => setDraft(current => ({ ...current, phone: value }))} />
                <AdminField label="Місто" value={draft.location || ''} onChange={value => setDraft(current => ({ ...current, location: value }))} />
                <label className="admin-field admin-field-wide">Про себе
                  <textarea value={draft.bio || ''} rows={4} onChange={event => setDraft(current => ({ ...current, bio: event.target.value }))} />
                </label>
              </div>
              {message && <div className={message === 'Зміни збережено' ? 'admin-success' : 'admin-error'}>{message}</div>}
              <button className="btn-primary admin-save" onClick={saveAccount}>Зберегти зміни</button>
            </>
          ) : <div className="admin-empty">Оберіть акаунт зі списку, щоб змінити його дані.</div>}
        </section>
      </main>
    </div>
  )
}

function AdminField({ label, value, onChange, type = 'text' }) {
  return <label className="admin-field">{label}<input type={type} value={value} onChange={event => onChange(event.target.value)} /></label>
}