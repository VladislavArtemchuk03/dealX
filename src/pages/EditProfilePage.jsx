import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, CheckCircle, ChevronRight, LockKeyhole, MapPin, Pencil, ArrowLeft } from 'lucide-react'
import { useProfile } from '../hooks/useProfile'
import { useAuth } from '../hooks/useAuth'
import OptimizedImage from '../components/OptimizedImage'
import styles from './EditProfilePage.module.css'

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
    <div className={styles.dealxEditProfileMain}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <ArrowLeft aria-hidden="true" size={20} strokeWidth={1.8} />
        </button>
        <span className={styles.title}>Редагувати профіль</span>
        <div className={styles.headerSpacer} />
      </div>

      {/* Avatar */}
      <div className={styles.avatarSection}>
        <div className={styles.avatarWrap}>
          <OptimizedImage src={form.avatar} alt="Аватар профілю" className={styles.avatar} />
          <button className={styles.avatarEditButton} onClick={() => setShowAvatarPicker(p => !p)}>
            <Pencil aria-hidden="true" size={14} strokeWidth={1.8} />
          </button>
        </div>
        {showAvatarPicker && (
          <div className={styles.avatarGrid}>
            {AVATARS.map(url => (
              <button key={url} className={styles.avatarOption} data-selected={form.avatar === url || undefined} onClick={() => { set('avatar', url); setShowAvatarPicker(false) }}>
                <OptimizedImage src={url} alt="" className={styles.avatarOptionImage} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Form */}
      <div className={styles.form}>
        {error && <div className="auth-error">{error}</div>}
        <Field label="Ім'я">
          <input className={styles.input} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ваше ім'я" />
        </Field>

        <Field label="Про себе">
          <textarea className={`${styles.input} ${styles.bioInput}`} rows={3} value={form.bio} onChange={e => set('bio', e.target.value)} placeholder="Розкажіть про себе..." maxLength={200} />
          <div className={styles.characterCount}>{form.bio.length}/200</div>
        </Field>

        <Field label="Телефон">
          <input className={styles.input} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+38 (___) ___-__-__" type="tel" />
        </Field>

        <Field label="Email">
          <input className={styles.input} value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" type="email" />
        </Field>

        <Field label="Місцезнаходження">
          <div className={styles.locationWrap}>
            <input className={`${styles.input} ${styles.locationInput}`} value={form.location} onChange={e => set('location', e.target.value)} placeholder="Місто" />
            <MapPin className={styles.locationIcon} aria-hidden="true" size={16} />
          </div>
        </Field>

        {/* Divider */}
        <div className={styles.sectionLabel}>Безпека</div>

        <button className={styles.securityRow} onClick={() => setShowPasswordDialog(true)}>
          <LockKeyhole className={styles.securityIcon} aria-hidden="true" size={18} />
          <span className={styles.securityLabel}>Змінити пароль</span>
          <ChevronRight aria-hidden="true" size={14} strokeWidth={1.8} />
        </button>

        <button className={`${styles.securityRow} ${styles.notificationRow}`} onClick={() => alert('Дана функція у розробці')}>
          <Bell className={styles.securityIcon} aria-hidden="true" size={18} />
          <span className={styles.securityLabel}>Сповіщення</span>
          <ChevronRight aria-hidden="true" size={14} strokeWidth={1.8} />
        </button>
      </div>

      {/* Save bar */}
      <div className={styles.saveBar}>
        {saved ? (
          <div className={styles.saveSuccess}>
            <CheckCircle aria-hidden="true" size={18} /> Збережено!
          </div>
        ) : (
          <button className={`btn-primary ${styles.saveButton}`} onClick={handleSave} disabled={!hasChanges}>
            Зберегти зміни
          </button>
        )}
        <button className={`btn-outline ${styles.cancelButton}`} onClick={() => navigate(-1)}>
          Скасувати
        </button>
      </div>

      {showPasswordDialog && (
        <div className={styles.passwordOverlay} role="dialog" aria-modal="true" aria-labelledby="password-dialog-title">
          <div className={styles.passwordDialog}>
            <div className={styles.dialogHeader}>
              <div id="password-dialog-title" className={styles.dialogTitle}>Змінити пароль</div>
              <button className={styles.closeButton} onClick={closePasswordDialog} aria-label="Закрити">×</button>
            </div>
            <Field label="Поточний пароль">
              <input className={styles.input} type="password" value={passwords.current} onChange={event => { setPasswordError(''); setPasswords(values => ({ ...values, current: event.target.value })) }} autoComplete="current-password" />
            </Field>
            <Field label="Новий пароль">
              <input className={styles.input} type="password" value={passwords.next} onChange={event => { setPasswordError(''); setPasswords(values => ({ ...values, next: event.target.value })) }} autoComplete="new-password" minLength={6} placeholder="Щонайменше 6 символів" />
            </Field>
            <Field label="Повторіть новий пароль">
              <input className={styles.input} type="password" value={passwords.confirm} onChange={event => { setPasswordError(''); setPasswords(values => ({ ...values, confirm: event.target.value })) }} autoComplete="new-password" />
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
    <div className={styles.field}>
      <label className={styles.fieldLabel}>{label}</label>
      {children}
    </div>
  )
}

