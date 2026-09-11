import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '../hooks/useProfile'
import { useAuth } from '../hooks/useAuth'
import OptimizedImage from '../components/OptimizedImage'

const AVATARS = [
  'https://i.pravatar.cc/150?img=32',
  'https://i.pravatar.cc/150?img=47',
  'https://i.pravatar.cc/150?img=68',
  'https://i.pravatar.cc/150?img=12',
  'https://i.pravatar.cc/150?img=25',
  'https://i.pravatar.cc/150?img=57',
]

export default function EditProfilePage() {
  const navigate = useNavigate()
  const { profile, updateProfile } = useProfile()
  const { user, updateUser, changePassword } = useAuth()
  const initialProfile = { ...profile, ...(user || {}) }
  const [form, setForm] = useState(initialProfile)
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })
  const [passwordError, setPasswordError] = useState('')

  const set = (field, value) => {
    setError('')
    setForm(p => ({ ...p, [field]: value }))
  }

  const handleSave = () => {
    const result = updateUser(form)
    if (result?.error) {
      setError(result.error)
      return
    }
    updateProfile(form)
    setSaved(true)
    setTimeout(() => { setSaved(false); navigate('/profile') }, 1200)
  }

  const closePasswordDialog = () => {
    setShowPasswordDialog(false)
    setPasswords({ current: '', next: '', confirm: '' })
    setPasswordError('')
  }

  const handlePasswordChange = () => {
    if (passwords.next !== passwords.confirm) {
      setPasswordError('Нові паролі не співпадають')
      return
    }
    const result = changePassword(passwords.current, passwords.next)
    if (result?.error) {
      setPasswordError(result.error)
      return
    }
    closePasswordDialog()
  }

  const hasChanges = JSON.stringify(form) !== JSON.stringify(initialProfile)

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 160 }}>
      {/* Header */}
      <div style={s.header}>
        <button style={s.backBtn} onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
        <span style={s.title}>Редагувати профіль</span>
        <div style={{ width: 38 }} />
      </div>

      {/* Avatar */}
      <div style={s.avatarSection}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <OptimizedImage src={form.avatar} alt="Аватар профілю" style={s.avatar} />
          <button style={s.avatarEditBtn} onClick={() => setShowAvatarPicker(p => !p)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="var(--bg)" strokeWidth="2" strokeLinecap="round" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="var(--bg)" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        </div>
        {showAvatarPicker && (
          <div style={s.avatarGrid}>
            {AVATARS.map(url => (
              <button key={url} style={{ ...s.avatarOption, border: form.avatar === url ? '2px solid var(--accent)' : '2px solid transparent' }} onClick={() => { set('avatar', url); setShowAvatarPicker(false) }}>
                <OptimizedImage src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Form */}
      <div style={{ padding: '0 16px' }}>
        {error && <div className="auth-error">{error}</div>}
        <Field label="Ім'я">
          <input style={s.input} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ваше ім'я" />
        </Field>

        <Field label="Про себе">
          <textarea style={{ ...s.input, resize: 'none' }} rows={3} value={form.bio} onChange={e => set('bio', e.target.value)} placeholder="Розкажіть про себе..." maxLength={200} />
          <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>{form.bio.length}/200</div>
        </Field>

        <Field label="Телефон">
          <input style={s.input} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+38 (___) ___-__-__" type="tel" />
        </Field>

        <Field label="Email">
          <input style={s.input} value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" type="email" />
        </Field>

        <Field label="Місцезнаходження">
          <div style={{ position: 'relative' }}>
            <input style={{ ...s.input, paddingRight: 36 }} value={form.location} onChange={e => set('location', e.target.value)} placeholder="Місто" />
            <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>📍</span>
          </div>
        </Field>

        {/* Divider */}
        <div style={s.sectionLabel}>Безпека</div>

        <button style={s.securityRow} onClick={() => setShowPasswordDialog(true)}>
          <span style={{ fontSize: 18 }}>🔒</span>
          <span style={{ flex: 1, fontSize: 14 }}>Змінити пароль</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>

        <button style={{ ...s.securityRow, color: 'var(--danger)' }} onClick={() => alert('Сповіщення налаштовані')}>
          <span style={{ fontSize: 18 }}>🔔</span>
          <span style={{ flex: 1, fontSize: 14, color: '#fff' }}>Сповіщення</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
      </div>

      {/* Save bar */}
      <div style={s.saveBar}>
        {saved ? (
          <div style={{ ...s.saveBtn, background: '#4caf50', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 10, padding: 14 }}>
            ✅ Збережено!
          </div>
        ) : (
          <button className="btn-primary" onClick={handleSave} style={{ opacity: hasChanges ? 1 : 0.5 }} disabled={!hasChanges}>
            Зберегти зміни
          </button>
        )}
        <button className="btn-outline" style={{ marginTop: 10 }} onClick={() => navigate(-1)}>
          Скасувати
        </button>
      </div>

      {showPasswordDialog && (
        <div style={s.passwordOverlay} role="dialog" aria-modal="true" aria-labelledby="password-dialog-title">
          <div style={s.passwordDialog}>
            <div style={s.dialogHeader}>
              <div id="password-dialog-title" style={{ fontSize: 18, fontWeight: 700 }}>Змінити пароль</div>
              <button style={s.closeBtn} onClick={closePasswordDialog} aria-label="Закрити">×</button>
            </div>
            <Field label="Поточний пароль">
              <input style={s.input} type="password" value={passwords.current} onChange={event => { setPasswordError(''); setPasswords(values => ({ ...values, current: event.target.value })) }} autoComplete="current-password" />
            </Field>
            <Field label="Новий пароль">
              <input style={s.input} type="password" value={passwords.next} onChange={event => { setPasswordError(''); setPasswords(values => ({ ...values, next: event.target.value })) }} autoComplete="new-password" minLength={6} placeholder="Щонайменше 6 символів" />
            </Field>
            <Field label="Повторіть новий пароль">
              <input style={s.input} type="password" value={passwords.confirm} onChange={event => { setPasswordError(''); setPasswords(values => ({ ...values, confirm: event.target.value })) }} autoComplete="new-password" />
            </Field>
            {passwordError && <div className="auth-error">{passwordError}</div>}
            <button className="btn-primary" onClick={handlePasswordChange} disabled={!passwords.current || !passwords.next || !passwords.confirm}>Зберегти пароль</button>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  )
}

const s = {
  header: { display: 'flex', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid var(--border)' },
  backBtn: { background: 'none', border: 'none', cursor: 'pointer', width: 38, display: 'flex', alignItems: 'center' },
  title: { flex: 1, fontSize: 17, fontWeight: 600, textAlign: 'center' },
  avatarSection: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px 20px' },
  avatar: { width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent)', display: 'block' },
  avatarEditBtn: { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: '50%', background: 'var(--accent)', border: '2px solid var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  avatarGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 14, width: '100%', maxWidth: 220 },
  avatarOption: { width: '100%', aspectRatio: '1', borderRadius: '50%', overflow: 'hidden', padding: 0, cursor: 'pointer' },
  input: { width: '100%', padding: '12px 14px', borderRadius: 10, fontSize: 14, display: 'block' },
  sectionLabel: { fontSize: 12, color: 'var(--text-secondary)', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8, marginTop: 8 },
  securityRow: { display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px', marginBottom: 10, width: '100%', cursor: 'pointer', textAlign: 'left' },
  saveBar: { position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, padding: '14px 16px', background: 'var(--bg)', borderTop: '1px solid var(--border)' },
  saveBtn: { width: '100%', color: '#fff', fontWeight: 600, fontSize: 15 },
  passwordOverlay: { position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0, 0, 0, 0.72)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  passwordDialog: { width: '100%', maxWidth: 420, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 },
  dialogHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  closeBtn: { background: 'none', border: 'none', color: 'var(--text-secondary)', width: 32, height: 32, fontSize: 26, lineHeight: 1, cursor: 'pointer' },
}
