import express from 'express'
const router = express.Router()
import db from '##/configs/mysql.js'
import authenticate from '##/middlewares/authenticate.js'

// 獲取收藏商品列表
router.get('/user/:id/', authenticate, async (req, res) => {
  const userId = req.params.id
  const sql = `SELECT * FROM favorite WHERE user_id = ? AND class_id = 'P'`

  try {
    // 從資料庫中獲取已收藏的商品列表
    const [result] = await db.query(sql, [userId])
    console.log(result)
    res.send(result)
  } catch (error) {
    console.log('讀取錯誤', error)
    res.status(500).send({
      message: '讀取錯誤',
    })
  }
})

// 將商品添加到收藏列表
router.post('/:productId', authenticate, async (req, res) => {
  const productId = req.params.productId
  const userId = req.user.id
  console.log(userId)
  try {
    // 檢查商品是否已經在收藏列表中
    const checkSql = `SELECT * FROM favorite WHERE user_id = ${userId} AND product_id = ${productId} AND class_id = 'P'`
    const [existingFavorite] = await db.query(checkSql)
    // console.log(existingFavorite)
    if (existingFavorite.length > 0) {
      const deleteSql = `DELETE FROM favorite WHERE user_id = ${userId} AND product_id = ${productId}`
      await db.query(deleteSql)
      return res.status(201).send('收藏移除成功')
      // return res.status(400).send('此商品已收藏')
    }

    // 將商品添加到收藏列表
    const insertSql = `INSERT INTO favorite (user_id, product_id , class_id) VALUES (${userId}, ${productId} , 'P')`
    await db.query(insertSql)

    res.status(201).send('收藏成功')
  } catch (error) {
    console.error('Error querying database:', error)
    res.status(500).send('Error querying database')
  }
})

// // 從收藏列表中移除商品
// router.delete('/:productId', authenticate, async (req, res) => {
//   const productId = req.params.productId
//   const userId = req.user.id
//   try {
//     // 檢查商品是否已經在收藏列表中
//     const checkSql = `SELECT * FROM favorite WHERE user_id = ${userId} AND product_id = ${productId} AND class_id = 'P'`
//     const [existingFavorite] = await db.query(checkSql)
//     // console.log(existingFavorite)
//     if (existingFavorite.length === 0) {
//       return res.status(400).send('無此收藏紀錄')
//     }
//     // 從收藏列表中移除指定商品
//     const deleteSql = `DELETE FROM favorite WHERE user_id = ${userId} AND product_id = ${productId}`
//     await db.query(deleteSql)
//     res.send('收藏移除成功')
//   } catch (error) {
//     console.error('Error querying database:', error)
//     res.status(500).send('移除失敗')
//   }
// })

export default router
