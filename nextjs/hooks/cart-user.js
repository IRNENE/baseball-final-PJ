import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { debounce } from 'lodash'
// 初始化購物車狀態
const initialCartState = {
  items: [],
  totalAmount: 0,
}

const cartUser = () => {
  const [cart, setCart] = useState(initialCartState)
  const { auth } = useAuth()
  const userId = auth.userData?.id

  // 從後端獲取購物車狀態
  const fetchCart = debounce(async () => {
    if (!userId) return
    try {
      const response = await fetch(
        `http://localhost:3005/api/cart-icon/${userId}`
      )
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      // console.log('Fetched cart data:', data)
      const totalAmount = data.reduce((sum, item) => {
        return sum + item.p_amount + item.r_amount + item.c_amount
      }, 0)
      // console.log('Fetched cart data:', totalAmount)
      setCart({
        items: data,
        totalAmount: totalAmount,
      })
    } catch (error) {
      console.error('Error fetching cart:', error)
    }
  }, 300)

  // 當 userId 改變時，重新獲取購物車狀態
  useEffect(() => {
    if (userId) {
      fetchCart()
    }
  }, [userId])
  // 当 cart 状态变化时，重新获取购物车状态
  useEffect(() => {
    fetchCart()
    // console.log('Current cart state:', cart.totalAmount)
  }, [cart.items]) // 监听购物车商品变化
  // 监听 cart 状态变化并打印
  // useEffect(() => {
  //   console.log('Current cart state:', cart)
  // }, [cart])

  return {
    cart,
    fetchCart,
  }
}

export default cartUser
