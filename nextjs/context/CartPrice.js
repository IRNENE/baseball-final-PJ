import React, { createContext, useContext, useState } from 'react'

const TotalAmountContext = createContext()

// export const useTotalAmount = () => useContext(TotalAmountContext)
export function useTotalAmount() {
  return useContext(TotalAmountContext)
}
export const TotalAmountProvider = ({ children }) => {
  const [productTotal, setProductTotal] = useState(0)
  const [courseTotal, setCourseTotal] = useState(0)
  const [rentTotal, setRentTotal] = useState(0)

  const setTotal = (type, amount) => {
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
    <TotalAmountContext.Provider
      value={{
        setTotal,
        getTotal,
        productTotal,
        setProductTotal,
        courseTotal,
        setCourseTotal,
        rentTotal,
        setRentTotal,
      }}
    >
      {children}
    </TotalAmountContext.Provider>
  )
}
