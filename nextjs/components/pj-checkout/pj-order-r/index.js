import styles from './order-r.module.css'
import { useRouter } from 'next/router'
import { initUserData, useAuth } from '@/hooks/use-auth'
import { useEffect, useState } from 'react'
import Image from 'next/image'
export default function RentProductOrder() {
  const router = useRouter()
  const { orderId } = router.query // 获取 orderId
  const { auth } = useAuth()
  const userId = auth.userData.id
  const [data, setData] = useState([])
  const fetchData = async () => {
    console.log(`Fetching data for userId: ${userId}, orderId: ${orderId}`)

    try {
      const response = await fetch(
        `http://localhost:3005/api/order/rent/${userId}/${orderId}`
      )

      const data = await response.json()
      setData(data)
      // console.log('Received r  data:', data)
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
      {/* <!-- 租用商品內容 -->
        
        <!-- 桌機板-租用商品標題  --> */}
      {data.length > 0 && (
        <div
          className={`row w-100 ${styles['cart-r-title']}`}
          style={{ margin: '0', padding: '0' }}
        >
          <div className={styles['r-title']} style={{ width: '450px' }}>
            租用商品訊息
          </div>
          <div className={` ${styles['r-title']}`} style={{ width: '200px' }}>
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
            售價
          </div>
          <div
            className={`${styles['r-title']}`}
            style={{ width: '180px', marginRight: '40px' }}
          >
            數量
          </div>
          <div className={`col-auto ${styles['r-title']}`}>合計</div>
        </div>
      )}
      {/* <!-- 桌機板-租用商品標題 結尾--> */}
      {/* <!-- 租用商品內容-->*/}
      {/* rwd */}
      {data.length > 0 && (
        <div
          className={`row w-100 d-sm-none mb-2 mt-4 d-block ${styles['r-nav']}`}
          style={{
            paddingLeft: '15px',
            borderBottom: 'var(--main) 1px solid',
            margin: '0',
          }}
        >
          <div className={`col-12`}>
            <p>商品租借</p>
          </div>
        </div>
      )}
      {/* 租用商品內容*/}
      {data.map((product, index) => (
        <div key={index} className={`row w-100 ${styles['cart-r-item']}`}>
          {/* <!-- 租用商品照片--> */}
          <div className={`col-sm-2 col-4 ${styles['r-info-img']}`}>
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
              {/* <input type="date" className={`w-100 mb-2`} readOnly />
              <input type="date" className={`w-100`} readOnly /> */}

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
                {/* <label htmlFor="size" style={{ fontSize: 'var(--p)' }}>
                  尺寸
                </label>
                <select id="size" name="size" disabled>
                  <option value="S">S</option>
                  <option value="M">M</option>
                </select> */}
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
                {/* <label htmlFor="size" style={{ fontSize: 'var(--p)' }}>
                  颜色
                </label>
                <select id="color" name="color" disabled>
                  <option value="white">白色</option>
                  <option value="red">红色</option>
                </select> */}
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
              {/* <p>$1880</p>
              <p>$1780</p> */}
              <p style={{ textDecoration: 'line-through' }}>
                {product.day_price}
              </p>

              <p>{Math.round(product.day_price * 0.8)}</p>
            </div>
            <div className={`d-sm-block d-none ${styles['r-count']}`}>
              <p> {product.r_amount}</p>
            </div>
            <div className={`d-sm-block d-none  ${styles['r-sum']}`}>
              <p> {product.r_total}</p>
            </div>
          </div>
        </div>
      ))}
      {/* <!-- 租用商品內容桌機+手機 --> */}

      {/* <!-- 租用商品內容 結尾 -->
        <!-- 租用商品內容  */}
    </>
  )
}
