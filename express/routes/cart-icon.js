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

export default router
