import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { comics } from '../data/mock'
import { addComment, getComments, addDanmaku, getDanmaku, likeComment, replyComment, likeReply } from '../utils/storage'

export default function Reader() {
  const { id } = useParams()
  const comic = comics.find(c => c.id === id)
  const [page, setPage] = useState(1)
  const [text, setText] = useState('')
  const [cmt, setCmt] = useState('')
  const [danmakuEnabled, setDanmakuEnabled] = useState(false)
  const [danmakuList, setDanmakuList] = useState(getDanmaku(id))
  const [comments, setComments] = useState(getComments(id))
  const [replyInputs, setReplyInputs] = useState({})
  const overlayRef = useRef(null)
  const touchStart = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const onTouchStart = (e) => {
    const t = e.touches[0]
    touchStart.current = { x: t.clientX, y: t.clientY }
  }
  const onTouchEnd = (e) => {
    const t = e.changedTouches[0]
    const dx = t.clientX - touchStart.current.x
    const dy = t.clientY - touchStart.current.y
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next()
      else prev()
    }
  }

  const pageImg = useMemo(() => `https://picsum.photos/seed/${id}-${page}/860/1200`, [id, page])
  const fallbackSvg = 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="860" height="1200"><rect width="100%" height="100%" fill="#111"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#888" font-size="24">图片加载失败</text></svg>`) 

  if (!comic) return <p>漫画不存在</p>

  const next = () => setPage(p => Math.min(p + 1, comic.pages.length))
  const prev = () => setPage(p => Math.max(p - 1, 1))
  const jump = (n) => setPage(() => Math.min(Math.max(1, n), comic.pages.length))

  const sendDanmaku = () => {
    if (!text.trim()) return
    const top = Math.floor(Math.random() * 80) + 10 // 10%~90%
    const color = `hsl(${Math.floor(Math.random()*360)},80%,60%)`
    const item = { text, top, color }
    addDanmaku(id, item)
    setDanmakuList(getDanmaku(id))
    setText('')
  }

  const sendComment = () => {
    if (!cmt.trim()) return
    addComment(id, { content: cmt })
    setComments(getComments(id))
    setCmt('')
  }

  const onLikeComment = (cid) => {
    likeComment(id, cid)
    setComments(getComments(id))
  }

  const onReplyChange = (cid, value) => {
    setReplyInputs(prev => ({ ...prev, [cid]: value }))
  }
  const onReplySubmit = (cid) => {
    const content = (replyInputs[cid] || '').trim()
    if (!content) return
    replyComment(id, cid, { content })
    setReplyInputs(prev => ({ ...prev, [cid]: '' }))
    setComments(getComments(id))
  }
  const onLikeReply = (cid, rid) => {
    likeReply(id, cid, rid)
    setComments(getComments(id))
  }

  const isLastPage = page === comic.pages.length
  const sortedComments = [...comments].sort((a,b) => (b.likes||0)-(a.likes||0))

  return (
    <div className="reader">
      <div className="toolbar">
        <button className="btn" onClick={prev}>上一页</button>
        <span>第 {page} / {comic.pages.length} 页</span>
        <button className="btn" onClick={next}>下一页</button>
        <input type="number" min={1} max={comic.pages.length} value={page} onChange={e=>jump(Number(e.target.value))} style={{width:80}}/>
        <button className="btn" onClick={() => setDanmakuEnabled(v => !v)}>{danmakuEnabled ? '关闭弹幕' : '开启弹幕'}</button>
      </div>
      <div className="page" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <img src={pageImg} alt={`p${page}`} onError={(e)=>{e.currentTarget.src=fallbackSvg}} />
        <button className="page-arrow page-arrow-left" onClick={prev} disabled={page === 1} aria-label="上一页">‹</button>
        <button className="page-arrow page-arrow-right" onClick={next} disabled={isLastPage} aria-label="下一页">›</button>
        <div className="page-hit page-hit-left" onClick={prev} />
        <div className="page-hit page-hit-right" onClick={next} />
        {danmakuEnabled && (
          <div className="overlay" ref={overlayRef}>
            {danmakuList.map(dm => (
              <span key={dm.id} className="bullet" style={{ top: `${dm.top}%`, color: dm.color }}>
                {dm.text}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="panel">
        <h3>发送弹幕</h3>
        <div className="inline">
          <input value={text} onChange={e=>setText(e.target.value)} placeholder="输入弹幕内容" />
          <button className="btn" onClick={sendDanmaku}>发送</button>
        </div>
      </div>
      <div className="panel">
        <h3>评论区</h3>
        <div className="inline">
          <input value={cmt} onChange={e=>setCmt(e.target.value)} placeholder="输入评论" />
          <button className="btn" onClick={sendComment}>提交</button>
        </div>
        <ul className="comments">
          {comments.map(x => (
            <li key={x.id} className="comment-item">
              <div>{x.content}</div>
              <div className="comment-meta">
                <span>{new Date(x.ts).toLocaleString()}</span>
                <span>👍 {x.likes || 0}</span>
                <button className="btn" onClick={() => onLikeComment(x.id)}>点赞</button>
                <button className="btn" onClick={() => onReplySubmit(x.id)}>回复</button>
              </div>
              <div className="reply-input">
                <input value={replyInputs[x.id] || ''} onChange={e=>onReplyChange(x.id, e.target.value)} placeholder="输入回复" />
              </div>
              {x.replies && x.replies.length > 0 && (
                <ul className="reply-list">
                  {x.replies.map(r => (
                    <li key={r.id} className="reply-item">
                      <div>{r.content}</div>
                      <div className="comment-meta">
                        <span>{new Date(r.ts).toLocaleString()}</span>
                        <span>👍 {r.likes || 0}</span>
                        <button className="btn" onClick={() => onLikeReply(x.id, r.id)}>点赞</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      {isLastPage && (
        <div className="panel">
          <h3>本话评论大合集（按点赞量排序）</h3>
          <ul className="comments">
            {sortedComments.map(x => (
              <li key={x.id} className="comment-item">
                <div>{x.content}</div>
                <div className="comment-meta">
                  <span>👍 {x.likes || 0}</span>
                  <span>{new Date(x.ts).toLocaleString()}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}