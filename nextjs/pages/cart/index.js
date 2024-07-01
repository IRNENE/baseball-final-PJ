import { useCart } from '@/hooks/use-cart'
import CheckOutButton from '@/components/pj-cart/checkout-btn'
import CartProduct from '@/components/pj-cart/pj-cart-p'
import CartRentProduct from '@/components/pj-cart/pj-cart-r'
import CartLesson from '@/components/pj-cart/pj-cart-l'
import styles from './cart.module.css'
import { CartProviderSelect } from '@/context/CartContext'
import { TotalAmountProvider } from '@/context/CartPrice'
import { Bs1CircleFill } from 'react-icons/bs'
import { Bs2CircleFill } from 'react-icons/bs'
import { Bs3CircleFill } from 'react-icons/bs'
export default function Cart() {
  return (
    <>
      <CartProviderSelect>
        <TotalAmountProvider>
          <div className={`${styles['cart-container']}`}>
            {/* <!-- 購物車導覽列 --> */}
            <div
              className={`row w-100 ${styles['cart-nav']} mt-4 mb-3`}
              style={{ paddingBottom: '15px' }}
            >
              <div className={`col-sm-3`}></div>
              <div className={`col-sm-6 ${styles['cart-nav-group']}`}>
                <div
                  className={`${styles['cart-nav-item']}`}
                  style={{ color: 'var(--main)' }}
                >
                  <Bs1CircleFill
                    color="var(--main)"
                    size={24}
                    style={{ marginRight: '3px' }}
                  />
                  查看購物車&gt;
                </div>
                <div className={`${styles['cart-nav-item']}`}>
                  <Bs2CircleFill size={24} style={{ marginRight: '3px' }} />
                  訂單確認&gt;
                </div>
                <div className={`${styles['cart-nav-item']}`}>
                  {' '}
                  <Bs3CircleFill size={24} style={{ marginRight: '3px' }} />
                  訂單結算
                </div>
              </div>
              <div className={`col-sm-3`}></div>
            </div>
            {/* <!-- 購物車導覽列 結尾--> */}
            {/* <!-- 購物車導覽列 rwd--> */}

            <h4
              className={` d-sm-none d-block  mb-2`}
              style={{
                marginTop: '100px',
                paddingLeft: '15px',
                color: 'var(--main)',
              }}
            >
              <Bs1CircleFill
                color="var(--main)"
                size={24}
                style={{ marginRight: '3px' }}
              />{' '}
              查看購物車&gt;
            </h4>

            {/* <!-- 購物車導覽列 rwd結尾--> */}

            {/* <!-- 購物車內容 -->
      <!-- action 属性指定了表单数据提交的目标 URL 或路由 --> */}
            {/* <form action="cart/checkout" method="POST"> */}
            {/* <!-- 一般商品內容 --> */}
            <CartProduct />
            {/* <!-- 一般商品內容 結尾--> */}
            {/* <!-- 租用商品內容 --> */}
            <CartRentProduct />
            {/* <!-- 租用商品內容 結尾--> */}
            {/* <!-- 課程內容 --> */}
            <CartLesson />
            {/* <!-- 課程內容 結尾--> */}

            {/* <!-- 結帳按鈕、全選按鈕 --> */}
            <CheckOutButton />
            {/* <!-- 結帳按鈕、全選按鈕 結尾--> */}
            {/* </form> */}
            {/* <!-- 購物車內容結尾 --> */}
          </div>
          {/* <!-- CONTAINER結尾 --> */}
        </TotalAmountProvider>
      </CartProviderSelect>
    </>
  )
}
