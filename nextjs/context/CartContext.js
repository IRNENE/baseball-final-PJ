import React, { createContext, useState, useContext, useEffect } from 'react'

const CartContext = createContext()

export function useCartContext() {
  return useContext(CartContext)
}

export const CartProviderSelect = ({ children }) => {
  const [selectAll, setSelectAll] = useState(false)
  // 新增全選商品和全選課程狀態和租用
  const [selectAllProducts, setSelectAllProducts] = useState(false)
  const [selectAllRents, setSelectAllRents] = useState(false)
  const [selectAllCourses, setSelectAllCourses] = useState(false)

  useEffect(() => {
    if (selectAllProducts && selectAllCourses && selectAllRents) {
      setSelectAll(true)
    } else {
      setSelectAll(false)
    }
  }, [selectAllProducts, selectAllCourses, selectAllRents])

  return (
    <CartContext.Provider
      value={{
        selectAll,
        setSelectAll,
        selectAllProducts,
        setSelectAllProducts,
        selectAllCourses,
        setSelectAllCourses,
        selectAllRents,
        setSelectAllRents,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
