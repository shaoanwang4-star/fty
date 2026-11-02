import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="center">
      <div className="panel">
        <h2>未找到资源</h2>
        <p>您访问的页面不存在或链接已失效。</p>
        <div className="actions" style={{marginTop:12}}>
          <Link className="btn primary" to="/">返回首页</Link>
          <Link className="btn" to="/favorites">查看收藏</Link>
        </div>
      </div>
    </div>
  )
}