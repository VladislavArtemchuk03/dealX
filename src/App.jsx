import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import SideNav from './components/SideNav'
import BottomNav from './components/BottomNav'
import './index.css'

const HomePage = lazy(() => import('./pages/HomePage'))
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'))
const AddListingPage = lazy(() => import('./pages/AddListingPage'))
const MessagesPage = lazy(() => import('./pages/MessagesPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const ProductPage = lazy(() => import('./pages/ProductPage'))
const MyListingsPage = lazy(() => import('./pages/MyListingsPage'))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const SellerChatPage = lazy(() => import('./pages/SellerChatPage'))
const ViewedPage = lazy(() => import('./pages/ViewedPage'))
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'))
const EditProfilePage = lazy(() => import('./pages/EditProfilePage'))
const AuthPage = lazy(() => import('./pages/AuthPage'))
const AdminAccountsPage = lazy(() => import('./pages/AdminAccountsPage'))

function ProtectedLayout({ children, noNav }) {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated) return <Navigate to="/auth" replace />
  if (user?.isAdmin) return <Navigate to="/admin/accounts" replace />
  return (
    <div className="app-layout">
      <SideNav />
      <div className="app-main">
        {children}
        {!noNav && <BottomNav />}
      </div>
    </div>
  )
}

function AdminRoute() {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated) return <Navigate to="/auth" replace />
  if (!user?.isAdmin) return <Navigate to="/home" replace />
  return <AdminAccountsPage />
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuth()
  const startPath = user?.isAdmin ? '/admin/accounts' : '/home'
  return (
    <Routes>
      <Route path="/auth" element={isAuthenticated ? <Navigate to={startPath} replace /> : <AuthPage />} />
      <Route path="/" element={<Navigate to={isAuthenticated ? startPath : '/auth'} replace />} />

      <Route path="/admin/accounts" element={<AdminRoute />} />

      <Route path="/home" element={<ProtectedLayout><HomePage /></ProtectedLayout>} />
      <Route path="/categories" element={<ProtectedLayout><CategoriesPage /></ProtectedLayout>} />
      <Route path="/messages" element={<ProtectedLayout><MessagesPage /></ProtectedLayout>} />
      <Route path="/profile" element={<ProtectedLayout><ProfilePage /></ProtectedLayout>} />
      <Route path="/search" element={<ProtectedLayout><SearchPage /></ProtectedLayout>} />
      <Route path="/favorites" element={<ProtectedLayout><FavoritesPage /></ProtectedLayout>} />
      <Route path="/viewed" element={<ProtectedLayout><ViewedPage /></ProtectedLayout>} />

      <Route path="/add" element={<ProtectedLayout noNav><AddListingPage /></ProtectedLayout>} />
      <Route path="/profile/edit" element={<ProtectedLayout noNav><EditProfilePage /></ProtectedLayout>} />
      <Route path="/product/:id" element={<ProtectedLayout noNav><ProductPage /></ProtectedLayout>} />
      <Route path="/chat/:productId" element={<ProtectedLayout noNav><SellerChatPage /></ProtectedLayout>} />
      <Route path="/my-listings" element={<ProtectedLayout noNav><MyListingsPage /></ProtectedLayout>} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<div className="page-loading" role="status">Завантаження...</div>}>
          <AppRoutes />
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  )
}
