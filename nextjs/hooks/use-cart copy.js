import { createContext, useState, useContext } from 'react'
const CartContext = createContext(null)

export function CartProvider({ children }) {
  // const [items, setItems] = useState([])

  // //

  // // 加到購物車
  // // item 是要加入的商品物件
  // const addItem = (item) => {
  //   // 先判斷要加入的商品物件是否有在購物車中
  //   const foundIndex = items.findIndex((v, i) => {
  //     return v.id === item.id
  //   })

  //   // 如果有找到
  //   if (foundIndex > -1) {
  //     // 遞增商品
  //     increaseItem(item.id)
  //   } else {
  //     // 否則作新增商品，擴充商品數量屬性qty，預設為1
  //     const newItem = { ...item, qty: 1 }
  //     const nextItems = [...items, newItem]
  //     setItems(nextItems)
  //   }
  // }
  // const calcTotalItems = () => {
  //   let total = 0
  //   for (let i = 0; i < items.length; i++) {
  //     total += items[i].qty
  //   }
  //   return total
  // }

  // const calcTotalPrice = () => {
  //   let total = 0
  //   for (let i = 0; i < items.length; i++) {
  //     total += items[i].qty * items[i].price
  //   }
  //   return total
  // }

  // 陣列迭代方法: reduce(累加、歸納)
  // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
  // const totalItems = items.reduce((acc, v) => acc + v.qty, 0) //初始值設置為 0
  // const totalPrice = items.reduce((acc, v) => acc + v.qty * v.price, 0)

  return (
    // value屬性提供資料給提供者階層以下的所有後代元件
    <CartContext.Provider
      value={
        {
          // items,
          // addItem,
          // totalItems,
          // totalPrice,
        }
      }
    >
      {children}
    </CartContext.Provider>
  )
}

// 3. 提供一個包裝好的useContext名稱
// 提供給消費者(consumer)們方便使用
export const useCart = () => useContext(CartContext)
//刪除
// const removeItem = (id) => {
//   const nextItems = items.filter((v, i) => {
//     return v.id !== id
//   })
//   setItems(nextItems)
// }

// // 遞減
// const decreaseItem = (id) => {
//   // 展開每個成員
//   let nextItems = items.map((v, i) => {
//     //如果符合條件(id===傳入的id)，則修改其中屬性qty-1
//     if (v.id === id && v.qty - 1 > 0) return { ...v, qty: v.qty - 1 }
//     // 否則回傳原本物件
//     else return v
//   })
//   // 過濾掉(刪除掉)數量等於0的濕品
//   nextItems = nextItems.filter((v) => v.qty > 0)
//   setItems(nextItems)
// }

// // 遞增
// const increaseItem = (id) => {
//   // 展開每個成員
//   const nextItems = items.map((v, i) => {
//     //如果符合條件(id===傳入的id)，則修改其中屬性qty+1
//     if (v.id === id) return { ...v, qty: v.qty + 1 }
//     // 否則回傳原本物件
//     else return v
//   })

//   setItems(nextItems)
// }
