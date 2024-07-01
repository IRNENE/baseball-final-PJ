import React from 'react'
import styles from './checkout-btn.module.css'
import { useCartContext } from '@/context/CartContext'
import { useTotalAmount } from '@/context/CartPrice'
import { initUserData, useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'

export default function CheckOutButton() {
  const { auth } = useAuth()
  const userId = auth.userData.id
  const { selectAll, setSelectAll } = useCartContext() // 从Context获
  const { selectAllCourses, setSelectAllCourses } = useCartContext()
  const { SelectAllProducts, setSelectAllProducts } = useCartContext()
  const { selectAllRents, setSelectAllRents } = useCartContext()

  const handleToggleSelectAll = () => {
    const newSelectAllStatus = !selectAll
    setSelectAll(newSelectAllStatus)
    setSelectAllProducts(newSelectAllStatus)
    setSelectAllRents(newSelectAllStatus)
    setSelectAllCourses(newSelectAllStatus)
  }
  const { getTotal } = useTotalAmount()
  const totalAmount = getTotal()
  const router = useRouter() // 使用 useRouter 钩子

  const handleCheckout = async () => {
    try {
      const response = await fetch(
        `http://localhost:3005/api/order/${userId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // 传递用户ID或其他可能需要的信息
          // body: JSON.stringify({ userId: user.id })
        }
      )
      if (response.ok) {
        const data = await response.json()
        // console.log('Checkout successful:', data)
        const orderId = data.orderId
        // console.log(orderId)
        router.push(`/cart/checkout/${orderId}`)

        // 使用 push 方法进行页面跳转
        // 处理成功后的逻辑，例如跳转到感谢页面或订单详情页面
      } else {
        throw new Error('Checkout failed')
      }
    } catch (error) {
      // console.error('Checkout error:', error)
      // catch块：捕获try块中抛出的任何错误或异常，并允许开发者定义如何处理这些错误。
      if (error.message === 'Checkout failed') {
        console.error('Checkout process failed due to server response.')
        Swal.fire({
          title: '您好!',
          text: '購物車為空!無法結帳',
          icon: 'error',
        })
        // 特定于此错误的处理
      } else {
        console.error('Checkout error:', error)
        Swal.fire({
          title: '您好!',
          text: '結帳頁面出錯，請稍後再試',
          icon: 'error',
        })
        // 其他错误的通用处理
      }
    }
  }

  return (
    <>
      <div
        className={`row w-100 ${styles['cart-btn-group']} mt-2 mb-4`}
        style={{ margin: '0', padding: '0' }}
      >
        <div className={`col-sm-3 col-3 ${styles['allSelect-btn-group']}`}>
          {/* <!-- 全部選取 --> */}
          <div>
            <input
              type="checkbox"
              id="selectAll"
              name="selectAll"
              checked={selectAll}
              onChange={handleToggleSelectAll} // 当复选框被点击时，切换全选状态
            />
            <label htmlFor="selectAll">
              <h6>全選</h6>
            </label>
          </div>
          {/* <!-- 全部刪除 --> */}
          <div className={`d-sm-block d-none`}>
            <input type="checkbox" id="selectAll-del" name="selectAll-del" />
            <label for="selectAll-del">
              <h6>全部刪除</h6>
            </label>
          </div>
        </div>
        <div className={`col-sm-5 d-sm-block d-none`}></div>
        {/* <!-- 總金額(之後用變數) --> */}
        <div
          className={`col-sm-2 col-6`}
          style={{ alignSelf: 'center', textAlign: 'center' }}
        >
          <h6 style={{ margin: '0' }}>
            總金額(不含運費) :
            <span style={{ color: 'var(--main)' }}>{totalAmount}</span>
          </h6>
        </div>

        <div className={`col-sm-2 col-3`} style={{ margin: '0', padding: '0' }}>
          <button
            type="button"
            className={`${styles['btn']} w-100`}
            onClick={() => handleCheckout()}
          >
            <h6>結帳</h6>
          </button>
        </div>
      </div>
    </>
  )
}
