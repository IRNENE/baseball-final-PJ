import express from 'express'
const router = express.Router()

import db from '##/configs/mysql.js'
router.get('/', async (req, res) => {
  const { priceMin, priceMax, dateStart, dateEnd, cate } = req.query
  let sql = `SELECT * FROM course WHERE valid=1`
  // 是否僅輸入最小金額
  if (priceMin && !priceMax) {
    sql += ` AND price>=${priceMin}`
  }
  if (priceMax && !priceMin) {
    sql += ` AND price<=${priceMax}`
  }
  // 最小與最大都有輸入的話，查詢範圍
  if (priceMin && priceMax) {
    sql += ` AND price BETWEEN ${priceMin} AND ${priceMax}`
  }
  // 若僅有開始時間，查詢開始時間到當下時間
  if (dateStart && !dateEnd) {
    const currentDate = new Date().toISOString().split('T')[0]
    const startDate = new Date(dateStart).toISOString().split('T')[0]
    sql += ` AND course_start <= ${startDate} AND course_end >=${currentDate}`
    // 若有開始與結束，查詢範圍
  } else if (dateEnd && dateStart) {
    const startDate = new Date(dateStart).toISOString().split('T')[0]
    const endDate = new Date(dateEnd).toISOString().split('T')[0]
    sql += ` AND course_start >= '${startDate}' AND course_end <='${endDate}'`
  }
  // 判斷類型
  if (cate) {
    sql += ` AND type LIKE '%${cate}%'`
  }

  const result = await db.query(sql)
  res.send(result[0])
})
export default router
