import express from 'express'
const router = express.Router()
import db from '##/configs/mysql.js'
const app = express()
app.use(express.json()) // 确保这行在所有路由之前

router.get('/:userId', async (req, res) => {
  //get方法
  const userId = req.params.userId
  try {
    // 构建参数化的SQL查询语句
    let sql = `
    SELECT user.name AS u_name, coupon.name AS c_name, coupon.time_end AS c_end,coupon.description AS c_desc ,coupon.coding AS c_code,user_coupon.* 
    FROM user_coupon 
    JOIN user ON user.id = user_coupon.user_id 
    JOIN coupon ON coupon.id = user_coupon.coupon_id
    WHERE user.id = ? 
    `
    // 执行参数化查询，安全地传入 userId
    const [result] = await db.query(sql, [userId])
    res.send(result)
  } catch (error) {
    console.error('Error querying database:', error)
    res.status(500).send('Error querying database')
  }
})

async function checkCoupon(couponCode, userId) {
  try {
    // 检查coupon表中是否存在此couponCode

    let sqlCouponExists = `
      SELECT id, time_end FROM coupon WHERE coding = ?;
    `
    const couponResults = await db.query(sqlCouponExists, [couponCode])
    const couponArray = couponResults[0]
    console.log('couponExist', couponArray.length)

    if (couponArray.length === 0) {
      return { success: false, message: '查無優惠券' }
    }

    const coupon = couponArray[0]
    console.log('coupon', coupon)
    // 检查user_coupon表中用户是否已拥有此优惠券
    let sqlUserCouponExists = `SELECT user_coupon.*, coupon.time_end
    FROM user_coupon
    JOIN coupon ON user_coupon.coupon_id = coupon.id
    WHERE user_coupon.user_id = ? AND user_coupon.coupon_id = ?`

    const userCouponResults = await db.query(sqlUserCouponExists, [
      userId,
      coupon.id,
    ])

    const userCouponArray = userCouponResults[0]
    if (userCouponArray.length > 0) {
      const userCoupon = userCouponArray[0]
      console.log('userCoupon', userCoupon)

      if (userCoupon.is_used === 1) {
        return { success: false, message: '此優惠券已使用過' }
      } else if (userCoupon.is_used === 0 && coupon.time_end < formattedToday) {
        // 用户没有这张优惠券且過期
        return { success: false, message: '此優惠券未使用且超過期限' }
      } else {
        return { success: false, message: '此優惠券已存在' }
      }
    } else if (coupon.time_end < formattedToday) {
      // 用户没有这张优惠券且過期
      return { success: false, message: '此優惠券已過期' }
    } else {
      // 用户没有这张优惠券，插入新记录
      let insertSql = `
        INSERT INTO user_coupon (user_id, coupon_id, issue_date, is_used, created_at, updated_at)
        VALUES (?, ?, NOW(),0, NOW(), NOW());
      `
      await db.query(insertSql, [userId, coupon.id])
      return { success: true, message: '恭喜！新增此優惠券成功' }
    }
  } catch (error) {
    console.error('Database error:', error)
    return { success: false, message: '資料庫查尋錯誤', error }
  }
}

// Express 路由处理器
router.post('/verify', async (req, res) => {
  // console.log('Received headers:', req.headers)
  // console.log('Received body:', req.body)
  const { couponCode, userId } = req.body
  const result = await checkCoupon(couponCode, userId)
  res.json(result)
})

export default router

// 日期判斷
const today = new Date()
const formattedToday = formatDate(today)
// // 格式化今天的日期为 "YYYY-MM-DD"
function formatDate(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1 // getMonth() 是从 0 开始的，所以加 1
  const day = date.getDate()
  return `${year}-${month.toString().padStart(2, '0')}-${day
    .toString()
    .padStart(2, '0')}`
}

// //note:日期和多對多
// 日期已確認
// console.log(formattedToday)

// 關聯多對多條件查詢
//     let sql = `
//       SELECT
//           coupon.coding,
//           coupon.time_end,
//           user_coupon.is_used,
//           user_coupon.user_id
//       FROM
//           user_coupon
//       JOIN
//           user ON user.id = user_coupon.user_id
//       JOIN
//           coupon ON coupon.id = user_coupon.coupon_id
//       WHERE
//           coupon.coding = ? AND
//           user_coupon.user_id = ?;
//     `
//     const results = await db.query(sql, [couponCode, userId])
//     // const couponTest = results[0]
//     // console.log('Coupon Test 1:', couponTest)
//     // console.log('Coupon Test Object Properties:', Object.keys(couponTest)) // 显示所有属性键名
//     // console.log('Type of couponTest:', typeof couponTest)
//     // 查看類型，是類陣列?不是陣列
//   s: false, message: '資料库查询错误', error }
//   }
// }
