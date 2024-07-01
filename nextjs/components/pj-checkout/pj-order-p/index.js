import styles from './order-p.module.css'
import { useRouter } from 'next/router'
import { initUserData, useAuth } from '@/hooks/use-auth'
import { useEffect, useState } from 'react'
import Image from 'next/image'
export default function ProductOrder() {
  const router = useRouter()
  const { orderId } = router.query // 获取 orderId
  const { auth } = useAuth()
  const userId = auth.userData.id
  const [data, setData] = useState([])
  const fetchData = async () => {
    console.log(`Fetching data for userId: ${userId}, orderId: ${orderId}`)

    try {
      const response = await fetch(
        `http://localhost:3005/api/order/product/${userId}/${orderId}`
      )

      const data = await response.json()
      setData(data)
      // console.log('Received p data:', data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    if (userId > 0 && orderId) {
      fetchData()
    }
  }, [userId, orderId]) // 依赖于 userId 和 orderId

  return (
    <>
      {/* <!-- 一般商品內容 --> */}

      {/* <!-- 桌機板-商品標題  -->  */}
      {data.length > 0 && (
        <div className={`row w-100 ${styles['cart-p-title']}`}>
          <div
            className={`p-title`}
            style={{ width: '580px', paddingRight: '145px' }}
          >
            商品訊息
          </div>
          <div
            className={`p-title`}
            style={{ width: '160px', textAlign: 'left', marginRight: '60px' }}
          >
            尺寸/顏色
          </div>
          <div
            className={`p-title`}
            style={{ width: '160px', textAlign: 'left', marginRight: '30px' }}
          >
            售價
          </div>
          <div
            className={`${`p-title`} col-auto`}
            style={{ marginRight: '150px' }}
          >
            數量
          </div>
          <div className={` ${`p-title`} col-auto`}>合計</div>
        </div>
      )}
      {/* <!-- 桌機板-商品標題 結尾-->
  <!-- 商品內容-->
   */}
      {data.length > 0 && (
        <div
          className={`row w-100 d-sm-none mb-2 mt-4 d-block ${styles['p-nav']}`}
          style={{
            paddingLeft: '15px',
            borderBottom: 'var(--main) 1px solid',
            margin: '0',
          }}
        >
          <div className={`col-12`}>
            <p>一般商品</p>
          </div>
        </div>
      )}
      {data.map((product, index) => (
        <div key={index} className={`row w-100 ${styles['cart-p-item']}`}>
          {/* <!-- 商品照片--> */}

          <div className={`col-sm-2 col-4 ${styles['p-info-img']}`}>
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
            {/* <!-- 拆小塊選擇規格 --> */}
            <div className={styles['p-category']}>
              <div
                className={styles['p-category-item']}
                style={{ margin: '0', padding: '0' }}
              >
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
              </div>

              <div
                className={styles['p-category-item']}
                style={{ margin: '0', padding: '0', marginTop: '8px' }}
              >
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
            {/* <!-- 拆小塊選擇規格 結尾--> */}
            <div className={`${styles['p-price']}`}>
              <p style={{ textDecoration: 'line-through' }}>
                {product.p_price}
              </p>

              <p>{Math.round(product.p_price * 0.8)}</p>
            </div>
            <div className={`d-sm-block d-none ${styles['r-count']}`}>
              <p> {product.p_amount}</p>
            </div>
            <div className={`d-sm-block d-none  ${styles['r-sum']}`}>
              <p> {product.p_total}</p>
            </div>
            {/* <!-- 商品內容桌機+手機 --> */}
          </div>
          {/* <!-- 商品內容 結尾 -->

<!-- 一般商品內容 結尾--> */}
        </div>
      ))}
    </>
  )
}
