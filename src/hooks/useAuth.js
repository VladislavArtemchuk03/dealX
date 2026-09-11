import { useState, useCallback, createContext, useContext, createElement } from 'react'
import { loginUser, registerUser, logoutUser, getCurrentUser, updateAuthUser, changeUserPassword, switchToRegisteredUser } from '../store/authStore'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getCurrentUser)

  const login = useCallback((email, password) => {
    const result = loginUser({ email, password })
    if (result.user) setUser(result.user)
    return result
  }, [])

  const register = useCallback((name, email, password) => {
    const result = registerUser({ name, email, password })
    if (result.user) setUser(result.user)
    return result
  }, [])

  const logout = useCallback(() => {
    logoutUser()
    setUser(null)
  }, [])

  const updateUser = useCallback((fields) => {
    if (!user) return
    const result = updateAuthUser(user.id, fields)
    if (result.user) setUser(result.user)
    return result
  }, [user])

  const changePassword = useCallback((currentPassword, newPassword) => {
    if (!user) return { error: 'Потрібно увійти в акаунт' }
    const result = changeUserPassword(user.id, currentPassword, newPassword)
    if (result.user) setUser(result.user)
    return result
  }, [user])

  const switchAccount = useCallback((id) => {
    const result = switchToRegisteredUser(id)
    if (result.user) setUser(result.user)
    return result
  }, [])

  return createElement(
    AuthContext.Provider,
    { value: { user, login, register, logout, updateUser, changePassword, switchAccount, isAuthenticated: !!user } },
    children,
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
