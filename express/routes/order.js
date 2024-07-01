import express from 'express'
const router = express.Router()
import db from '##/configs/mysql.js'
const app = express()
app.use(express.json()) // 确保这行在所有路由之前
import { createLinePayClient } from 'line-pay-merchant'

function generateRandomCode(length) {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

// 清空購物車並創建order和order_detail
router.post('/:userId', async (req, res) => {
  const userId = req.params.userId
  const connection = await db.getConnection() // 获取连接

  try {
    await connection.beginTransaction() // 开始事务

    // 从购物车获取数据并计算总价格
    const cartItemsSql = `
      SELECT 
        user_id,
        product_id,
        rent_id,
        course_id,
        p_color,
        p_size,
        r_color,
        r_size,
        p_price,
        r_price,
        c_price,
        p_amount,
        r_amount,
        c_amount,
        DATEDIFF(end_time, start_time) + 1 AS rental_days,
        (r_price * (DATEDIFF(end_time, start_time) + 1)) AS rent_price,
        start_time,
        end_time,
        img
      FROM cart
      JOIN user ON user.id = cart.user_id
      WHERE user_id = ?
    `
    const [cartItems] = await connection.query(cartItemsSql, [userId])
    if (cartItems.length === 0) {
      res.status(400).send({
        success: false,
        message: 'Cart is empty, cannot create order.',
      })
      return
    }

    const types = new Set() // 使用 Set 来避免重复值

    cartItems.forEach((item) => {
      if (item.product_id) types.add('商品')
      if (item.rent_id) types.add('租借')
      if (item.course_id) types.add('課程')
    })

    let orderType = '' // 初始化为字符串，避免 TypeScript 错误

    if (types.size === 1) {
      orderType = [...types][0] // 如果只有一种类型
    } else if (types.size > 1) {
      orderType = '綜合' // 如果存在多种类型
    } else {
      orderType = '未知' // 如果没有类型，可能是数据错误
    }
    // 计算总金额
    const total_price = cartItems.reduce((acc, item) => {
      const productTotal = item.p_price * 0.8 * item.p_amount || 0
      const rentalTotal = item.rent_price * 0.8 * item.r_amount || 0
      const courseTotal = item.c_price * item.c_amount || 0
      return acc + productTotal + rentalTotal + courseTotal
    }, 0)

    // 创建新订单
    const orderCode = generateRandomCode(10) // 生成一个10位的随机编码

    // 總數量
    // 计算总数量
    const allAmount = cartItems.reduce((acc, item) => {
      return (
        acc + (item.p_amount || 0) + (item.r_amount || 0) + (item.c_amount || 0)
      )
    }, 0)

    const orderSql = `
      INSERT INTO \`order\` (user_id, coding,order_time, total_price,status,type,all_amount)
      VALUES (?, ?,NOW(), ?,'未付款',?,?)
    `
    const [orderResult] = await connection.query(orderSql, [
      userId,
      orderCode,
      total_price,
      orderType,
      allAmount,
    ])
    const orderId = orderResult.insertId

    const details = cartItems.map((item) => ({
      order_id: orderId,
      user_id: item.user_id,
      product_id: item.product_id,
      rent_id: item.rent_id,
      course_id: item.course_id,
      p_color: item.p_color,
      p_size: item.p_size,
      p_price: item.p_price,
      p_total: item.p_price * 0.8 * item.p_amount,
      p_amount: item.p_amount,
      r_color: item.r_color,
      r_size: item.r_size,
      day_price: item.rent_price,
      r_total: item.rent_price * 0.8 * item.r_amount,
      r_amount: item.r_amount,
      start_time: item.start_time,
      end_time: item.end_time,
      c_price: item.c_price,
      c_total: item.c_price * item.c_amount,
      c_amount: item.c_amount,
      img: item.img,
    }))

    for (let detail of details) {
      const detailSql = `
    INSERT INTO order_detail
    (order_id, user_id, product_id, rent_id, course_id, p_color, p_size, p_price, p_total, p_amount, r_color, r_size, day_price, r_total, r_amount, start_time, end_time, c_price, c_total, c_amount,img)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
  `
      await connection.query(detailSql, [
        detail.order_id,
        detail.user_id,
        detail.product_id,
        detail.rent_id,
        detail.course_id,
        detail.p_color,
        detail.p_size,
        detail.p_price,
        detail.p_total,
        detail.p_amount,
        detail.r_color,
        detail.r_size,
        detail.day_price,
        detail.r_total,
        detail.r_amount,
        detail.start_time,
        detail.end_time,
        detail.c_price,
        detail.c_total,
        detail.c_amount,
        detail.img,
      ]) // 确保这行代码被调用以执行SQL语句
    }

    // 清空购物车
    const clearCartSql = 'DELETE FROM cart WHERE user_id = ?'
    await connection.query(clearCartSql, [userId])

    // 提交事务
    await connection.commit()
    res.send({ success: true, message: 'Checkout completed', orderId: orderId })
    // 创建订单后重定向到支付页面
    // res.redirect(`/payment/${orderId}`)
  } catch (error) {
    await connection.rollback() // 事务回滚
    console.error('Transaction Error:', error)
    res.status(500).send('Transaction failed')
  } finally {
    connection.release() // 释放连接回连接池
  }
})
// 訂購者
// router.get('/user/:userId/:orderId', async (req, res) => {
//   const { userId, orderId } = req.params // 从路由参数获取 userId 和 orderId
//   try {
//     let sql = `

//       SELECT
//         user.phone AS u_phone,
//         user.account AS u_email,
//         user.address AS u_address,
//         user.name AS u_name,
//         GROUP_CONCAT(coupon.name) AS coupons,
//         GROUP_CONCAT(coupon.option) AS c_type,
//         GROUP_CONCAT(coupon.discount) AS c_discount,
//         GROUP_CONCAT(coupon.coding) AS c_coding,
//         GROUP_CONCAT(coupon.use_restrict) AS c_restrict,
//         \`order\`.*
//       FROM \`order\`
//       JOIN user ON user.id = \`order\`.user_id
//       JOIN user_coupon ON user_coupon.user_id = user.id
//       JOIN coupon ON coupon.id = user_coupon.coupon_id
//       WHERE \`order\`.user_id = ? AND \`order\`.id = ?  AND \`order\`.status = '未付款' AND user_coupon.is_used = 0
//     `

//     // 执行参数化查询，安全地传入 userId 和 orderId
//     const [result] = await db.query(sql, [userId, orderId])
//     res.send(result)
//   } catch (error) {
//     console.error('Error querying database:', error)
//     res.status(500).send('Error querying database')
//   }
// })
// 訂購者更新
router.get('/user/:userId/:orderId', async (req, res) => {
  const { userId, orderId } = req.params // 从路由参数获取 userId 和 orderId
  try {
    let sql = `
      SELECT
        user.phone AS u_phone,
        user.account AS u_account,
        user.email AS u_email,
        user.address AS u_address,
        user.name AS u_name,
        GROUP_CONCAT(coupon.name) AS coupons,
        GROUP_CONCAT(coupon.option) AS c_type,
        GROUP_CONCAT(coupon.discount) AS c_discount,
        GROUP_CONCAT(coupon.coding) AS c_coding,
        GROUP_CONCAT(coupon.use_restrict) AS c_restrict,
        \`order\`.*
      FROM \`order\`
      JOIN user ON user.id = \`order\`.user_id
      LEFT JOIN user_coupon ON user_coupon.user_id = user.id AND user_coupon.is_used = 0
      LEFT JOIN coupon ON coupon.id = user_coupon.coupon_id
      WHERE \`order\`.user_id = ? AND \`order\`.id = ? AND \`order\`.status = '未付款'
      GROUP BY \`order\`.id, user.id
    `

    // 执行参数化查询，安全地传入 userId 和 orderId
    const [result] = await db.query(sql, [userId, orderId])
    res.send(result)
  } catch (error) {
    console.error('Error querying database:', error)
    res.status(500).send('Error querying database')
  }
})

// 租用
router.get('/rent/:userId/:orderId', async (req, res) => {
  const { userId, orderId } = req.params // 从路由参数获取 userId 和 orderId
  try {
    // 构建参数化的SQL查询语句
    let sql =
      // 需要區分不然欄位沒資料會跑出空值
      `
    SELECT
    rent.name AS r_name,
    order_detail.*
    FROM order_detail
    JOIN  \`order\` ON  \`order\`.id =  order_detail.order_id
    JOIN rent ON rent.id = order_detail.rent_id
    WHERE order_detail.user_id = ? AND order_detail.order_id = ? AND \`order\`.status = '未付款'
    `
    // 执行参数化查询，安全地传入 userId 和 orderId
    const [result] = await db.query(sql, [userId, orderId])
    res.send(result)
  } catch (error) {
    console.error('Error querying database:', error)
    res.status(500).send('Error querying database')
  }
})
// 商品
router.get('/product/:userId/:orderId', async (req, res) => {
  const { userId, orderId } = req.params // 从路由参数获取 userId 和 orderId
  try {
    // 构建参数化的SQL查询语句
    let sql =
      // 需要區分不然欄位沒資料會跑出空值
      `
    SELECT
    product.name AS p_name,
    order_detail.*
    FROM order_detail
    JOIN  \`order\` ON  \`order\`.id =  order_detail.order_id
    JOIN product ON product.id = order_detail.product_id
    WHERE order_detail.user_id = ? AND order_detail.order_id = ? AND \`order\`.status = '未付款'
    `
    // 执行参数化查询，安全地传入 userId 和 orderId
    const [result] = await db.query(sql, [userId, orderId])
    res.send(result)
  } catch (error) {
    console.error('Error querying database:', error)
    res.status(500).send('Error querying database')
  }
})
// 課程
router.get('/course/:userId/:orderId', async (req, res) => {
  const { userId, orderId } = req.params // 从路由参数获取 userId 和 orderId
  try {
    // 构建参数化的SQL查询语句
    let sql =
      // 需要區分不然欄位沒資料會跑出空值
      `
    SELECT
    course.description AS c_des,
    course.course_start AS c_start,
    course.course_end AS c_end,
    teacher.name AS t_name,
    type.name AS type_name,
    course.name AS c_name,
    order_detail.*
    FROM order_detail
    JOIN  \`order\` ON  \`order\`.id =  order_detail.order_id
    JOIN course ON course.id = order_detail.course_id
    JOIN teacher ON teacher.id = course.teacher_id
    JOIN type ON type.id = course.type_id
    WHERE order_detail.user_id = ? AND order_detail.order_id = ? AND \`order\`.status = '未付款'
    `
    // 执行参数化查询，安全地传入 userId 和 orderId
    const [result] = await db.query(sql, [userId, orderId])
    res.send(result)
  } catch (error) {
    console.error('Error querying database:', error)
    res.status(500).send('Error querying database')
  }
})

// 轉換
const paymentMethodMap = {
  cash: '貨到付款',
  line: 'LinePay',
  card: '信用卡',
}

const deliveryMethodMap = {
  home: '宅配',
  store: '門市自取',
}
// 提交訂單
router.patch('/submit/:userId/:orderId', async (req, res) => {
  const { userId, orderId } = req.params // 从路由参数获取 userId 和 orderId

  const {
    name,
    phone,
    address,
    note,
    payment: paymentKey,
    delivery: deliveryKey,
    total_price,
    coupon_code,
    discount_price,
    final_price,
  } = req.body
  const payment = paymentMethodMap[paymentKey] // 将英文转换为中文
  const delivery = deliveryMethodMap[deliveryKey]
  // console.log('请求参数:', req.params)
  // 执行数据库操作前
  // console.log('执行更新前的 SQL:', sql)

  // // 根据支付方式设置订单状态
  // 根据支付方式设置订单状态
  let status = paymentKey === 'card' ? '已付款' : '待付款'
  // let status = '未付款' // 默认为未付款状态
  // if (payment === 'cash') {
  //   status = '待付款' // 如果是货到付款，则设置为待付款
  // } else if (payment === 'line' || payment === 'card') {
  //   status = '已付款' // 如果是线上支付或信用卡，则设置为已付款
  // }

  let sql = `
      UPDATE \`order\`
      SET
      status=?,
          name = ?,
          phone = ?,
          address = ?,
          note = ?,
          payment = ?,
          delivery = ?,
          total_price = ?,
          coupon_code = ?,
          discount_price = ?,
          final_price = ?
         
          WHERE user_id = ? AND id = ?`

  try {
    // 执行数据库更新操作
    const [result] = await db.query(sql, [
      status, // 状态值应该是第一个
      name,
      phone,
      address,
      note,
      payment,
      delivery,
      total_price,
      coupon_code,
      discount_price,
      final_price,
      userId,
      orderId,
    ])

    // console.log('更新操作的影响行数：', result.affectedRows)

    // // 根据更新操作的结果来返回响应
    // if (result.affectedRows > 0) {
    //   res.json({ message: '订单更新成功', orderId: orderId })
    // } else {
    //   res.status(404).json({ message: '未找到订单或订单状态不符合更新条件' })
    // }

    if (result.affectedRows > 0) {
      if (coupon_code) {
        console.log('Coupon code:', coupon_code)

        // 更新优惠券状态为已使用
        const couponSql = `
        UPDATE user_coupon
        SET is_used = 1, redemption_date = NOW()
        WHERE user_id = ? AND coupon_id = (SELECT id FROM coupon WHERE coding = ?) AND is_used = 0
      `
        // console.log('測試couponSql', couponSql)
        const [couponUpdateResult] = await db.query(couponSql, [
          userId,
          coupon_code,
        ])
        // console.log('測試', couponUpdateResult)
        if (couponUpdateResult.affectedRows > 0) {
          res.json({ message: '订单和优惠券更新成功', orderId: orderId })
        } else {
          res.status(400).json({ message: '优惠券更新失败或已使用' })
        }
      } else {
        res.json({ message: '订单更新成功', orderId: orderId })
      }
    } else {
      res.status(404).json({ message: '未找到订单或订单状态不符合更新条件' })
    }
  } catch (error) {
    console.error('更新订单错误:', error)
    res.status(500).json({ message: '服务器错误', error: error })
  }
})

// 訂單查詢頁面
router.get('/success/:userId/:orderId', async (req, res) => {
  const { userId, orderId } = req.params // 从路由参数获取 userId 和 orderId
  try {
    let sql = `
      SELECT
        \`order\`.*
      FROM \`order\`
      JOIN user ON user.id = \`order\`.user_id
      WHERE \`order\`.user_id = ? AND \`order\`.id = ?  
    `

    // 执行参数化查询，安全地传入 userId 和 orderId
    const [result] = await db.query(sql, [userId, orderId])
    res.send(result)
  } catch (error) {
    console.error('Error querying database:', error)
    res.status(500).send('Error querying database')
  }
})

// line pay測試
// 定義安全的私鑰字串
const linePayClient = createLinePayClient({
  channelId: process.env.LINE_PAY_CHANNEL_ID,
  channelSecretKey: process.env.LINE_PAY_CHANNEL_SECRET,
  env: process.env.NODE_ENV,
})

router.post('/reserve/:userId/:orderId', async (req, res) => {
  const { userId, orderId } = req.params
  // 移除任何可能的不可见字符
  const sanitizedOrderId = orderId.replace(/\u200B/g, '').trim()

  console.log(`Sanitized Order ID: ${sanitizedOrderId}`)

  if (!sanitizedOrderId) {
    return res.json({ status: 'error', message: 'order id不存在' })
  }

  // 设置重定向与失败重定向的 URL
  // 改成導後端在導前端
  // const redirectUrls = {
  //   confirmUrl: process.env.REACT_REDIRECT_CONFIRM_URL,
  //   cancelUrl: process.env.REACT_REDIRECT_CANCEL_URL,
  // }
  const redirectUrls = {
    confirmUrl: 'http://localhost:3005/api/order/confirm/order',
    cancelUrl: process.env.REACT_REDIRECT_CANCEL_URL,
  }

  try {
    let sql = `
  SELECT
    \`order\`.*
  FROM \`order\`
  WHERE \`order\`.user_id = ? AND \`order\`.id = ?  
`
    const [result] = await db.query(sql, [userId, sanitizedOrderId])
    // console.log(`查询结果: ${JSON.stringify(result)}`)
    // console.log(`查询结果2: `, result[0])

    if (result.length === 0) {
      return res.json({ status: 'error', message: '訂單不存在' })
    }

    const orderRecord = result[0]

    // console.log('測試', orderRecord)

    const products = [
      {
        id: `prod_${orderRecord.id}`,
        name: `name_${orderRecord.id}`,
        imageUrl: `img_${orderRecord.id}` || 'https://example.com/product.jpg',
        quantity: 1,
        price: orderRecord.final_price,
      },
    ]

    const finalAmount = orderRecord.final_price

    const order = {
      orderId: orderRecord.id,
      amount: Number(finalAmount), // 确保金额为数值类型
      currency: 'TWD',
      packages: [
        {
          id: `pkg_${orderRecord.id}`,
          amount: Number(finalAmount), // 确保金额为数值类型
          name: 'Order Package',
          products: products,
        },
      ],
    }

    // console.log(`构建的订单数据，内容如下：`, order)
    try {
      // 向 Line Pay 发送订单数据
      const linePayResponse = await linePayClient.request.send({
        body: { ...order, redirectUrls },
      })

      const reservation = {
        returnCode: linePayResponse.body.returnCode,
        returnMessage: linePayResponse.body.returnMessage,
        transactionId: linePayResponse.body.info.transactionId,
        paymentAccessToken: linePayResponse.body.info.paymentAccessToken,
      }

      console.log(`预计付款数据 (Reservation) 已创建。数据如下:`)
      console.log(reservation)

      await db.query(
        'UPDATE `order` SET reservation = ?, transaction_id = ? WHERE id = ?',
        [
          JSON.stringify(reservation),
          reservation.transactionId,
          sanitizedOrderId,
        ]
      )

      return res.json({ paymentUrl: linePayResponse.body.info.paymentUrl.web })
      // 有CORS問題
      // return res.redirect(linePayResponse.body.info.paymentUrl.web)
    } catch (e) {
      console.log('error', e)
      return res
        .status(500)
        .json({ status: 'error', message: '无法处理支付请求', error: e })
    }
  } catch (error) {
    console.error('Error querying database:', error)
    res.status(500).send('Error querying database')
  }
})

// 确认路由，從後端導前端
// line強制get
router.get('/confirm/order', async (req, res) => {
  try {
    // 从 URL 获取 transactionId 和 orderId
    const { transactionId, orderId } = req.query
    console.log('查询参数:', transactionId, orderId)
    if (!transactionId || !orderId) {
      return res
        .status(400)
        .json({ status: 'error', message: '缺少 transactionId 或 orderId' })
    }

    // 从数据库获取交易数据
    const dbOrder = await db.query(
      'SELECT * FROM `order` WHERE transaction_id = ? AND id = ?',
      [transactionId, orderId]
    )

    if (dbOrder.length === 0) {
      return res.status(404).json({ status: 'error', message: '订单不存在' })
    }

    const orderRecord = dbOrder[0]
    // console.log('查詢', orderRecord)
    const test = orderRecord[0]
    // console.log('查詢', test)
    const transaction = JSON.parse(test.reservation)
    // console.log('查詢', transaction)

    // 更新訂單狀態
    let status = '已付款'
    if (transaction.returnCode !== '0000') {
      status = '付款失敗'
    }

    let sql = `UPDATE \`order\` SET status = ?, reservation = ? WHERE id = ?`
    const [result] = await db.query(sql, [
      status,
      transaction.returnCode,
      orderId,
    ])

    // res.send('測試')
    // 重定向到前端路由
    // return res.redirect(`http://localhost:3000/cart/checkout/order/${orderId}`)
    if (result.affectedRows > 0) {
      // 延迟6秒再重定向
      setTimeout(() => {
        return res.redirect(
          `http://localhost:3000/cart/checkout/order/${orderId}`
        )
      }, 6000)
    } else {
      return res
        .status(500)
        .json({ status: 'error', message: '更新订单状态失败' })
    }
  } catch (error) {
    console.error('服务器错误:', error)
    return res
      .status(500)
      .json({ status: 'error', message: '服务器错误', data: error })
  }
})

export default router

// SQL 的一个重要限制是它不允许在同一查询中先执行一个计算赋值给一个别名（如 rent_price），然后立即使用这个别名进行进一步的计算和插入操作。
