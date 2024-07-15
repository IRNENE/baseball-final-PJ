import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react'

import { useAuth } from '@/hooks/use-auth'
import { debounce } from 'lodash'
// 初始化購物車狀態
const CartContext = createContext(null)
export const initCartData = {
  items: [],
  totalAmount: 0,
}
export const CartStateProvider = ({ children }) => {
  const [cart, setCart] = useState(initCartData)
  const { auth } = useAuth()
  const userId = auth.userData?.id
  const prevTotalAmount = useRef(cart.totalAmount)

  // 從後端獲取購物車狀態
  const fetchCart = async () => {
    if (!userId) return
    try {
      const response = await fetch(
        `http://localhost:3005/api/cart-icon/${userId}`
      )
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      const totalAmount = data.reduce((sum, item) => {
        return sum + item.p_amount + item.r_amount + item.c_amount
      }, 0)
      console.log('Fetched cart data:', totalAmount)
      setCart({
        items: data,
        totalAmount: totalAmount,
      })
    } catch (error) {
      console.error('Error fetching cart:', error)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchCart()
    }
  }, [userId])
  // 当 cart 状态变化时，重新获取购物车状态
  // 当 cart 数量变化时，重新获取购物车状态，以获取最新数量
  useEffect(() => {
    if (cart.totalAmount !== prevTotalAmount.current) {
      fetchCart()
    }
    prevTotalAmount.current = cart.totalAmount
  }, [cart.items])

  return (
    <CartContext.Provider value={{ cart, setCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  )
}
export const cartUser = () => useContext(CartContext)
