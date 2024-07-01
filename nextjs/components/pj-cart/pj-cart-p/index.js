import { FaTrashAlt } from 'react-icons/fa'
import styles from './cart-p.module.css'
import { useEffect, useState } from 'react'
import { initUserData, useAuth } from '@/hooks/use-auth'
import { useCartContext } from '@/context/CartContext'
import { useTotalAmount } from '@/context/CartPrice'
import Image from 'next/image'

export default function CartProduct() {
  const { auth } = useAuth()
  const userId = auth.userData.id
  const [data, setData] = useState([])
  // 紀錄商品信息
  const [products, setProducts] = useState([])

  // 商品數量
  const [quantities, setQuantities] = useState({})
  //個別商品全選狀態
  const { selectAllProducts, setSelectAllProducts } = useCartContext()
  const { productTotal, setProductTotal } = useTotalAmount()

  const fetchData = async () => {
    console.log(`Fetching data for userId: ${userId}`)
    try {
      const response = await fetch(
        // 要注意檔案路由!!cart/product
        `http://localhost:3005/api/cart/product/${userId}`
      )
      const data = await response.json()
      setData(data) // 设置数据状态
      // setProducts(data);
      // console.log('Received p data:', data)
      const updatedProducts = data.map((product) => ({
        ...product,
        isSelected: selectAllProducts, // 初始化时根据全选状态设置
      }))
      // 初始化每個商品的數量
      const initialQuantities = {}
      data.forEach((product) => {
        initialQuantities[product.p_id] = product.p_amount // 假設 p_amount 是數量
      })
      setQuantities(initialQuantities)
      setProducts(updatedProducts)
      // console.log('products data:', updatedProducts)
      const productIds = updatedProducts.map((product) => product.p_id)
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
        isSelected: selectAllProducts,
      }))
    )
  }, [selectAllProducts])

  // 全选切换与单个商品选中逻辑优化
  useEffect(() => {
    const newTotal = calculateTotal() // 重新计算总金额
    setProductTotal(newTotal)
    // console.log('更新后的总金额:', newTotal)
  }, [
    selectAllProducts,
    quantities,
    products.map((product) => product.isSelected),
  ]) // 添加依赖

  const handleSelectProduct = (productId) => {
    setProducts((currentProducts) => {
      const updatedProducts = currentProducts.map((product) => {
        return product.p_id === productId
          ? { ...product, isSelected: !product.isSelected }
          : product
      })

      // 检查是否所有产品都被选中
      const allSelected = updatedProducts.every((product) => product.isSelected)
      setSelectAllProducts(allSelected) // 更新全选状态

      updateTotalPrice(updatedProducts) // 更新总金额
      return updatedProducts
    })
  }

  // 更新总金额函数
  const updateTotalPrice = (updatedProducts) => {
    const newTotal = updatedProducts.reduce((total, product) => {
      return product.isSelected
        ? total + quantities[product.p_id] * Math.round(product.p_price * 0.8)
        : total
    }, 0)
    setProductTotal(newTotal)
    console.log('更新后的总金额:', newTotal)
  }

  useEffect(() => {
    // 当商品列表或数量变化时，重新计算总金额
    updateTotalPrice(products)
  }, [products, quantities])

  // 全选切换函数
  const handleToggleAllProducts = () => {
    const newSelectAll = !selectAllProducts
    setSelectAllProducts(newSelectAll)
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
        acc += quantities[product.p_id] * Math.round(product.p_price * 0.8)
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
        `http://localhost:3005/api/cart/update-quantity`,
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
        throw new Error('Failed to update product qty.')
      }

      console.log('qty updated successfully!')
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [productId]: newQuantity,
      }))
      // console.log('測試數量', quantities)
    } catch (error) {
      console.error('Failed to update color:', error)
    }
  }

  // 刪除
  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:3005/api/cart/del/${userId}/${productId}`,
        {
          method: 'DELETE',
        }
      )
      const data = await response.json()
      if (response.ok) {
        console.log('Delete response:', data.message)
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
      {/* <!-- 一般商品內容 --> */}
      {/* <!-- 商品全選框 --> */}
      {data.length > 0 && (
        <div className={`row w-100 ${styles['cart-p-select']} mt-3`}>
          <div
            className={`col-sm-12 col-12 select-all`}
            style={{ height: '38px' }}
          >
            <input
              type="checkbox"
              id="select-all-products"
              checked={selectAllProducts}
              onChange={() => setSelectAllProducts(!selectAllProducts)}
            />
            <label htmlFor="select-all">
              <h6>一般商品</h6>
            </label>
          </div>
        </div>
      )}
      {/* <!-- 商品全選框 結尾-->

    <!-- 桌機板-商品標題  --> */}
      {data.length > 0 && (
        <div className={`row w-100 ${styles['cart-p-title']}`}>
          <div className={`p-title`} style={{ width: '580px' }}>
            商品訊息
          </div>
          <div
            className={`p-title`}
            style={{ width: '160px', textAlign: 'left', marginRight: '50px' }}
          >
            尺寸/顏色
          </div>
          <div
            className={`p-title`}
            style={{ width: '240px', textAlign: 'left', marginRight: '20px' }}
          >
            售價
          </div>
          <div
            className={`${`p-title`} col-auto`}
            style={{ marginRight: '90px' }}
          >
            數量
          </div>
          <div className={` ${`p-title`} col-auto`}>合計</div>
          <div className={` ${`p-title`} col-auto`}></div>
        </div>
      )}
      {/* <!-- 桌機板-商品標題 結尾-->
    <!-- 商品內容-->
    <!-- 商品勾選框 --> */}
      {products.map((product, index) => (
        <div key={index} className={`row w-100 ${styles['cart-p-item']}`}>
          <div className={`${styles['p-select']} col-sm-1  col-12`}>
            <input
              type="checkbox"
              checked={product.isSelected}
              onChange={() => handleSelectProduct(product.p_id)}
            />
            <label></label>
          </div>
          {/* <!-- 商品勾選框結尾 -->
      <!-- 商品照片--> */}
          <div className={`col-sm-1 col-4 ${styles['p-info-img']}`}>
            <div className={`${styles['p-img']}`}>
              {/* <img src={`/images/product/${product.img}`} alt={product.name} /> */}
              <Image
                src={`/images/product/${product.img}`}
                alt={product.name}
                width={80}
                height={80}
                objectFit="cover"
              />
            </div>
          </div>
          {/* <!-- 商品照片結尾 -->
      <!-- 商品內容桌機+手機 --> */}
          <div className={`col-sm-10 col-8 ${styles['p-info-content']}`}>
            <div className={`${styles['p-info']}`}>
              <p>{product.p_name}</p>
            </div>
            {/* <!--規格 --> */}
            <div className={styles['p-category']}>
              <div className={styles['p-category-item']}>
                <label
                  htmlFor={`size-${product.p_id}`}
                  style={{ fontSize: 'var(--p)', marginRight: '3px' }}
                >
                  尺寸
                </label>
                <select
                  id={`size-${product.p_id}`}
                  name="size"
                  value={product.p_size}
                  disabled
                >
                  <option key={product.p_size} value={product.p_size}>
                    {product.p_size}
                  </option>
                </select>

                {/*  */}
              </div>
              <div className={styles['p-category-item']}>
                <label
                  htmlFor={`color-${product.p_id}`}
                  style={{ fontSize: 'var(--p)', marginRight: '3px' }}
                >
                  顏色
                </label>

                <select
                  id={`color-${product.p_id}`}
                  name="color"
                  value={product.p_color}
                  disabled
                >
                  <option key={product.p_color} value={product.p_color}>
                    {product.p_color}
                  </option>
                </select>
              </div>
            </div>
            {/* <!-- 選擇規格 結尾--> */}
            <div className={`${styles['p-price']}`}>
              <p style={{ textDecoration: 'line-through' }}>
                {product.p_price}
              </p>

              <p>{Math.round(product.p_price * 0.8)}</p>
            </div>
            {/* <!-- 商品按鈕: 更改數量+刪除--> */}
            <div
              className={`${styles['p-btn-group']}`}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {/* <!-- 拆小塊-更改數量功能 --> */}
              <div className={styles['p-amount-btn']}>
                <div className={styles['quantity-input']}>
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        product.p_id,
                        quantities[product.p_id] - 1
                      )
                    }
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantities[product.p_id]}
                    onChange={(e) =>
                      handleQuantityChange(
                        product.p_id,
                        parseInt(e.target.value, 10)
                      )
                    }
                    min="1"
                    className={styles['p-amount']}
                  />

                  <button
                    onClick={() =>
                      handleQuantityChange(
                        product.p_id,
                        quantities[product.p_id] + 1
                      )
                    }
                  >
                    +
                  </button>

                  {/*  */}
                </div>
              </div>
              {/* <!-- 拆小塊-更改數量功能 結尾 --> */}
              <div className={`d-sm-block d-none mx-4 ${styles['p-sum']}`}>
                <p>
                  {calculateTotalPrice(
                    Math.round(product.p_price * 0.8),
                    quantities[product.p_id]
                  )}
                </p>
                {/* <p>
                  {calculateTotalPrice(
                    product.p_price,
                    quantities[product.p_id]
                  )}
                </p> */}
              </div>

              {/* <!-- 拆小塊-刪除功能 --> */}
              <div className={`mb-1 ${styles['p-del-btn']}`}>
                <button
                  type="button"
                  onClick={() => handleDeleteProduct(product.p_id)}
                >
                  <FaTrashAlt color="var(--main)" size={20} />
                </button>
              </div>
              {/* <!-- 拆小塊-刪除功能 結尾 --> */}
            </div>
            {/* <!-- 商品按鈕: 更改數量+刪除 結尾--> */}
          </div>
          {/* <!-- 商品內容桌機+手機 --> */}
        </div>
      ))}
      {/* <!-- 商品內容 結尾 -->
<!-- 一般商品內容 結尾--> */}
    </>
  )
}
