import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { comics } from '../data/mock'
import { purchase } from '../utils/storage'

export default function Purchase() {
  const { id } = useParams()
  const nav = useNavigate()
  const comic = comics.find(c => c.id === id)

  const onPay = () => {
    purchase(id)
    nav(`/reader/${id}`)
  }

  if (!comic) return <p>漫画不存在</p>

  return (
    <div className="center">
      <div className="panel">
        <h2>购买漫画：{comic.title}</h2>
        <p>价格：¥{comic.price}（模拟支付，测试环境）</p>
        <button className="btn primary" onClick={onPay}>模拟支付并解锁</button>
      </div>
    </div>
  )
}