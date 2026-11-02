import React from 'react'
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Reader from './pages/Reader'
import Favorites from './pages/Favorites'
import Purchase from './pages/Purchase'
import NotFound from './pages/NotFound'
import Header from './components/Header'
import { isLoggedIn, getPurchases } from './utils/storage'

function RequireAuth({ children }) {
  const nav = useNavigate()
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default function App() {
  return (
    <div className="app">
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/favorites" element={<RequireAuth><Favorites /></RequireAuth>} />
          <Route path="/reader/:id" element={<RequireAuth><Reader /></RequireAuth>} />
          <Route path="/purchase/:id" element={<RequireAuth><Purchase /></RequireAuth>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <footer className="footer">
        <p>© 2025 电子漫画书 Demo</p>
        <Link to="/">返回主页</Link>
      </footer>
    </div>
  )
}