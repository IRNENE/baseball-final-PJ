import express from 'express'
const router = express.Router()
import db from '##/configs/mysql.js'

router.post('/', async (req, res) => {
  const { user_id, product_id, class_id } = req.body

  // 数据验证：确保所有字段不为空
  if (!user_id || !product_id || !class_id) {
    return res
      .status(400)
      .json({ status: 'fail', error: 'Missing required fields' })
  }

  try {
    // 查询数据库，检查是否存在相同的 user_id、product_id 和 class_id 记录
    const checkQuery =
      'SELECT * FROM favorite WHERE user_id = ? AND product_id = ? AND class_id = ?'
    const [existingRecord] = await db.query(checkQuery, [
      user_id,
      product_id,
      class_id,
    ])

    if (existingRecord.length > 0) {
      // 如果记录存在，删除该记录
      const deleteQuery =
        'DELETE FROM favorite WHERE user_id = ? AND product_id = ? AND class_id = ?'
      await db.query(deleteQuery, [user_id, product_id, class_id])
      res.json({
        status: 'fail',
        message: 'Added to shopping cart successfully',
      })
    } else {
      // 如果记录不存在，插入数据
      const insertQuery =
        'INSERT INTO favorite (user_id, product_id, class_id) VALUES (?, ?, ?)'
      await db.query(insertQuery, [user_id, product_id, class_id])
      res.json({
        status: 'success',
        message: 'Added to shopping cart successfully',
      })
      // 返回成功响应
    }
  } catch (err) {
    console.error('Failed to process request:', err)
    res.status(500).json({ status: 'error', error: 'Internal server error' })
  }
})

router.get('/user/:id/', async (req, res) => {
  const userId = req.params.id

  // 使用参数化查询来防止 SQL 注入攻击
  const sql = `SELECT * FROM favorite WHERE user_id = ? AND class_id = 'C'`

  try {
    // 使用参数化查询执行数据库查询
    const [result] = await db.query(sql, [userId])

    // 返回查询结果
    res.send(result)
  } catch (error) {
    console.error('Error querying database:', error)
    res.status(500).send('Error querying database')
  }
})

// //  從收藏列表中移除商品
// router.delete('/:courseId', async (req, res) => {
//   const courseId = req.params.courseId
//   const userId = req.user.id
//   console.log(userId)
//   try {
//     // 檢查商品是否已經在收藏列表中
//     const checkSql = `SELECT * FROM favorite WHERE user_id = ? AND product_id = ? AND class_id = 'C'`
//     const [existingFavorite] = await db.query(checkSql, [userId, courseId])
//     console.log(existingFavorite)
//     if (existingFavorite.length > 0) {
//       // 從收藏列表中移除指定商品
//       const deleteSql = `DELETE FROM favorite WHERE user_id = ? AND product_id = ?`
//       await db.query(deleteSql, [userId, courseId])
//       return res.status(201).send('收藏移除成功')
//     }
//   } catch (error) {
//     console.error('Error querying database:', error)
//     res.status(500).send('移除失敗')
//   }
// })

export default router
