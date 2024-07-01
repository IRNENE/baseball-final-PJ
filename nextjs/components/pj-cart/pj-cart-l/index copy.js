import React from 'react'
import styles from './cart-l.module.css'
import { FaTrashAlt } from 'react-icons/fa'
import { useCart } from '@/hooks/use-cart'
import { useEffect, useState } from 'react'
import { initUserData, useAuth } from '@/hooks/use-auth'
import { useCartContext } from '@/context/CartContext'
import { useTotalAmount } from '@/context/CartPrice'
import Image from 'next/image'
export default function CartLesson() {
  const { auth } = useAuth()
  const userId = auth.userData.id
  const [data, setData] = useState([])
  // 紀錄商品信息
  const [products, setProducts] = useState([])

  // 商品數量
  const [quantities, setQuantities] = useState({})
  //個別商品全選狀態
  const { selectAllCourses, setSelectAllCourses } = useCartContext()
  const { courseTotal, setCourseTotal } = useTotalAmount()

  const fetchData = async () => {
    console.log(`Fetching data for userId: ${userId}`)
    try {
      const response = await fetch(
        // 要注意檔案路由!!cart/product
        `http://localhost:3005/api/cart/lesson/${userId}`
      )
      const data = await response.json()
      setData(data) // 设置数据状态
      // console.log('Received course data:', data)
      const updatedProducts = data.map((product) => ({
        ...product,
        isSelected: selectAllCourses, // 初始化时根据全选状态设置
      }))
      // 初始化每個商品的數量
      const initialQuantities = {}
      data.forEach((product) => {
        initialQuantities[product.c_id] = product.c_amount // 假設 p_amount 是數量
      })
      setQuantities(initialQuantities)
      setProducts(updatedProducts)
      // console.log('course products data:', updatedProducts)
      const productIds = updatedProducts.map((product) => product.c_id)
      // console.log('productIds:', productIds)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  // 初次渲染呈現cart-product頁面
  useEffect(() => {
    if (userId > 0) {
      fetchData()
    }
  }, [userId]) // 依赖于 userId

  // 全選
  useEffect(() => {
    setProducts((products) =>
      products.map((product) => ({
        ...product,
        isSelected: selectAllCourses,
      }))
    )
  }, [selectAllCourses])

  // 全选切换与单个商品选中逻辑优化
  useEffect(() => {
    const newTotal = calculateTotal() // 重新计算总金额
    setCourseTotal(newTotal)
    // console.log('更新后的总金额:', newTotal)
  }, [
    selectAllCourses,
    quantities,
    products.map((product) => product.isSelected),
  ]) // 添加依赖

  const handleSelectProduct = (productId) => {
    setProducts((products) => {
      const updatedProducts = products.map((product) => {
        return product.c_id === productId
          ? { ...product, isSelected: !product.isSelected }
          : product
      })
      // const updatedProducts = products.map((product) => {
      //   if (product.c_id === productId) {
      //     return { ...product, isSelected: !product.isSelected }
      //   }
      //   return product
      // })

      // 检查是否所有商品都被选中
      const allSelected = updatedProducts.every((product) => product.isSelected)
      setSelectAllCourses(allSelected) // 更新组件内全选状态
      updateTotalPrice(updatedProducts) // 更新总金额

      return updatedProducts
    })
  }

  // 更新总金额函数
  const updateTotalPrice = (updatedProducts) => {
    const newTotal = updatedProducts.reduce((total, product) => {
      return product.isSelected
        ? total + quantities[product.c_id] * product.c_price
        : total
    }, 0)
    setCourseTotal(newTotal)
    console.log('更新后的总金额:', newTotal)
  }

  useEffect(() => {
    // 当商品列表或数量变化时，重新计算总金额
    updateTotalPrice(products)
  }, [products, quantities])

  // 全选切换函数
  const handleToggleAllProducts = () => {
    const newSelectAll = !selectAllCourses
    setSelectAllCourses(newSelectAll)
    setProducts((currentProducts) =>
      currentProducts.map((product) => ({
        ...product,
        isSelected: newSelectAll,
      }))
    )
  }

  const increment = () => {
    const newQuantity = quantity + 1
    handleQuantityChange(newQuantity)
  }

  const decrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1
      handleQuantityChange(newQuantity)
    }
  }
  // 计算总金额的方法
  const calculateTotal = () => {
    return products.reduce((acc, product) => {
      if (product.isSelected) {
        acc += quantities[product.c_id] * product.c_price
      }
      return acc
    }, 0)
  }
  const calculateTotalPrice = (price, quantity) => {
    return price * quantity
  }
  // 更新數量的函數
  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      // 如果新的数量小于1，则不更新数量
      return
    }
    setQuantities((prev) => ({ ...prev, [productId]: newQuantity }))

    try {
      // 發送 Patch 請求到後端更新數量
      const response = await fetch(
        `http://localhost:3005/api/cart/course/update-quantity`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
            productId: productId,
            newQuantity: newQuantity,
          }),
        }
      )
      if (!response.ok) {
        throw new Error('Failed to update c qty.')
      }

      console.log('qty c updated successfully!')
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [productId]: newQuantity,
      }))
    } catch (error) {
      console.error('Failed to update color:', error)
    }
  }

  // 刪除
  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:3005/api/cart/del/lesson/${userId}/${productId}`,
        {
          method: 'DELETE',
        }
      )
      const data = await response.json()
      if (response.ok) {
        console.log('Delete c response:', data.message)
        // 重新獲取更新後的購物車數據
        fetchData()
      } else {
        throw new Error(data.message || 'Failed to delete the cart item.')
      }
    } catch (error) {
      console.error('Error deleting cart item:', error)
    }
  }

  return (
    <>
      {/* <!-- 一般課程內容 --> */}
      {/* <!-- 課程全選框 --> */}
      {data.length > 0 && (
        <div
          className={`row w-100 ${styles['cart-l-select']} mt-3`}
          style={{
            height: '38px',
          }}
        >
          <div className={`col-sm-12 col-12`}>
            <input
              type="checkbox"
              id="select-all-products"
              checked={selectAllCourses}
              onChange={() => setSelectAllCourses(!selectAllCourses)}
            />

            <label htmlFor="select-all">
              <h6>課程項目</h6>
            </label>
          </div>
        </div>
      )}
      {/* <!-- 課程全選框 結尾--> */}
      {/* <!-- 桌機板-課程標題  --> */}
      {data.length > 0 && (
        <div
          className={`row w-100  ${styles['cart-l-title']}`}
          style={{ margin: '0', padding: '0' }}
        >
          <div className={styles['l-title']} style={{ width: '250px' }}>
            商品訊息
          </div>

          <div className={styles['l-title']} style={{ width: '650px' }}>
            課程內容
          </div>
          <div
            className={`col-auto ${styles['l-title']}`}
            style={{ marginRight: '80px' }}
          >
            售價
          </div>
          <div
            className={`${`p-title`} col-auto`}
            style={{ marginRight: '80' }}
          >
            數量
          </div>
          <div className={` ${`p-title`} col-auto`}>合計</div>
          <div className={`col-auto ${styles['l-title']}`}></div>
        </div>
      )}
      {/* <!-- 桌機板-課程標題 結尾-->
        <!-- 課程內容-->
        <!-- 課程勾選框 --> */}
      {products.map((product, index) => (
        <div key={index} className={`row w-100 ${styles['cart-l-item']} mb-5`}>
          <div className={`col-sm-1 col-12 ${styles['l-select']}`}>
            <input
              type="checkbox"
              checked={product.isSelected}
              onChange={() => handleSelectProduct(product.c_id)}
            />
            <label></label>
          </div>
          {/* <!-- 課程勾選框結尾 -->
          <!-- 課程照片--> */}
          <div className={`col-sm-2 col-4 ${styles['l-info-img']}`}>
            <div className={styles['l-img']}>
              <Image
                src={`/images/course/${product.img}`}
                alt={product.name}
                width={150}
                height={150}
                objectFit="cover"
              />
            </div>
          </div>
          {/* <!-- 課程照片結尾 -->
          <!-- 課程內容桌機+手機 --> */}
          <div className={` col-sm-9 col-8 ${styles['l-info-content']}`}>
            <div className={`${styles['l-info']}`}>
              <p className={`mt-1`}>類型 : {product.type_name}</p>
              <h5 className={`mt-1`}>{product.c_name}</h5>
              <p className={`mt-1`}>教練 : {product.t_name}</p>
              <p className={`mt-1`}>課程 : {product.c_des}</p>
              <p className={`mt-1`}>
                時間 : {product.c_start} ~ {product.c_end}
              </p>
              {/* <p className={`mt-1`}>{product.c_end}</p> */}
              {/* <div className={`${styles['li-info']}`}> */}
              {/* <div className={`mt-1`}>
                  <li>部分球種的球路設計標準化流程</li>
                  <li>討論度高的球種分析</li>
                  <li>對於困難個案的邏輯</li>
                </div>
                <div className={`mt-1 `} style={{ marginLeft: '15px' }}>
                  <li>常用的外部、內部指導語</li>
                  <li>手腕前臂的動作缺失的簡易解套方式</li>
                  <li>不限/有無基礎皆可</li>
                </div> */}
              {/* </div> */}
            </div>

            <div className={`d-sm-block d-none ${styles['l-price']}`}>
              <p>
                {calculateTotalPrice(product.c_price, quantities[product.c_id])}
              </p>
              {/* 
              <p>
                {' '}
                {calculateTotalPrice(product.c_price, quantities[product.c_id])}
              </p> */}
            </div>
            {/* <!-- 課程按鈕:刪除--> */}

            <div className={styles['l-btn-group']}>
              <div className={`d-sm-none d-block ${styles['l-price']}`}>
                {/* <p>{product.c_price}</p>
                <p>{product.c_price}</p> */}
              </div>
              {/* <!-- 拆小塊-刪除功能 --> */}
              <div className={`mb-1 ${styles['l-del-btn']}`}>
                {/* <button type="button" onClick={onDelete}> */}
                <button
                  type="button"
                  onClick={() => handleDeleteProduct(product.c_id)}
                >
                  <FaTrashAlt color="var(--main)" size={20} />
                </button>
                <input type="hidden" value={quantities[product.c_id]} />
              </div>
              {/* <!-- 拆小塊-刪除功能 結尾 --> */}
            </div>
            {/* <!-- 課程按鈕: 刪除 結尾--> */}
          </div>
          {/* <!-- 課程內容桌機+手機 --> */}
        </div>
      ))}
      {/* <!-- 課程內容 結尾 -->

        <!-- 一般課程內容 結尾--> */}
    </>
  )
}
