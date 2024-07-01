import Link from 'next/link'
import styles from './order.module.css'
import { useRouter } from 'next/router'
import { initUserData, useAuth } from '@/hooks/use-auth'
import { useEffect, useState } from 'react'
import { Bs1CircleFill } from 'react-icons/bs'
import { Bs2CircleFill } from 'react-icons/bs'
import { Bs3CircleFill } from 'react-icons/bs'
// import LinePayIcon from 'next/public/line-pay/LINE-Pay(h)_W61_n.png'
export default function OrderSuccess() {
  const router = useRouter()
  const { orderId } = router.query // 获取 orderId
  const { auth } = useAuth()
  const userId = auth.userData.id
  const [data, setData] = useState([])
  const fetchData = async () => {
    console.log(`Fetching data for userId: ${userId}, orderId: ${orderId}`)

    try {
      const response = await fetch(
        `http://localhost:3005/api/order/success/${userId}/${orderId}`
      )

      const data = await response.json()
      setData(data)
      console.log('Received  data:', data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    if (userId > 0 && orderId) {
      fetchData()
    }
  }, [userId, orderId]) // 依赖于 userId 和 orderId

  const submitLine = async () => {
    try {
      const response = await fetch(
        `http://localhost:3005/api/order/reserve/${userId}/${orderId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        console.error('提交訂單錯誤:', errorData.message)
        return
      }
      const responseData = await response.json()
      if (responseData.paymentUrl) {
        window.location.href = responseData.paymentUrl
      }
    } catch (error) {
      console.error('提交訂單錯誤:', error)
      alert('提交訂單錯誤！')
    }
  }

  return (
    <>
      <div className={`${styles['order-container']}`}>
        {/* <!-- 購物車導覽列 --> */}
        <div
          className={`row w-100 ${styles['cart-nav']} mt-4 mb-3`}
          style={{ paddingBottom: '15px' }}
        >
          <div className={`col-sm-3`}></div>
          <div className={`col-sm-6 ${styles['cart-nav-group']}`}>
            <div className={`${styles['cart-nav-item']}`}>
              {' '}
              <Bs1CircleFill
                color="var(--main)"
                size={24}
                style={{ marginRight: '3px' }}
              />
              查看購物車&gt;
            </div>
            <div className={`${styles['cart-nav-item']}`}>
              {' '}
              <Bs2CircleFill
                color="var(--main)"
                size={24}
                style={{ marginRight: '3px' }}
              />
              訂單確認&gt;
            </div>
            <div className={`${styles['cart-nav-item']}`}>
              {' '}
              <Bs3CircleFill
                color="var(--main)"
                size={24}
                style={{ marginRight: '3px' }}
              />
              訂單結算
            </div>
          </div>
          <div className={`col-sm-3`}></div>
        </div>
        {/* <!-- 購物車導覽列 結尾--> */}
        {/* <!-- 購物車導覽列 rwd--> */}

        <div
          className={`row w-100  mb-3 ${styles['cart-nav-order']}`}
          style={{ textAlign: 'center', margin: '0', padding: '0' }}
        >
          {data.length > 0 ? (
            <div className="col-12">
              <h4>訂單成功</h4>
            </div>
          ) : (
            <div className="col-12">
              <h4>無此訂單</h4>
            </div>
          )}
        </div>

        <div
          className={`row  w-100 mt-5 ${styles['btn-position']} `}
          style={{
            margin: '0',
          }}
        >
          <div className={`col-12 ${styles['btn']}`}>
            <Link href="/member/order-history">
              <h6>訂單查詢</h6>
            </Link>
          </div>
        </div>
        {data.length > 0 && (
          <div
            className={`row w-100  mt-5  ${styles['order']}`}
            style={{ textAlign: 'center', margin: '0', padding: '0' }}
          >
            <div className={`col-2`}>
              <h6>項目</h6>
            </div>
            <div className={`col-2`}>
              <h6>訂單編號</h6>
            </div>
            <div className={`col-2`}>
              <h6>訂單時間</h6>
            </div>
            <div className={`col-1`}>
              <h6>訂單總額</h6>
            </div>
            <div className={`col-2`}>
              <h6>訂單狀態</h6>
            </div>
            <div className={`col-3`}>
              <h6>付款方式</h6>
            </div>
          </div>
        )}
        {data.map((order, index) => (
          <div
            key={index}
            className={`row w-100  mt-2 ${styles['order-item']}`}
            style={{ textAlign: 'center', margin: '0' }}
          >
            <div className={`col-2`}>
              <p>{order.type}</p>
            </div>
            <div className={`col-2`}>
              <p>{order.coding}</p>
            </div>
            <div className={`col-2`}>
              <p>{order.order_time}</p>
            </div>
            <div className={`col-1`}>
              <p style={{ color: 'var(--main)' }}>{order.final_price}</p>
            </div>
            <div className={`col-2`}>
              <p>{order.status}</p>
            </div>
            <div
              className={`col-3`}
              style={{
                justifyContent: 'center',
                display: 'flex',
              }}
            >
              {order.payment === 'LinePay' && order.status === '待付款' ? (
                <button
                  className={`${styles['line-btn']}`}
                  style={{ textAlign: 'center' }}
                  onClick={() => submitLine()}
                >
                  <img src="/line-pay/LINE-Pay(h)_W74_n.png" alt="Line Pay" />
                </button>
              ) : (
                <p>{order.payment}</p>
              )}
            </div>
          </div>
        ))}
        {/* <!-- 購物車導覽列 rwd結尾--> */}
      </div>
      {/* <!-- CONTAINER結尾 --> */}
    </>
  )
}
