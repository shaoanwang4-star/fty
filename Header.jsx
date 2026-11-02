import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { isLoggedIn, getUser, logout } from '../utils/storage'

export default function Header() {
  const nav = useNavigate()
  const user = getUser()
  const onLogout = () => {
    logout()
    nav('/')
  }

  return (
    <header className="header">
      <div className="logo">📚 电子漫画书</div>
      <nav className="nav">
        <Link to="/">首页</Link>
        <Link to="/favorites">收藏</Link>
      </nav>
      <div className="auth">
        {isLoggedIn() ? (
          <>
            <span className="user">{user?.username}</span>
            <button className="btn" onClick={onLogout}>退出</button>
          </>
        ) : (
          <Link className="btn" to="/login">登录</Link>
        )}
      </div>
    </header>
  )
}