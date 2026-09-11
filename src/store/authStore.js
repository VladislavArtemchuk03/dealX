const USERS_KEY = 'dealx_users'
const SESSION_KEY = 'dealx_session'
const ADMIN_SESSION_ID = '__dealx_admin__'

function getAdminUser() {
  return {
    id: ADMIN_SESSION_ID,
    name: 'Адміністратор',
    email: 'admin',
    avatar: 'https://i.pravatar.cc/150?u=dealx-admin',
    isAdmin: true,
  }
}

function hash(str) {
  let h = 5381
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h) ^ str.charCodeAt(i)
  return (h >>> 0).toString(36)
}

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]') } catch { return [] }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function registerUser({ name, email, password }) {
  const users = getUsers()
  const normalized = email.trim().toLowerCase()
  if (users.find(u => u.email === normalized)) {
    return { error: 'Акаунт з таким email вже існує' }
  }
  const user = {
    id: Date.now().toString(),
    name: name.trim(),
    email: normalized,
    passwordHash: hash(password),
    avatar: `https://i.pravatar.cc/150?u=${normalized}`,
    location: 'Київ, Україна',
    phone: '',
    bio: '',
    since: new Date().toLocaleDateString('uk-UA', { month: 'long', year: 'numeric' }),
    rating: 5.0,
    reviews: 0,
    createdAt: Date.now(),
  }
  saveUsers([...users, user])
  localStorage.setItem(SESSION_KEY, user.id)
  return { user: sanitize(user) }
}

export function loginUser({ email, password }) {
  const normalized = email.trim().toLowerCase()
  if (normalized === 'admin' && password === 'admin') {
    localStorage.setItem(SESSION_KEY, ADMIN_SESSION_ID)
    return { user: getAdminUser() }
  }
  const user = getUsers().find(u => u.email === normalized)
  if (!user) return { error: 'Акаунт не знайдено' }
  if (user.passwordHash !== hash(password)) return { error: 'Невірний пароль' }
  localStorage.setItem(SESSION_KEY, user.id)
  return { user: sanitize(user) }
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY)
}

export function getCurrentUser() {
  const id = localStorage.getItem(SESSION_KEY)
  if (!id) return null
  if (id === ADMIN_SESSION_ID) return getAdminUser()
  const user = getUsers().find(u => u.id === id)
  return user ? sanitize(user) : null
}

export function updateAuthUser(id, fields) {
  const users = getUsers()
  const email = fields.email?.trim().toLowerCase()
  if (email && users.some(user => user.id !== id && user.email === email)) {
    return { error: 'Акаунт з таким email вже існує' }
  }
  const updatedFields = email ? { ...fields, email } : fields
  const updatedUsers = users.map(user => user.id === id ? { ...user, ...updatedFields } : user)
  saveUsers(updatedUsers)
  return { user: sanitize(updatedUsers.find(user => user.id === id)) }
}

export function changeUserPassword(id, currentPassword, newPassword) {
  const users = getUsers()
  const user = users.find(candidate => candidate.id === id)
  if (!user) return { error: 'Акаунт не знайдено' }
  if (user.passwordHash !== hash(currentPassword)) return { error: 'Поточний пароль невірний' }
  if (newPassword.length < 6) return { error: 'Новий пароль має містити щонайменше 6 символів' }

  const updatedUsers = users.map(candidate => candidate.id === id
    ? { ...candidate, passwordHash: hash(newPassword) }
    : candidate)
  saveUsers(updatedUsers)
  return { user: sanitize(updatedUsers.find(candidate => candidate.id === id)) }
}

export function getRegisteredUsers() {
  return getUsers().map(sanitize)
}

export function adminUpdateRegisteredUser(id, fields) {
  return updateAuthUser(id, fields)
}

export function deleteRegisteredUser(id) {
  const users = getUsers()
  if (!users.some(user => user.id === id)) return { error: 'Акаунт не знайдено' }
  saveUsers(users.filter(user => user.id !== id))
  if (localStorage.getItem(SESSION_KEY) === id) localStorage.removeItem(SESSION_KEY)
  return { success: true }
}

export function switchToRegisteredUser(id) {
  const user = getUsers().find(candidate => candidate.id === id)
  if (!user) return { error: 'Акаунт не знайдено' }
  localStorage.setItem(SESSION_KEY, id)
  return { user: sanitize(user) }
}

function sanitize(u) {
  const safe = { ...u }
  delete safe.passwordHash
  return safe
}
