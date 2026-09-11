import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function AuthPage() {
  const navigate = useNavigate()
  const { login, register } = useAuth()
  const [tab, setTab] = useState('login')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [loginForm, setLoginForm] = useState({ email: '', password: '', show: false })
  const [regForm, setRegForm] = useState({ name: '', email: '', password: '', confirm: '', show: false })

  const setLogin = (f, v) => setLoginForm(p => ({ ...p, [f]: v }))
  const setReg = (f, v) => setRegForm(p => ({ ...p, [f]: v }))

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    if (!loginForm.email || !loginForm.password) { setError('Заповніть всі поля'); return }
    setLoading(true)
    await delay(400)
    const result = login(loginForm.email, loginForm.password)
    setLoading(false)
    if (result.error) { setError(result.error); return }
    navigate(result.user.isAdmin ? '/admin/accounts' : '/home', { replace: true })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    if (!regForm.name || !regForm.email || !regForm.password || !regForm.confirm) { setError('Заповніть всі поля'); return }
    if (!regForm.email.includes('@')) { setError('Введіть коректний Gmail/email'); return }
    if (regForm.password.length < 6) { setError('Пароль мінімум 6 символів'); return }
    if (regForm.password !== regForm.confirm) { setError('Паролі не співпадають'); return }
    setLoading(true)
    await delay(400)
    const result = register(regForm.name, regForm.email, regForm.password)
    setLoading(false)
    if (result.error) { setError(result.error); return }
    navigate('/home', { replace: true })
  }

  return (
    <div className="auth-root">
      {/* Left branding panel — desktop only */}
      <div className="auth-brand">
        <div className="auth-brand-inner">
          <div className="auth-logo"><span style={{ color: 'var(--accent)' }}>Deal</span>X</div>
          <div className="auth-tagline">Знайди, що потрібно.<br /><span style={{ color: 'var(--accent)' }}>Продай, що зайве.</span></div>
          <div className="auth-desc">Легко, швидко та безпечно. Мільйони оголошень у вашій кишені.</div>
          <div className="auth-features">
            {['🔒 Безпечні угоди', '🚚 Доставка по Україні', '💬 Чат з продавцем', '❤️ Збереження обраного'].map(f => (
              <div key={f} className="auth-feature-item">{f}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="auth-form-panel">
        <div className="auth-form-inner">
          {/* Mobile logo */}
          <div className="auth-logo-mobile"><span style={{ color: 'var(--accent)' }}>Deal</span>X</div>

          {/* Tabs */}
          <div className="auth-tabs">
            <button className={`auth-tab${tab === 'login' ? ' auth-tab-active' : ''}`} onClick={() => { setTab('login'); setError('') }}>
              Вхід
            </button>
            <button className={`auth-tab${tab === 'register' ? ' auth-tab-active' : ''}`} onClick={() => { setTab('register'); setError('') }}>
              Реєстрація
            </button>
          </div>

          {error && (
            <div className="auth-error">⚠️ {error}</div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="auth-form">
              <label className="auth-label">Email або логін</label>
              <input className="auth-input" type="text" inputMode="email" placeholder="your@gmail.com" value={loginForm.email} onChange={e => setLogin('email', e.target.value)} autoComplete="username" />
              <label className="auth-label">Пароль</label>
              <div className="auth-input-wrap">
                <input className="auth-input" type={loginForm.show ? 'text' : 'password'} placeholder="••••••••" value={loginForm.password} onChange={e => setLogin('password', e.target.value)} autoComplete="current-password" />
                <button type="button" className="auth-eye" onClick={() => setLogin('show', !loginForm.show)}>
                  {loginForm.show ? '🙈' : '👁'}
                </button>
              </div>
              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? 'Входимо...' : 'Увійти'}
              </button>
              <button type="button" className="auth-switch" onClick={() => { setTab('register'); setError('') }}>
                Немає акаунту? <span>Зареєструватись</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="auth-form">
              <label className="auth-label">Ім'я</label>
              <input className="auth-input" type="text" placeholder="Ваше ім'я" value={regForm.name} onChange={e => setReg('name', e.target.value)} autoComplete="name" />
              <label className="auth-label">Email (Gmail)</label>
              <input className="auth-input" type="email" placeholder="your@gmail.com" value={regForm.email} onChange={e => setReg('email', e.target.value)} autoComplete="email" />
              <label className="auth-label">Пароль</label>
              <div className="auth-input-wrap">
                <input className="auth-input" type={regForm.show ? 'text' : 'password'} placeholder="Мінімум 6 символів" value={regForm.password} onChange={e => setReg('password', e.target.value)} autoComplete="new-password" />
                <button type="button" className="auth-eye" onClick={() => setReg('show', !regForm.show)}>
                  {regForm.show ? '🙈' : '👁'}
                </button>
              </div>
              <label className="auth-label">Підтвердження пароля</label>
              <input className="auth-input" type={regForm.show ? 'text' : 'password'} placeholder="Повторіть пароль" value={regForm.confirm} onChange={e => setReg('confirm', e.target.value)} autoComplete="new-password" />
              {regForm.password && regForm.confirm && regForm.password !== regForm.confirm && (
                <div style={{ fontSize: 12, color: 'var(--danger)', marginTop: -8, marginBottom: 4 }}>Паролі не співпадають</div>
              )}
              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? 'Реєструємо...' : 'Створити акаунт'}
              </button>
              <button type="button" className="auth-switch" onClick={() => { setTab('login'); setError('') }}>
                Вже є акаунт? <span>Увійти</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

const delay = ms => new Promise(r => setTimeout(r, ms))
