import styles from './cart-r.module.css'
import { FaTrashAlt } from 'react-icons/fa'
import { useCart } from '@/hooks/use-cart'
import { useEffect, useState } from 'react'
import { initUserData, useAuth } from '@/hooks/use-auth'
import { useCartContext } from '@/context/CartContext'
import { useTotalAmount } from '@/context/CartPrice'
import Image from 'next/image'

export default function CartRentProduct() {
  const { auth } = useAuth()
  const userId = auth.userData.id
  const [data, setData] = useState([])
  // 紀錄商品信息
  const [products, setProducts] = useState([])

  // 商品數量
  const [quantities, setQuantities] = useState({})
  //個別商品全選狀態
  const { selectAllRents, setSelectAllRents } = useCartContext()
  const { rentTotal, setRentTotal } = useTotalAmount()

  const fetchData = async () => {
    console.log(`Fetching data for userId: ${userId}`)
    try {
      const response = await fetch(
        // 要注意檔案路由!!cart/product
        `http://localhost:3005/api/cart/rent/${userId}`
      )
      const data = await response.json()
      setData(data) // 设置数据状态
      // setProducts(data);
      console.log('Received r data:', data)
      const updatedProducts = data.map((product) => ({
        ...product,
        isSelected: selectAllRents, // 初始化时根据全选状态设置
      }))
      // 初始化每個商品的數量
      const initialQuantities = {}
      data.forEach((product) => {
        initialQuantities[product.r_id] = product.r_amount // 假設 p_amount 是數量
      })
      setQuantities(initialQuantities)
      setProducts(updatedProducts)
      // console.log('products data:', updatedProducts)
      const productIds = updatedProducts.map((product) => product.r_id)
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
        isSelected: selectAllRents,
      }))
    )
  }, [selectAllRents])

  // 全选切换与单个商品选中逻辑优化
  useEffect(() => {
    const newTotal = calculateTotal() // 重新计算总金额
    setRentTotal(newTotal)
    // console.log('更新后的总金额:', newTotal)
  }, [
    selectAllRents,
    quantities,
    products.map((product) => product.isSelected),
  ]) // 添加依赖

  const handleSelectProduct = (productId) => {
    setProducts((products) => {
      const updatedProducts = products.map((product) => {
        if (product.r_id === productId) {
          return { ...product, isSelected: !product.isSelected }
        }
        return product
      })

      // 检查是否所有商品都被选中
      const allSelected = updatedProducts.every((product) => product.isSelected)
      setSelectAllRents(allSelected) // 更新组件内全选状态
      updateTotalPrice(updatedProducts) // 更新总金额
      return updatedProducts
    })
  }

  // 更新总金额函数
  const updateTotalPrice = (updatedProducts) => {
    const newTotal = updatedProducts.reduce((total, product) => {
      return product.isSelected
        ? total +
            quantities[product.r_id] * Math.round(product.rent_price * 0.8)
        : total
    }, 0)
    setRentTotal(newTotal)
    console.log('更新后的总金额:', newTotal)
  }

  useEffect(() => {
    // 当商品列表或数量变化时，重新计算总金额
    updateTotalPrice(products)
  }, [products, quantities])

  // 全选切换函数
  const handleToggleAllProducts = () => {
    const newSelectAll = !selectAllRents
    setSelectAllRents(newSelectAll)
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
        acc += quantities[product.r_id] * Math.round(product.rent_price * 0.8)
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
        `http://localhost:3005/api/cart/rent/update-quantity`,
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
        throw new Error('Failed to update rent product qty.')
      }

      // console.log('rent qty updated successfully!')
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [productId]: newQuantity,
      }))
    } catch (error) {
      console.error('Failed to update rent:', error)
    }
  }
  // 刪除
  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:3005/api/cart/rent/del/${userId}/${productId}`,
        {
          method: 'DELETE',
        }
      )
      const data = await response.json()
      if (response.ok) {
        console.log('Delete rent response:', data.message)
        // 重新獲取更新後的購物車數據
        await fetchData()
        setTimeout(() => {
          window.location.reload()
        }, 500) // 添加一个小的延迟，通常500毫秒足够了
      } else {
        throw new Error(data.message || 'Failed to delete the cart item.')
      }
    } catch (error) {
      console.error('Error deleting cart item:', error)
    }
  }

  return (
    <>
      {/* <!-- 租用商品內容 -->
        <!-- 租用商品全選框 --> */}
      {data.length > 0 && (
        <div className={`row w-100 ${styles['cart-r-select']} mt-3`}>
          <div
            className={`col-sm-12 col-12`}
            style={{
              height: '38px',
            }}
          >
            <input
              type="checkbox"
              id="select-all-rents"
              checked={selectAllRents}
              onChange={() => setSelectAllRents(!selectAllRents)}
            />

            <label for="cart-r">
              <h6>商品租借</h6>
            </label>
          </div>
        </div>
      )}
      {/* <!-- 租用商品全選框 結尾-->
        <!-- 桌機板-租用商品標題  --> */}
      {data.length > 0 && (
        <div
          className={`row w-100 ${styles['cart-r-title']}`}
          style={{ margin: '0', padding: '0' }}
        >
          <div className={styles['r-title']} style={{ width: '500px' }}>
            租用商品訊息
          </div>
          <div className={` ${styles['r-title']}`} style={{ width: '140px' }}>
            租用日期
          </div>
          <div
            className={styles['r-title']}
            style={{ width: '230px', marginRight: '25px' }}
          >
            尺寸/顏色
          </div>
          <div
            className={`col-auto ${styles['r-title']}`}
            style={{ marginRight: '30px' }}
          >
            租用售價
          </div>
          <div
            className={`${styles['r-title']}`}
            style={{ width: '180px', paddingRight: '80px' }}
          >
            數量
          </div>
          <div className={`col-auto ${styles['r-title']}`}>合計</div>
          <div className={`col-auto ${styles['r-title']}`}></div>
        </div>
      )}
      {/* <!-- 桌機板-租用商品標題 結尾-->
        <!-- 租用商品內容-->
        <!-- 租用商品勾選框 --> */}
      {products.map((product, index) => (
        <div key={index} className={`row w-100 ${styles['cart-r-item']}`}>
          <div className={`col-sm-1 col-12 ${styles['r-select']}`}>
            <input
              type="checkbox"
              checked={product.isSelected}
              onChange={() => handleSelectProduct(product.r_id)}
            />
            <label for="r-select"></label>
          </div>
          {/* <!-- 租用商品勾選框結尾 -->
          <!-- 租用商品照片--> */}
          <div className={`col-sm-1 col-4 ${styles['r-info-img']}`}>
            <div className={`${styles['r-img']}`}>
              {/* <img src={`/images/rent/${product.img}`} alt={product.name} /> */}

              <Image
                src={`/images/rent/${product.img}`}
                alt={product.name}
                width={80}
                height={80}
                objectFit="cover"
              />
            </div>
          </div>
          {/* <!-- 租用商品照片結尾 -->
          <!-- 租用商品內容桌機+手機 --> */}
          <div className={`col-sm-10 col-8 ${styles['r-info-content']}`}>
            <div className={styles['r-info']}>
              <p>{product.r_name}</p>
            </div>
            {/* 日期 */}
            <div className={styles['r-date']} style={{ width: '150px' }}>
              <input
                type="date"
                className={`w-100 mb-2`}
                value={product.start_time}
                disabled
              />
              <input
                type="date"
                className={`w-100`}
                value={product.end_time}
                disabled
              />
            </div>
            {/* 日期 */}
            {/* <!-- 拆小塊選擇規格 --> */}
            <div className={styles['r-category']}>
              <div className={styles['r-category-item']}>
                <label
                  htmlFor={`size-${product.r_id}`}
                  style={{ fontSize: 'var(--p)', marginRight: '3px' }}
                >
                  尺寸
                </label>
                <select
                  id={`size-${product.r_id}`}
                  name="size"
                  value={product.r_size}
                  disabled
                >
                  <option key={product.r_size} value={product.r_size}>
                    {product.r_size}
                  </option>
                </select>
              </div>

              <div className={styles['r-category-item']}>
                <label
                  htmlFor={`color-${product.r_id}`}
                  style={{ fontSize: 'var(--p)', marginRight: '3px' }}
                >
                  顏色
                </label>

                <select
                  id={`color-${product.r_id}`}
                  name="color"
                  value={product.r_color}
                  disabled
                >
                  <option key={product.r_color} value={product.r_color}>
                    {product.r_color}
                  </option>
                </select>
              </div>
            </div>
            {/* <!-- 拆小塊選擇規格 結尾--> */}
            <div className={styles['r-price']}>
              <p style={{ textDecoration: 'line-through' }}>
                {product.rent_price}
              </p>

              <p>{Math.round(product.rent_price * 0.8)}</p>
            </div>
            {/* <!-- 租用商品按鈕: 更改數量+刪除--> */}
            {/* <div className={styles['r-btn-group']} style={{ display: 'flex' }}> */}
            <div
              className={`${styles['r-btn-group']}`}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {/* <!-- 拆小塊-更改數量功能 --> */}
              <div className={styles['r-amount-btn']}>
                <div className={styles['quantity-input']}>
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        product.r_id,
                        quantities[product.r_id] - 1
                      )
                    }
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantities[product.r_id]}
                    onChange={(e) =>
                      handleQuantityChange(
                        product.r_id,
                        parseInt(e.target.value, 10)
                      )
                    }
                    min="1"
                    className={styles['r-amount']}
                  />

                  <button
                    onClick={() =>
                      handleQuantityChange(
                        product.r_id,
                        quantities[product.r_id] + 1
                      )
                    }
                  >
                    +
                  </button>
                </div>
              </div>
              {/* <!-- 拆小塊-更改數量功能 結尾 --> */}
              <div className={` ${styles['r-sum']} d-sm-block d-none mx-4`}>
                {/* <p>
                  {calculateTotalPrice(
                    product.rent_price,
                    quantities[product.r_id]
                  )}
                </p> */}

                <p>
                  {calculateTotalPrice(
                    Math.round(product.rent_price * 0.8),
                    quantities[product.r_id]
                  )}
                </p>
              </div>

              {/* <!-- 拆小塊-刪除功能 --> */}
              <div className={`mb-1 ${styles['r-del-btn']}`}>
                <button
                  type="button"
                  onClick={() => handleDeleteProduct(product.r_id)}
                >
                  <FaTrashAlt color="var(--main)" size={20} />
                </button>
              </div>
              {/* <!-- 拆小塊-刪除功能 結尾 --> */}
            </div>
            {/* <!-- 租用商品按鈕: 更改數量+刪除 結尾--> */}
          </div>
          {/* <!-- 租用商品內容桌機+手機 --> */}
        </div>
      ))}
      {/* <!-- 租用商品內容 結尾 -->
        <!-- 租用商品內容 --> */}
    </>
  )
}
