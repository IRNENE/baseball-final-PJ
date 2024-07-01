import styles from './checkout.module.css'
import LessonOrder from '@/components/pj-checkout/pj-order-l'
import RentProductOrder from '@/components/pj-checkout/pj-order-r'
import ProductOrder from '@/components/pj-checkout/pj-order-p'
import { useRouter } from 'next/router'
import { initUserData, useAuth } from '@/hooks/use-auth'
import { useEffect, useState } from 'react'
import { Bs1CircleFill } from 'react-icons/bs'
import { Bs2CircleFill } from 'react-icons/bs'
import { Bs3CircleFill } from 'react-icons/bs'
export default function CheckOut() {
  const router = useRouter()
  const { orderId } = router.query // 获取 orderId
  const { auth } = useAuth()
  const userId = auth.userData.id
  const [data, setData] = useState([])
  const [userInfo, setUserInfo] = useState(false)
  const [deliveryMethod, setDeliveryMethod] = useState('home')
  const [payment, setPayment] = useState('cash')
  // const [deliveryFee, setDeliveryFee] = useState(120) // 默认宅配费用
  const [deliveryFee, setDeliveryFee] = useState(0)
  const [selectedCoupon, setSelectedCoupon] = useState('') //
  const [discountAmount, setDiscountAmount] = useState(0)
  const [finalAmount, setFinalAmount] = useState(0)
  const [applicableCoupon, setApplicableCoupon] = useState([])
  const [selectedCouponCode, setSelectedCouponCode] = useState('')
  // 修改收件人
  const [note, setNote] = useState('')
  const [recipientName, setRecipientName] = useState(data[0]?.u_name || '')
  const [recipientPhone, setRecipientPhone] = useState(data[0]?.u_phone || '')
  const [recipientAddress, setRecipientAddress] = useState(
    data[0]?.u_address || ''
  )

  const fetchData = async () => {
    // console.log(`Fetching data for userId: ${userId}, orderId: ${orderId}`)

    try {
      const response = await fetch(
        `http://localhost:3005/api/order/user/${userId}/${orderId}`
      )

      const data = await response.json()
      setData(data)
      console.log('Received user data:', data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    if (userId > 0 && orderId) {
      fetchData()
    }
  }, [userId, orderId]) // 依赖于 userId 和 orderId

  const handleRadioChange = (event) => {
    // 设置状态，当选择"修改收件人信息"时，允许编辑
    setUserInfo(event.target.value === 'edit')
  }
  const handleDeliveryChange = (event) => {
    setDeliveryMethod(event.target.value)
  }
  const handlePayment = (event) => {
    setPayment(event.target.value)
  }

  // 優惠卷
  const totalPrice = data[0]?.total_price

  // console.log('totalPrice', totalPrice)
  // 優惠卷計算折扣函數，接收 totalPrice 和 使用者選擇的couponCode
  function calculateDiscounts(totalPrice, selectedCouponCode, couponsData) {
    let discountAmount = 0
    let finalAmount = totalPrice
    let applicableCoupon = null
    // console.log('Coupons Data Inside:', couponsData)
    const coupon = couponsData.find((c) => c.name === selectedCouponCode)
    // console.log('Selected Coupon:', coupon)

    if (coupon && totalPrice >= parseInt(coupon.restrict, 10)) {
      let currentDiscount = 0
      if (coupon.type === '%數折扣') {
        currentDiscount = totalPrice * (1 - parseFloat(coupon.discount))
      } else if (coupon.type === '金額折扣') {
        currentDiscount = parseFloat(coupon.discount)
      }

      if (currentDiscount > 0 && currentDiscount <= totalPrice) {
        discountAmount = Math.round(currentDiscount)
        applicableCoupon = coupon
      }
    }

    discountAmount = Math.min(discountAmount, totalPrice) // 確保折扣金額不超過總金額
    finalAmount = Math.round(totalPrice - discountAmount) // 四捨五入計算最終應付金額

    // console.log('Discount Amount:', discountAmount)
    // console.log('Final Amount:', finalAmount)
    // console.log('Applicable Coupon:', applicableCoupon)

    return {
      discountAmount,
      finalAmount,
      applicableCoupon,
    }
  }
  // console.log('測試Final Amount:', finalAmount)
  function parseCouponsData(data) {
    if (!data || !data.length) return [] // 确保data存在且不是空的

    const couponNames = data[0]?.coupons ? data[0].coupons.split(',') : []
    const couponTypes = data[0]?.c_type ? data[0].c_type.split(',') : []
    const couponDiscounts = data[0]?.c_discount
      ? data[0].c_discount.split(',')
      : []
    const couponCodings = data[0]?.c_coding ? data[0].c_coding.split(',') : []
    const couponRestricts = data[0]?.c_restrict
      ? data[0].c_restrict.split(',')
      : []

    return couponNames.map((name, index) => ({
      name: name,
      type: couponTypes[index],
      discount: couponDiscounts[index],
      coding: couponCodings[index],
      restrict: couponRestricts[index],
    }))
  }

  // function parseCouponsData(data) {
  //   if (!data || !data.length) return [] // 確保data存在且不是空的

  //   const couponNames = data[0]?.coupons.split(',')
  //   const couponTypes = data[0]?.c_type.split(',')
  //   const couponDiscounts = data[0]?.c_discount.split(',')
  //   const couponCodings = data[0]?.c_coding.split(',')
  //   const couponRestricts = data[0]?.c_restrict.split(',')

  //   return couponNames.map((name, index) => ({
  //     name: name,
  //     type: couponTypes[index],
  //     discount: couponDiscounts[index],
  //     coding: couponCodings[index],
  //     restrict: couponRestricts[index],
  //   }))
  // }

  useEffect(() => {
    if (data.length > 0) {
      const initialFinalAmount = Number(data[0]?.total_price)
      setFinalAmount(initialFinalAmount)
    }
  }, [data])

  useEffect(() => {
    if (deliveryMethod === 'store') {
      setDeliveryFee(0)
    } else {
      setDeliveryFee(0)
    }
  }, [deliveryMethod])

  useEffect(() => {
    if (data.length > 0) {
      setRecipientName(data[0]?.u_name || '')
      setRecipientPhone(data[0]?.u_phone || '')
      setRecipientAddress(data[0]?.u_address || '')
      const couponsData = parseCouponsData(data)
      //     console.log('couponsData', couponsData)
    }
  }, [data]) // 確保當data更新時重新計算

  // 假设 `data` 是从服务器或者某个 API 获取的包含上述字段的对象
  const couponsData = parseCouponsData(data)
  // console.log('couponsData', couponsData)
  // 優惠卷選擇處理
  const handleCouponSelect = (event) => {
    const couponCode = event.target.value
    setSelectedCoupon(couponCode) // 更新選擇的優惠卷
    // console.log('Selected coupon code:', couponCode)
    // 查找选择的优惠券并获取其详细信息
    const couponDetails = couponsData.find((c) => c.name === couponCode)
    if (couponDetails) {
      setSelectedCouponCode(couponDetails.coding) // 更新优惠券编码
    }

    const { discountAmount, finalAmount, applicableCoupon } =
      calculateDiscounts(totalPrice, couponCode, couponsData)
    setDiscountAmount(discountAmount)
    setFinalAmount(finalAmount)
    setApplicableCoupon(applicableCoupon)
    // console.log('finalAmount:', finalAmount)
    // console.log('Applicable Coupon:', applicableCoupon)
    // 在這裡調用 calculateDiscounts 函數來重新計算折扣和應付金額
  }

  // 提交按鈕
  const submitOrder = async () => {
    const payload = {
      name: userInfo ? recipientName : data[0]?.u_name,
      phone: userInfo ? recipientPhone : data[0]?.u_phone,
      address: userInfo ? recipientAddress : data[0]?.u_address,
      note: userInfo ? note : null, // 假设有一个状态来处理备注输入
      payment: payment,
      delivery: deliveryMethod,
      total_price: data[0]?.total_price,
      coupon_code: applicableCoupon?.coding,
      discount_price: discountAmount.toString(),
      final_price: (finalAmount + deliveryFee).toString(), // 添加運費
    }

    try {
      const response = await fetch(
        `http://localhost:3005/api/order/submit/${userId}/${orderId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      )
      const responseData = await response.json()
      // console.log('訂單提交响应:', responseData)

      if (response.ok) {
        // 这里处理成功操作
        const orderId = responseData.orderId
        // alert('訂单成功！')
        router.push(`/cart/checkout/order/${orderId}`)
      } else {
        // 这里处理错误
        alert('訂單失败！')
      }
    } catch (error) {
      console.error('提交訂單錯誤:', error)
      alert('提交訂單錯誤！')
    }
  }

  return (
    <>
      <div className={`${styles['cart-container']}`}>
        {/* <!-- 購物車導覽列 --> */}
        <div className={`row w-100 mt-4 mb-3 ${styles['cart-nav']}`}>
          <div className={`col-sm-3`}></div>
          <div className={`col-sm-6 ${styles['cart-nav-group']}`}>
            <div
              className={`${styles['cart-nav-item']}`}
              style={{ color: 'var(--main)' }}
            >
              {' '}
              <Bs1CircleFill
                color="var(--main)"
                size={24}
                style={{ marginRight: '3px' }}
              />{' '}
              查看購物車&gt;
            </div>
            <div
              className={`${styles['cart-nav-item']}`}
              style={{ color: 'var(--main)' }}
            >
              <Bs2CircleFill
                color="var(--main)"
                size={24}
                style={{ marginRight: '3px' }}
              />
              訂單確認&gt;
            </div>
            <div className={`${styles['cart-nav-item']}`}>
              <Bs3CircleFill size={24} style={{ marginRight: '3px' }} />
              訂單結算
            </div>
          </div>
          <div className={`col-sm-3`}></div>
        </div>
        {/* <!-- 購物車導覽列 結尾--> */}
        {/*  */}
        <div
          className={`row w-100  mb-3 ${styles['cart-nav-order']}`}
          style={{ textAlign: 'center' }}
        >
          <div className={`col-12`}>
            <h4>訂單詳情</h4>
          </div>
        </div>

        {/*  */}
        {/* <!-- 購物車內容 -->
      <!-- action 属性指定了表单数据提交的目标 URL 或路由 --> */}

        {/* <!-- 一般商品內容 --> */}

        <ProductOrder />
        {/* <!-- 一般商品內容 結尾--> */}
        {/* <!-- 租用商品內容 --> */}
        <RentProductOrder />
        {/* <!-- 租用商品內容 結尾--> */}
        {/* <!-- 課程內容 --> */}
        <LessonOrder />
        {/* <!-- 課程內容 結尾--> */}

        {/* <!-- 購物車內容結尾 --> */}

        {/* 使用者資訊 */}
        <div className={`row`}>
          <div className={`col-sm-6 col-12`}>
            <table className={`table-bordered  w-100  ${styles['user-info']}`}>
              <thead>
                <tr style={{ backgroundColor: 'var(--main)' }}>
                  <th colspan="2">
                    <h5 style={{ color: '#ffffff', paddingLeft: '8px' }}>
                      訂購人資訊
                    </h5>
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td style={{ width: '100px' }}>
                    <p>姓名</p>
                  </td>
                  <td>
                    <p>
                      <input type="text" value={data[0]?.u_name} readOnly />
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p>手機</p>
                  </td>
                  <td>
                    <p>
                      <input type="text" readOnly value={data[0]?.u_phone} />
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p>信箱</p>
                  </td>
                  <td>
                    <p>
                      <input
                        type="text"
                        value={data[0]?.u_account || data[0]?.u_email}
                        readOnly
                      />
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p>地址</p>
                  </td>
                  <td>
                    <p>
                      <input type="text" value={data[0]?.u_address} readOnly />
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={`col-sm-6 col-12`}>
            <table className={`table-bordered  w-100  ${styles['user-info']}`}>
              <thead>
                <tr style={{ backgroundColor: 'var(--main)' }}>
                  <th colspan="2">
                    <span
                      className={`${styles['attn']}`}
                      style={{
                        color: '#ffffff',
                        paddingLeft: '8px',

                        fontSize: '18px',
                      }}
                    >
                      收件人資訊
                    </span>
                    <input
                      type="radio"
                      id="attn-method1"
                      name="attn-method"
                      defaultChecked
                      onChange={handleRadioChange}
                    />
                    <label htmlFor="attn-method1">
                      <span
                        style={{
                          color: '#ffffff',
                          paddingRight: '10px',
                          fontSize: '18px',
                        }}
                      >
                        同訂購人
                      </span>
                    </label>
                    <input
                      type="radio"
                      id="attn-method2"
                      name="attn-method"
                      value="edit"
                      onChange={handleRadioChange}
                    />
                    <label htmlFor="attn-method2">
                      <span style={{ color: '#ffffff', fontSize: '18px' }}>
                        修改收件人資訊
                      </span>
                    </label>
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>
                    <p>姓名</p>
                  </td>
                  <td>
                    <p>
                      <input
                        type="text"
                        value={userInfo ? recipientName : data[0]?.u_name}
                        disabled={!userInfo}
                        onChange={(e) => setRecipientName(e.target.value)}
                      />
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p>手機</p>
                  </td>
                  <td>
                    <p>
                      <input
                        type="text"
                        value={userInfo ? recipientPhone : data[0]?.u_phone}
                        disabled={!userInfo}
                        onChange={(e) => setRecipientPhone(e.target.value)}
                      />
                      {/* <input
                        type="text"
                        value={recipientPhone}
                        disabled={!userInfo}
                        onChange={(e) => setRecipientPhone(e.target.value)}
                      /> */}

                      {/* <input
                        type="text"
                        value={data[0]?.u_phone}
                        disabled={!userInfo}
                      /> */}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p>地址</p>
                  </td>
                  <td>
                    <p>
                      <input
                        type="text"
                        value={userInfo ? recipientAddress : data[0]?.u_address}
                        disabled={!userInfo}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                      />
                      {/* <input
                        type="text"
                        value={recipientAddress}
                        disabled={!userInfo}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                      /> */}
                      {/* <input
                        type="text"
                        value={data[0]?.u_address}
                        disabled={!userInfo}
                      /> */}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p>備註</p>
                  </td>
                  <td>
                    <p>
                      <input
                        type="text"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      />
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/*  */}
        <div className={`row w-100 delivery-method`} style={{ margin: '0' }}>
          <div
            className={`col-12 mt-4`}
            style={{ backgroundColor: 'var(--main)', color: '#ffffff' }}
          >
            寄送方式
          </div>
          <div className={`col-12 mb-2`}>
            <input
              type="radio"
              id="delivery-home"
              name="delivery-method"
              value="home"
              checked={deliveryMethod === 'home'}
              onChange={handleDeliveryChange}
            />
            <label htmlFor="delivery-home" style={{ marginRight: '10px' }}>
              宅配方式
            </label>

            <input
              type="radio"
              id="delivery-store"
              name="delivery-method"
              value="store"
              checked={deliveryMethod === 'store'}
              onChange={handleDeliveryChange}
            />
            <label htmlFor="delivery-store">門市自取</label>
          </div>
        </div>
        <div className={`row w-100 payment-method`} style={{ margin: '0' }}>
          <div
            className={`col-12 mt-2`}
            style={{ backgroundColor: 'var(--main)', color: '#ffffff' }}
          >
            付款方式
          </div>
          <div className={`col-12 mb-2`}>
            <input
              type="radio"
              id="payment-cash"
              name="payment-method"
              value="cash"
              checked={payment === 'cash'}
              onChange={handlePayment}
            />
            <label htmlFor="payment-cash" style={{ marginRight: '10px' }}>
              貨到付款
            </label>
            <input
              type="radio"
              id="payment-line-pay"
              name="payment-method"
              value="line"
              checked={payment === 'line'}
              onChange={handlePayment}
            />
            <label htmlFor="payment-line-pay" style={{ marginRight: '10px' }}>
              line-pay
            </label>
            <input
              type="radio"
              id="payment-credit-card"
              name="payment-method"
              value="card"
              checked={payment === 'card'}
              onChange={handlePayment}
            />
            <label htmlFor="payment-credit-card">信用卡</label>
          </div>
        </div>
        {payment === 'card' && (
          <div className={`row credit-card w-100`} style={{ margin: '0' }}>
            <div
              className={`col-12 mt-2`}
              style={{ backgroundColor: 'var(--main)', color: '#ffffff' }}
            >
              信用卡資訊
            </div>
            <div className={`col-12`}>
              <div className={`form-group mt-2`}>
                <label htmlFor="card-number">信用卡號碼：</label>
                <input
                  type="text"
                  className={`form-control w-100`}
                  id="card-number"
                  name="card-number"
                  required
                />
              </div>
              <div className={`form-group`}>
                <label htmlFor="card-holder">持卡人姓名：</label>
                <input
                  type="text"
                  className={`form-control w-100`}
                  id="card-holder"
                  name="card-holder"
                  required
                />
              </div>
              <div className={`form-group`}>
                <label htmlFor="expiration-date">有效期限：</label>
                <input
                  type="text"
                  className={`form-control w-100`}
                  id="expiration-date"
                  name="expiration-date"
                  placeholder="MM/YYYY"
                  pattern="(0[1-9]|1[0-2])/[0-9]{4}"
                  required
                />
              </div>
              <div className={`form-group mb-2`}>
                <label htmlFor="cvv">CVV：</label>
                <input
                  type="text"
                  className={`form-control w-100`}
                  id="cvv"
                  name="cvv"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* <!-- coupon --> */}
        <div className={`row w-100`}>
          {data.map((order, index) => (
            <div key={index} className={`col-12 mt-2 mb-2`}>
              <label htmlFor={`coupon-${index}`} className={`form-label`}>
                選擇優惠卷：
              </label>
              <select
                className={`form-select`}
                id={`coupon-${index}`}
                name={`coupon-${index}`}
                onChange={handleCouponSelect}
                style={{ width: '240px' }}
              >
                <option value="">請選擇</option>
                {order.coupons?.split(',').map((coupon, index) => {
                  // 解析每个优惠券的最低消费限制
                  {
                    /* const restricts = order.c_restrict
                    .split(',')
                    .map((r) => parseInt(r, 10)) */
                  }
                  const restricts =
                    order.c_restrict?.split(',').map((r) => parseInt(r, 10)) ||
                    []
                  const totalPrice = parseInt(order.total_price, 10)
                  {
                    /* 
                  console.log('测试', coupon)
                  console.log('测试restricts', restricts[index]) // 确保打印每个限制
                  console.log('测试 totalPrice', totalPrice) */
                  }

                  // 检查是否满足优惠券使用的价格限制
                  if (totalPrice >= restricts[index]) {
                    return (
                      <option key={index} value={coupon}>
                        {coupon}
                      </option>
                    )
                  } else {
                    return null // 不渲染不满足条件的优惠券
                  }
                })}
              </select>
            </div>
          ))}
        </div>

        {/* 結帳金額 */}

        {/* 結帳按鈕 */}

        <div className={`row w-100 order-cost`}>
          <div className={`col-12 mt-2 mb-2`}>
            <table style={{ width: '100%' }}>
              <tbody>
                <tr>
                  <td className={styles['order-description']}>
                    <h6>
                      <span
                        style={{ color: 'var(--main)', marginRight: '3px' }}
                      >
                        {data[0]?.all_amount}
                      </span>
                      件商品金額：
                    </h6>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <h6 style={{ color: 'var(--main)' }}>
                      ${data[0]?.total_price}
                    </h6>
                  </td>
                </tr>
                {/* <tr>
                  <td className={styles['order-description']}>
                    <h6>運費金額：</h6>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <h6 style={{ color: 'var(--main)' }}>${deliveryFee}</h6>
                  </td>
                </tr> */}
                <tr>
                  <td className={styles['order-description']}>
                    <h6>折扣金額：</h6>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <h6 style={{ color: 'var(--main)' }}>-${discountAmount}</h6>
                  </td>
                </tr>
                <tr>
                  <td className={styles['order-description']}>
                    <h6>應付金額：</h6>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <h6 style={{ color: 'var(--main)' }}>
                      ${finalAmount + parseInt(deliveryFee)}
                    </h6>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* 手機板rwd  &btn*/}
        <div
          className={`row w-100  ${styles['payment-btn']}`}
          style={{ margin: '0', padding: '0' }}
        >
          <div
            className={`col-12 d-flex  ${styles['btn-style']}`}
            style={{ margin: '0', padding: '0' }}
          >
            <div className={`d-sm-none d-block`}>
              <h6>
                應付金額：
                <span style={{ color: 'var(--main)' }}>
                  ${finalAmount + parseInt(deliveryFee)}
                </span>
              </h6>
            </div>
            <button
              type="button"
              className={styles['btn']}
              onClick={() => submitOrder()}
            >
              <h6>提交訂單</h6>
            </button>
          </div>
        </div>
      </div>
      {/* <!-- CONTAINER結尾 --> */}
    </>
  )
}
