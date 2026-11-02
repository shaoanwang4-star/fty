import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../utils/storage'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const nav = useNavigate()

  const onSubmit = (e) => {
    e.preventDefault()
    if (!username) return
    login(username, password)
    nav('/')
  }

  return (
    <div className="center">
      <form className="form" onSubmit={onSubmit}>
        <h2>登录</h2>
        <label>
          用户名
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="输入用户名" />
        </label>
        <label>
          密码
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="输入密码" />
        </label>
        <button className="btn primary" type="submit">登录</button>
      </form>
    </div>
  )
}