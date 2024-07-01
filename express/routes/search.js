import express from 'express'
const router = express.Router()
import db from '##/configs/mysql.js'

router.get('/', async (req, res) => {
  const { searchType, searchContent } = req.query
  if (searchType === '所有') {
    const [data1] = await db.query(
      `SELECT * FROM article WHERE title LIKE '%${searchContent}%'`
    )
    const [data2] = await db.query(
      `SELECT * FROM course WHERE name LIKE '%${searchContent}%'`
    )
    const [data3] = await db.query(
      `SELECT * FROM product WHERE name LIKE '%${searchContent}%'`
    )
    const [data4] = await db.query(
      `SELECT * FROM rent WHERE name LIKE '%${searchContent}%'`
    )
    res.send({
      status: 'success',
      data: { article: data1, course: data2, product: data3, rent: data4 },
    })
  }
  // if (searchType === '專欄') {
  //   const [data] = await db.query(
  //     `SELECT * FROM article WHERE title LIKE '%${searchContent}%'`
  //   )
  //   res.send({
  //     status: 'success',
  //     data: { article: data, course: [], product: [], rent: [] },
  //   })
  // }
  // if (searchType === '課程') {
  //   const [data] = await db.query(
  //     `SELECT * FROM course WHERE name LIKE '%${searchContent}%'`
  //   )
  //   res.send({
  //     status: 'success',
  //     data: { article: [], course: data, product: [], rent: [] },
  //   })
  // }
  // if (searchType === '商城') {
  //   const [data] = await db.query(
  //     `SELECT * FROM product WHERE name LIKE '%${searchContent}%'`
  //   )
  //   res.send({
  //     status: 'success',
  //     data: { article: [], course: [], product: data, rent: [] },
  //   })
  // }
  // if (searchType === '租借') {
  //   const [data] = await db.query(
  //     `SELECT * FROM rent WHERE name LIKE '%${searchContent}%'`
  //   )
  //   res.send({
  //     status: 'success',
  //     data: { article: [], course: [], product: [], rent: data },
  //   })
  // }
})

export default router
