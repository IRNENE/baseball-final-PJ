import styles from './order-l.module.css'
import { useRouter } from 'next/router'
import { initUserData, useAuth } from '@/hooks/use-auth'
import { useEffect, useState } from 'react'
import Image from 'next/image'
export default function LessonOrder() {
  const router = useRouter()
  const { orderId } = router.query // 获取 orderId
  const { auth } = useAuth()
  const userId = auth.userData.id
  const [data, setData] = useState([])
  const fetchData = async () => {
    console.log(`Fetching data for userId: ${userId}, orderId: ${orderId}`)

    try {
      const response = await fetch(
        `http://localhost:3005/api/order/course/${userId}/${orderId}`
      )

      const data = await response.json()
      setData(data)
      // console.log('Received c data:', data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    if (userId > 0 && orderId) {
      fetchData()
    }
  }, [userId, orderId]) // 依赖于 userId 和 orderId
  const courseInfo = '課程 :' // 你的課程信息
  const truncateDescription = (description) => {
    const fullDescription = `${courseInfo}${description}`
    // 檢查描述字串是否超過50個字符
    // 檢查描述字串是否超過50個字符
    if (fullDescription.length > 50) {
      // 如果超過50個字符，則截斷字串並添加省略號
      return `${fullDescription.substring(0, 50)}...`
    } else {
      // 如果未超過50個字符，則返回原始字串
      return fullDescription
    }
  }
  return (
    <>
      {/* <!-- 一般課程內容 -->
       
        <!-- 桌機板-課程標題  --> */}
      {data.length > 0 && (
        <div
          className={`row w-100  ${styles['cart-l-title']}`}
          style={{ margin: '0', padding: '0' }}
        >
          <div className={styles['l-title']} style={{ width: '190px' }}>
            商品訊息
          </div>

          <div
            className={styles['l-title']}
            style={{ width: '790px', marginRight: '20px' }}
          >
            課程內容
          </div>
          <div
            className={`col-auto ${styles['l-title']}`}
            style={{ marginRight: '40px' }}
          >
            售價
          </div>

          <div
            className={`col-auto ${styles['l-title']}`}
            style={{ marginRight: '50px' }}
          >
            數量
          </div>
          <div className={`col-auto ${styles['l-title']}`}>合計</div>
        </div>
      )}
      {/* <!-- 桌機板-課程標題 結尾-->

{/*  */}
      {data.length > 0 && (
        <div
          className={`row w-100 d-sm-none mb-2 mt-4 d-block ${styles['l-nav']}`}
          style={{
            paddingLeft: '15px',
            borderBottom: 'var(--main) 1px solid',
            margin: '0',
          }}
        >
          <div className={`col-12`}>
            <p>課程商品</p>
          </div>
        </div>
      )}
      {/*  */}
      {/* <!-- 課程內容-->  */}
      {data.map((product, index) => (
        <div key={index} className={`row w-100 ${styles['cart-l-item']} mb-5`}>
          {/* <!-- 課程照片--> */}
          <div className={`col-sm-3 col-4 ${styles['l-info-img']}`}>
            <div className={styles['l-img']}>
              <img src={`/images/course/${product.img}`} alt={product.name} />
              {/* <Image
                src={`/images/course/${product.img}`}
                alt={product.name}
                width={150}
                height={150}
                objectFit="cover"
              /> */}
            </div>
          </div>
          {/* <!-- 課程照片結尾 -->
          <!-- 課程內容桌機+手機 --> */}
          <div className={` col-sm-9 col-8 ${styles['l-info-content']}`}>
            <div className={`${styles['l-info']}`}>
              <p className={`mt-1`}>類型 : {product.type_name}</p>
              <h5 className={`mt-1`}>{product.c_name}</h5>
              <p className={`mt-1`}>教練 : {product.t_name}</p>
              <p
                className={`mt-1`}
                dangerouslySetInnerHTML={{
                  __html: truncateDescription(product.c_des),
                }}
              ></p>
              {/* <p className={`mt-1`}>課程 : {product.c_des}</p> */}
              <p className={`mt-1`}>
                時間 : {product.c_start} ~ {product.c_end}
              </p>

              <div className={`${styles['li-info']}`}>
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
              </div>
            </div>

            <div className={` ${styles['l-price']}`}>
              {/* <p>$1880</p> */}
              <p>{product.c_price}</p>
            </div>
            <div className={`d-sm-block d-none ${styles['l-count']}`}>
              <p>{product.c_amount}</p>
            </div>
            <div className={`d-sm-block d-none  ${styles['l-sum']}`}>
              <p>{product.c_total}</p>
            </div>
          </div>
          {/* <!-- 課程內容桌機+手機 --> */}
        </div>
      ))}
      {/* <!-- 課程內容 結尾 -->

        <!-- 一般課程內容 結尾--> */}
    </>
  )
}
