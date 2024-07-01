import express from 'express'
const router = express.Router()

// 一般sql
import db from '#configs/mysql.js'

router.get('/', async function (req, res) {
  const {
    page = 1,
    perpage = 10,
    name_like = '',
    brand_ids = '',
    sort = 'price',
    order = 'asc',
    price_gte = 5000,
    price_lte = 100000,
  } = req.query

  const conditions = []

  conditions[0] = name_like ? `name LIKE '%${name_like}%'` : ''
  conditions[1] = brand_ids ? `brand_id IN (${brand_ids})` : ''
  conditions[2] = price_gte ? `price >= ${price_gte}` : ''
  conditions[3] = price_lte ? `price <= ${price_lte}` : ''

  const conditionsValues = conditions.filter((v) => v)

  const where =
    conditionsValues.length > 0
      ? `WHERE ` + conditionsValues.map((v) => `( ${v} )`).join(` AND `)
      : ''

  const orderby = `ORDER BY ${sort} ${order}`

  const perpageNow = Number(perpage) || 3
  const pageNow = Number(page) || 1
  const limit = perpageNow
  const offset = (pageNow - 1) * perpageNow

  const sqlProducts = `SELECT * FROM rent ${where} ${orderby} LIMIT ${limit} OFFSET ${offset}`
  const sqlCount = `SELECT COUNT(*) AS count FROM rent ${where}`

  console.log(sqlProducts)
  console.log(sqlCount)

  const [rows, fields] = await db.query(sqlProducts)
  const [rows2] = await db.query(sqlCount)
  const total = rows2[0].count
  const pageCount = Math.ceil(total / Number(perpage)) || 0

  return res.json({
    status: 'success',
    data: {
      total,
      pageCount,
      products: rows,
    },
  })
})

router.get('/:id', async function (req, res) {
  const id = req.params.id

  const sql = 'SELECT * FROM rent WHERE id = ?'

  try {
    const [rows] = await db.query(sql, [id])

    if (rows.length === 0) {
      res.status(404).json({ error: 'Product not found' })
    } else {
      res.json(rows[0])
    }
  } catch (error) {
    console.error('Error querying database:', error)
    res.status(500).json({ error: 'Database error' })
  }
})

export default router
