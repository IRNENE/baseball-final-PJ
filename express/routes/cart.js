import express from 'express'
const router = express.Router()
import db from '##/configs/mysql.js'
const app = express()
app.use(express.json()) // 确保这行在所有路由之前
// 產品
router.get('/product/:userId', async (req, res) => {
  //get方法
  const userId = req.params.userId
  try {
    // 构建参数化的SQL查询语句
    let sql = `SELECT
        user.name AS u_name,
        product.id AS p_id,
        product.price AS p_price,
        product.name AS p_name,
        cart.*
        FROM cart
        JOIN user ON user.id = cart.user_id
        JOIN product ON product.id = cart.product_id
        WHERE cart.user_id = ? `
    // console.log(userId)
    const [result] = await db.query(sql, [userId])
    // console.log(result)
    res.send(result)
  } catch (error) {
    console.error('Error querying database:', error)
    res.status(500).send('Error querying database')
  }
})

// 更新商品數量
router.patch('/update-quantity', async (req, res) => {
  const { userId, productId, newQuantity } = req.body
  // console.log(req.body) // 查看后端收到的数据
  if (!userId || !productId || newQuantity === undefined) {
    return res.status(400).send('Missing parameters')
  }
  try {
    let sql = ` UPDATE cart SET p_amount = ? WHERE user_id = ? AND product_id = ?`
    const [result] = await db.query(sql, [newQuantity, userId, productId])
    if (result.affectedRows > 0) {
      res.status(200).send('Product quantity updated successfully')
    } else {
      res.status(404).send('Product not found in cart')
    }
  } catch (error) {
    console.error('Database error:', error)
    res.status(500).send('Failed to update product quantity in cart')
  }
})

// 刪除商品
router.delete('/del/:userId/:productId', async (req, res) => {
  const { userId, productId } = req.params

  try {
    // 檢查該商品記錄中是否存在其他ID（如租用ID或課程ID）
    let checkQuery = `SELECT rent_id, course_id FROM cart WHERE user_id = ? AND product_id = ?`
    const [checkResult] = await db.query(checkQuery, [userId, productId])
    // console.log('測試長度', checkResult.length)

    if (checkResult.length > 0) {
      const { rent_id, course_id } = checkResult[0]

      if (rent_id || course_id) {
        // 如果存在其他ID，則清空商品ID
        let updateQuery = `UPDATE cart SET product_id = NULL WHERE user_id = ? AND product_id = ?`
        await db.query(updateQuery, [userId, productId])
        res.send({ message: 'Product ID cleared from the cart entry.' })
      } else {
        // 如果不存在其他ID，則刪除該記錄
        let deleteQuery = `DELETE FROM cart WHERE user_id = ? AND product_id = ?`
        await db.query(deleteQuery, [userId, productId])
        res.send({ message: 'Cart item deleted successfully.' })
      }
    } else {
      res.status(404).send({ message: 'No cart item found.' })
    }
  } catch (error) {
    console.error('Database error:', error)
    res.status(500).send({ message: 'Failed to process the request.' })
  }
})
// -------------------------
// 租用

// 租用
router.get('/rent/:userId', async (req, res) => {
  //get方法
  const userId = req.params.userId
  try {
    // 构建参数化的SQL查询语句
    let sql = `SELECT
        user.name AS u_name,
        rent.id AS r_id,
        rent.price AS r_price,
        rent.name AS r_name,
        DATEDIFF(cart.end_time, cart.start_time) + 1 AS rental_days,
        (rent.price * (DATEDIFF(cart.end_time, cart.start_time) + 1)) AS rent_price,
        cart.*
        FROM cart
        JOIN user ON user.id = cart.user_id
        JOIN rent ON rent.id = cart.rent_id
        WHERE cart.user_id = ? `
    // console.log(userId)
    const [result] = await db.query(sql, [userId])
    // console.log(result)
    res.send(result)
  } catch (error) {
    console.error('Error querying database:', error)
    res.status(500).send('Error querying database')
  }
})

// 更新商品數量
router.patch('/rent/update-quantity', async (req, res) => {
  const { userId, productId, newQuantity } = req.body
  // console.log(req.body) // 查看后端收到的数据
  if (!userId || !productId || newQuantity === undefined) {
    return res.status(400).send('Missing parameters')
  }
  try {
    let sql = ` UPDATE cart SET r_amount = ? WHERE user_id = ? AND rent_id = ?`
    const [result] = await db.query(sql, [newQuantity, userId, productId])
    if (result.affectedRows > 0) {
      res.status(200).send('rent quantity updated successfully')
    } else {
      res.status(404).send('rent not found in cart')
    }
  } catch (error) {
    console.error('Database error:', error)
    res.status(500).send('Failed to update rent quantity in cart')
  }
})

