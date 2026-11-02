import React from 'react'
import { comics } from '../data/mock'
import { getFavorites } from '../utils/storage'
import { Link } from 'react-router-dom'

export default function Favorites() {
  const favs = getFavorites()
  const data = comics.filter(c => favs.includes(c.id))
  return (
    <div>
      <h2>我的收藏</h2>
      {data.length === 0 ? (
        <p>还没有收藏，去主页添加吧。</p>
      ) : (
        <div className="grid">
          {data.map(c => (
            <div className="card" key={c.id}>
              <img src={c.cover} alt={c.title} />
              <div className="card-body">
                <h3>{c.title}</h3>
                <Link className="btn primary" to={`/reader/${c.id}`}>阅读</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}