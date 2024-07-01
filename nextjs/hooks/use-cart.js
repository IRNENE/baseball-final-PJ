import { createContext, useState, useContext } from 'react'
const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [productTotal, setProductTotal] = useState(0)
  const [courseTotal, setCourseTotal] = useState(0)
  const [rentTotal, setRentTotal] = useState(0)
  console.log(
    'CartProvider: productTotal, courseTotal, rentTotal',
    productTotal,
    courseTotal,
    rentTotal
  )
  const setTotal = (type, amount) => {
    console.log(`Setting total for ${type}: ${amount}`) // 打印即将设置的类型和金额
    switch (type) {
      case 'product':
        setProductTotal(amount)
        break
      case 'course':
        setCourseTotal(amount)
        break
      case 'rent':
        setRentTotal(amount)
        break
      default:
        break
    }
  }

  const getTotal = () => {
    return productTotal + courseTotal + rentTotal
  }

  return (
    // value屬性提供資料給提供者階層以下的所有後代元件
    <CartContext.Provider value={{ setTotal, getTotal }}>
      {children}
    </CartContext.Provider>
  )
}

// 3. 提供一個包裝好的useContext名稱
// 提供給消費者(consumer)們方便使用
export const useCart = () => useContext(CartContext)

// export const useCart = () => {
//   const context = useContext(CartContext)
//   if (context === undefined) {
//     throw new Error('useCart must be used within a CartProvider')
//   }
//   return context
// }
