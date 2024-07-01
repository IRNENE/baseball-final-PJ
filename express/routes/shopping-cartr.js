import express from 'express'
const router = express.Router()
import db from '##/configs/mysql.js'

router.post('/rent', async (req, res) => {
  // 从请求体中获取需要的数据
  const {
    user_id,
    rent_id,
    r_price,
    r_size,
    r_amount,
    r_color,
    start_time,
    end_time,
    img,
  } = req.body
  console.log(req.body)
  // 数据验证（确保所有字段不为空）
  if (
    !user_id ||
    !rent_id ||
    !r_price ||
    !r_size ||
    !r_amount ||
    !r_color ||
    !start_time ||
    !end_time ||
    !img
  ) {
    return res
      .status(400)
      .json({ status: 'fail', error: 'Missing required fields' })
  }

  try {
    // 首先检查购物车中是否已存在相同商品和尺寸的记录
    const checkQuery =
      'SELECT * FROM cart WHERE user_id = ? AND rent_id = ? AND r_size = ?'
    const [existing] = await db.query(checkQuery, [user_id, rent_id, r_size])

    if (existing && existing.length > 0) {
      // 如果存在，更新该记录的数量
      const newAmount = existing[0].r_amount + r_amount
      const updateQuery = 'UPDATE cart SET r_amount = ? WHERE id = ?'
      await db.query(updateQuery, [newAmount, existing[0].id])
      res.json({
        status: 'success',
        message: 'Shopping cart updated successfully',
      })
    } else {
      // 如果不存在，执行插入新记录操作
      const insertQuery =
        'INSERT INTO cart (user_id, rent_id, r_price, r_size, r_amount, r_color, start_time, end_time, img) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
      await db.query(insertQuery, [
        user_id,
        rent_id,
        r_price,
        r_size,
        r_amount,
        r_color,
        start_time,
        end_time,
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

export default router
