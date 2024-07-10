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
    let sql = `SELECT
          product_id,
          course_id,
          rent_id,
          p_amount,r_amount,c_amount
          FROM cart
          JOIN user ON user.id = cart.user_id
          LEFT JOIN product ON product.id = cart.product_id
          LEFT JOIN course ON course.id = cart.course_id
          LEFT JOIN rent ON  rent.id = cart.rent_id
          WHERE cart.user_id = ? `

    const [result] = await db.query(sql, [userId])

    res.send(result)
  } catch (error) {
    console.error('Error querying database:', error)
    res.status(500).send('Error querying database')
  }
})
// router.post('/:userId/add', async (req, res) => {
//   const { userId, productId, newQuantity } = req.body

//   try {
//     let sql = ` UPDATE cart SET p_amount = ? WHERE user_id = ? AND product_id = ?`
//     const [result] = await db.query(sql, [newQuantity, userId, productId])
//     if (result.affectedRows > 0) {
//       res.status(200).send('Product quantity updated successfully')
//     } else {
//       res.status(404).send('Product not found in cart')
//     }
//   } catch (error) {
//     console.error('Database error:', error)
//     res.status(500).send('Failed to update product quantity in cart')
//   }
// })

export default router
