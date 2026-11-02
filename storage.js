const KEY_USER = 'manga_user'
const KEY_FAVORITES = 'manga_favorites'
const KEY_PURCHASES = 'manga_purchases'
const KEY_COMMENTS = 'manga_comments'
const KEY_DANMAKU = 'manga_danmaku'

export function getUser() {
  const raw = localStorage.getItem(KEY_USER)
  return raw ? JSON.parse(raw) : null
}
export function saveUser(user) {
  localStorage.setItem(KEY_USER, JSON.stringify(user))
}
export function isLoggedIn() {
  return !!getUser()
}
export function login(username, password) {
  const user = { username, createdAt: Date.now() }
  saveUser(user)
  return user
}
export function logout() {
  localStorage.removeItem(KEY_USER)
}

export function getFavorites() {
  const raw = localStorage.getItem(KEY_FAVORITES)
  return raw ? JSON.parse(raw) : []
}
export function toggleFavorite(comicId) {
  const favs = new Set(getFavorites())
  if (favs.has(comicId)) favs.delete(comicId)
  else favs.add(comicId)
  localStorage.setItem(KEY_FAVORITES, JSON.stringify([...favs]))
  return [...favs]
}
export function isFavorite(comicId) {
  return getFavorites().includes(comicId)
}

export function getPurchases() {
  const raw = localStorage.getItem(KEY_PURCHASES)
  return raw ? JSON.parse(raw) : []
}
export function purchase(comicId) {
  const list = new Set(getPurchases())
  list.add(comicId)
  localStorage.setItem(KEY_PURCHASES, JSON.stringify([...list]))
  return [...list]
}
export function isPurchased(comicId) {
  return getPurchases().includes(comicId)
}

// 评论：支持点赞与回复
function readCommentsMap() {
  const raw = localStorage.getItem(KEY_COMMENTS)
  return raw ? JSON.parse(raw) : {}
}
function writeCommentsMap(map) {
  localStorage.setItem(KEY_COMMENTS, JSON.stringify(map))
}
export function getComments(comicId) {
  const map = readCommentsMap()
  return map[comicId] || []
}
export function addComment(comicId, comment) {
  const map = readCommentsMap()
  const list = map[comicId] || []
  const item = {
    id: Math.random().toString(36).slice(2),
    ts: Date.now(),
    content: comment.content,
    likes: 0,
    replies: [],
  }
  list.push(item)
  map[comicId] = list
  writeCommentsMap(map)
  return list
}
export function likeComment(comicId, commentId) {
  const map = readCommentsMap()
  const list = map[comicId] || []
  const item = list.find(x => x.id === commentId)
  if (item) {
    item.likes = (item.likes || 0) + 1
    writeCommentsMap(map)
  }
  return list
}
export function replyComment(comicId, parentId, reply) {
  const map = readCommentsMap()
  const list = map[comicId] || []
  const item = list.find(x => x.id === parentId)
  if (item) {
    const r = {
      id: Math.random().toString(36).slice(2),
      ts: Date.now(),
      content: reply.content,
      likes: 0,
    }
    item.replies = item.replies || []
    item.replies.push(r)
    writeCommentsMap(map)
  }
  return list
}
export function likeReply(comicId, parentId, replyId) {
  const map = readCommentsMap()
  const list = map[comicId] || []
  const item = list.find(x => x.id === parentId)
  if (item && item.replies) {
    const r = item.replies.find(y => y.id === replyId)
    if (r) {
      r.likes = (r.likes || 0) + 1
      writeCommentsMap(map)
    }
  }
  return list
}

// 弹幕
function readDanmakuMap() {
  const raw = localStorage.getItem(KEY_DANMAKU)
  return raw ? JSON.parse(raw) : {}
}
function writeDanmakuMap(map) {
  localStorage.setItem(KEY_DANMAKU, JSON.stringify(map))
}
export function getDanmaku(comicId) {
  const map = readDanmakuMap()
  return map[comicId] || []
}
export function addDanmaku(comicId, item) {
  const map = readDanmakuMap()
  const list = map[comicId] || []
  list.push({ ...item, id: Math.random().toString(36).slice(2), ts: Date.now() })
  map[comicId] = list
  writeDanmakuMap(map)
  return list
}