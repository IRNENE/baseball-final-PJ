import express from 'express'
const router = express.Router()
import db from '##/configs/mysql.js'

// router.post('/', async (req, res) => {
//   const { user_id, product_id, price, amount, start_time, end_time, class_id } =
//     req.body

//   // 数据验证（确保所有字段不为空）
//   if (
//     !user_id ||
//     !product_id ||
//     !price ||
//     !amount ||
//     !start_time ||
//     !end_time ||
//     !class_id
//   ) {
//     return res
//       .status(400)
//       .json({ status: 'fail', error: 'Missing required fields' })
//   }

//   // 执行插入数据库操作
//   const query =
//     'INSERT INTO shopping_cart (user_id, product_id, price, amount, start_time, end_time, class_id) VALUES (?, ?, ?, ?, ?, ?, ?)'

//   try {
//     const [result] = await db.query(query, [
//       user_id,
//       product_id,
//       price,
//       amount,
//       start_time,
//       end_time,
//       class_id,
//     ])

//     // 返回成功响应
//     res.json({
//       status: 'success',
//       message: 'Added to shopping cart successfully',
//     })
//   } catch (err) {
//     console.error('Failed to add to shopping cart:', err)
//     res
//       .status(500)
//       .json({ status: 'fail', error: 'Failed to add to shopping cart' })
//   }
// })

router.post('/product', async (req, res) => {
  const { user_id, product_id, p_price, p_color, p_size, p_amount, img } =
    req.body

  // 数据验证（确保所有字段不为空）
  if (
    !user_id ||
    !product_id ||
    !p_price ||
    !p_color ||
    !p_size ||
    !p_amount ||
    !img
  ) {
    return res
      .status(400)
      .json({ status: 'fail', error: 'Missing required fields' })
  }

  try {
    // 首先检查购物车中是否已存在相同商品、颜色和尺寸的记录
    const checkQuery =
      'SELECT * FROM cart WHERE user_id = ? AND product_id = ? AND p_color = ? AND p_size = ?'
    const [existing] = await db.query(checkQuery, [
      user_id,
      product_id,
      p_color,
      p_size,
    ])

    if (existing.length > 0) {
      // 如果存在，更新该记录的数量
      const newAmount = existing[0].p_amount + p_amount
      const updateQuery = 'UPDATE cart SET p_amount = ? WHERE id = ?'
      await db.query(updateQuery, [newAmount, existing[0].id])
      res.json({
        status: 'success',
        message: 'Shopping cart updated successfully',
      })
    } else {
      // 如果不存在，执行插入新记录操作
      const insertQuery =
        'INSERT INTO cart (user_id, product_id, p_price, p_color, p_size, p_amount, img) VALUES (?, ?, ?, ?, ?, ?, ?)'
      await db.query(insertQuery, [
        user_id,
        product_id,
        p_price,
        p_color,
        p_size,
        p_amount,
        img,
      ])
      res.json({
        status: 'success',
        message: 'Added to shopping cart successfully',
      })
    }
  } catch (err) {
    console.error('Failed to add or update cart:', err)
    res.status(500).json({ status: 'fail', error: 'Failed to add to cart' })
  }
})

// router.get('/:userId', async (req, res) => {
//   const userId = req.params.userId

//   // 使用參數化查詢來防止SQL注入
//   const sql = 'SELECT * FROM cart WHERE user_id = ?'

//   try {
//     // 執行參數化查詢，將 `userId` 傳遞作為參數
//     const [result] = await db.query(sql, [userId])

//     // 如果結果集為空，則返回404狀態碼和消息
//     if (result.length === 0) {
//       res.status(404).json({
//         message: 'No shopping cart items found for the specified user.',
//       })
//     } else {
//       // 返回整個結果集
//       res.json(result)
//     }
//   } catch (error) {
//     console.error('Error querying database:', error)
//     res.status(500).json({ message: 'Error querying database', error })
//   }
// })
export default router