// 刪除商品
router.delete('/rent/del/:userId/:productId', async (req, res) => {
  const { userId, productId } = req.params

  try {
    // 檢查該商品記錄中是否存在其他ID（如租用ID或課程ID）
    let checkQuery = `SELECT product_id, course_id FROM cart WHERE user_id = ? AND rent_id = ?`
    const [checkResult] = await db.query(checkQuery, [userId, productId])
    // console.log('測試長度', checkResult.length)

    if (checkResult.length > 0) {
      const { product_id, course_id } = checkResult[0]

      if (product_id || course_id) {
        // 如果存在其他ID，則清空商品ID
        let updateQuery = `UPDATE cart SET rent_id = NULL WHERE user_id = ? AND rent_id = ?`
        await db.query(updateQuery, [userId, productId])
        res.send({ message: 'rent ID cleared from the cart entry.' })
      } else {
        // 如果不存在其他ID，則刪除該記錄
        let deleteQuery = `DELETE FROM cart WHERE user_id = ? AND rent_id = ?`
        await db.query(deleteQuery, [userId, productId])
        res.send({ message: 'rent item deleted successfully.' })
      }
    } else {
      res.status(404).send({ message: 'No rent item found.' })
    }
  } catch (error) {
    console.error('Database error:', error)
    res.status(500).send({ message: 'Failed to process the request.' })
  }
})

// 租用
// --------------
// ------------------------------------------------------
// 課程
router.get('/lesson/:userId', async (req, res) => {
  //get方法
  const userId = req.params.userId
  try {
    // 构建参数化的SQL查询语句
    let sql = `SELECT
        course.id AS c_id,
        course.price AS c_price,
        course.name AS c_name,
        course.description AS c_des,
        course.course_start AS c_start,
        course.course_end AS c_end,
        teacher.name AS t_name,
        type.name AS type_name,
        cart.*
        FROM cart
        JOIN user ON user.id = cart.user_id
        JOIN course ON course.id = cart.course_id
        JOIN teacher ON teacher.id = course.teacher_id
        JOIN type ON type.id = course.type_id
        WHERE cart.user_id = ? `
    // console.log(userId)
    const [result] = await db.query(sql, [userId])
    // console.log(result)
    res.send(result)
  } catch (error) {
    console.error('Error querying database:', error)
    res.status(500).send('Error querying database')
  }
})
router.patch('/course/update-quantity', async (req, res) => {
  const { userId, productId, newQuantity } = req.body
  // console.log(req.body) // 查看后端收到的数据
  if (!userId || !productId || newQuantity === undefined) {
    return res.status(400).send('Missing parameters')
  }
  try {
    let sql = ` UPDATE cart SET c_amount = ? WHERE user_id = ? AND course_id = ?`
    const [result] = await db.query(sql, [newQuantity, userId, productId])
    if (result.affectedRows > 0) {
      res.status(200).send('c quantity updated successfully')
    } else {
      res.status(404).send('c not found in cart')
    }
  } catch (error) {
    console.error('Database error:', error)
    res.status(500).send('Failed to update c quantity in cart')
  }
})
// 刪除課程
router.delete('/del/lesson/:userId/:productId', async (req, res) => {
  const { userId, productId } = req.params

  try {
    // 檢查該商品記錄中是否存在其他ID（如租用ID或商品ID）
    let checkQuery = `SELECT rent_id, product_id FROM cart WHERE user_id = ? AND course_id = ?`
    const [checkResult] = await db.query(checkQuery, [userId, productId])
    // console.log('測試長度', checkResult.length)

    if (checkResult.length > 0) {
      const { rent_id, product_id } = checkResult[0]

      if (rent_id || product_id) {
        // 如果存在其他ID，則清空商品ID
        let updateQuery = `UPDATE cart SET course_id = NULL WHERE user_id = ? AND course_id = ?`
        await db.query(updateQuery, [userId, productId])
        res.send({ message: 'course ID cleared from the cart entry.' })
      } else {
        // 如果不存在其他ID，則刪除該記錄
        let deleteQuery = `DELETE FROM cart WHERE user_id = ? AND course_id = ?`
        await db.query(deleteQuery, [userId, productId])
        res.send({ message: 'Cart item course deleted successfully.' })
      }
    } else {
      res.status(404).send({ message: 'No cart item found.' })
    }
  } catch (error) {
    console.error('Database error:', error)
    res.status(500).send({ message: 'Failed to process the request.' })
  }
})

// 課程
// -------------------------------------------------------
export default router
