import React from 'react'
import { Link } from 'react-router-dom'
import { comics } from '../data/mock'
import { isFavorite, toggleFavorite, isPurchased } from '../utils/storage'

const fallbackSvg = 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="300" height="420"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-size="18">封面加载失败</text></svg>`)

export default function Home() {
  const handleFav = (id) => {
    toggleFavorite(id)
  }

  // 每日推荐（按当天日期稳定挑选 3 部）
  const dailyList = (() => {
    const seed = new Date().toDateString()
    let rng = 0
    for (let i = 0; i < seed.length; i++) {
      rng = (rng * 31 + seed.charCodeAt(i)) >>> 0
    }
    const arr = [...comics]
    for (let i = arr.length - 1; i > 0; i--) {
      rng = (rng * 1664525 + 1013904223) >>> 0
      const j = rng % (i + 1)
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr.slice(0, Math.min(3, arr.length))
  })()

  return (
    <div>
      <h2>每日推荐</h2>
      <div className="grid">
        {dailyList.map((c) => (
          <ComicCard key={c.id} c={c} onFav={handleFav} />
        ))}
      </div>

      <h2>全部漫画</h2>
      <div className="grid">
        {comics.map((c) => (
          <ComicCard key={c.id} c={c} onFav={handleFav} />
        ))}
      </div>
    </div>
  )
}

function ComicCard({ c, onFav }) {
  const purchased = isPurchased(c.id)
  return (
    <div className="card">
      <img src={c.cover} alt={c.title} onError={(e)=>{e.currentTarget.src=fallbackSvg}} />
      <div className="card-body">
        <h3>{c.title}</h3>
        <p>{c.author}</p>
        <div className="actions">
          <button className={isFavorite(c.id) ? 'btn active' : 'btn'} onClick={() => onFav(c.id)}>
            {isFavorite(c.id) ? '已收藏' : '收藏'}
          </button>
          {c.locked && !purchased ? (
            <Link className="btn" to={`/purchase/${c.id}`}>购买 ¥{c.price}</Link>
          ) : (
            <Link className="btn primary" to={`/reader/${c.id}`}>阅读</Link>
          )}
        </div>
      </div>
    </div>
  )
}