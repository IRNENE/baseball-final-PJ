import express from 'express'
const router = express.Router()
import db from '##/configs/mysql.js'
import 'dotenv/config.js'

router.post('/:id', async (req, res) => {
  const {
    p_id = '',
    r_id = '',
    c_id = '',
    description = '',
    star = 0,
  } = req.body // 從請求的 body 中獲取資料
  const userId = req.params.id
  try {
    // 將評論新增到評論資料表
    const insertSql = `INSERT INTO comment (user_id, p_id , r_id, c_id, description, star, created_at	
    ) VALUES ( ? , ? , ? , ?, ?, ?, NOW() )`

    await db.query(insertSql, [userId, p_id, r_id, c_id, description, star])
    res.status(201).send('評論成功')
  } catch (error) {
    console.error('連接資料庫發生錯誤', error)
    res.status(500).send('連接資料庫發生錯誤')
  }
})

router.get('/product/:productId', async (req, res) => {
  try {
    const userId = req.params.id
    const productId = req.params.productId
    const sql = `SELECT comment.* , user.account, user.photo, user.email
    FROM comment
    JOIN user
    ON comment.user_id = user.id
    WHERE comment.p_id = ? 
    ORDER BY comment.created_at DESC`

    const [result] = await db.query(sql, [productId])

    return res.status(200).send(result)
  } catch (error) {
    console.error('連接資料庫發生錯誤', error)
    res.status(500).send('連接資料庫發生錯誤')
  }
})

router.get('/rent/:rentId', async (req, res) => {
  try {
    const userId = req.params.id
    const rentId = req.params.rentId
    const sql = `SELECT comment.* , user.account, user.photo, user.email
    FROM comment
    JOIN user
    ON comment.user_id = user.id
    WHERE comment.r_id = ? 
    ORDER BY comment.created_at DESC`

    const [result] = await db.query(sql, [rentId])

    return res.status(200).send(result)
  } catch (error) {
    console.error('連接資料庫發生錯誤', error)
    res.status(500).send('連接資料庫發生錯誤')
  }
})

router.get('/course/:courseId', async (req, res) => {
  try {
    const userId = req.params.id
    const courseId = req.params.courseId
    const sql = `SELECT comment.* , user.account, user.photo, user.email
    FROM comment
    JOIN user
    ON comment.user_id = user.id
    WHERE comment.c_id = ? 
    ORDER BY comment.created_at DESC`

    const [result] = await db.query(sql, [courseId])

    return res.status(200).send(result)
  } catch (error) {
    console.error('連接資料庫發生錯誤', error)
    res.status(500).send('連接資料庫發生錯誤')
  }
})

export default router
