import express from 'express'
const router = express.Router()
// 資料庫使用
import db from '##/configs/mysql.js'

router.get('/', async (req, res) => {
  const {
    page = 1, // number,  用於 OFFSET =  (Number(page) - 1) * Number(perpage),
    perpage = 20, // number, 用於 LIMIT
    id = '',
    name = '',
    brand_id = '', // 商品品牌名字（即brand_id）
    colors = '',
    class_id = '',
    other_id = '', // 添加 other_id 查询参数
    sort = 'id', //價錢
    order = 'asc', //排序
    price_gte = 0, // number, 對應 price 欄位, `price >= 1500`
    price_lte = 10000,
  } = req.query

  const conditions = []

  // 名稱  LIKE is not case sensitive(英文大小寫無關)
  conditions[0] = name ? `name LIKE '%${name}%'` : ''

  //商品的id
  conditions[1] = id ? `id = '${id}'` : ''

  // 價格大於，price_gte 使用 `price >= 5000`
  conditions[2] = price_gte ? `price >= ${price_gte}` : ''

  // 價格小於，price_lte 使用 `price <= 10000`
  conditions[3] = price_lte ? `price <= ${price_lte}` : ''

  // 商品品牌名字（即brand_id）
  conditions[4] = brand_id ? `brand_id = '${brand_id}'` : ''

  // 修改顏色篩選條件
  conditions[5] = colors ? `colors = '${colors}'` : ''

  conditions[6] = class_id ? `class_id = '${class_id}'` : ''

  // 新增other_id筛选条件
  conditions[7] = other_id ? `other_id LIKE '%${other_id}%'` : ''

  // 去除空字串
  const conditionsValues = conditions.filter((v) => v)

  // 各條件需要先包含在`()`中，因各自內查詢是OR, 與其它的是AND
  const where =
    conditionsValues.length > 0
      ? `WHERE ` + conditionsValues.map((v) => `( ${v} )`).join(` AND `)
      : ''

  // 排序用
  let orderby = `ORDER BY ${sort} ${order}`
  if (sort === 'created_at') {
    orderby = `ORDER BY created_at ${order}`
  }

  // page預設為1，perpage預設為3
  const perpageNow = Number(perpage) || 5
  const pageNow = Number(page) || 1
  const limit = perpageNow
  // page=1 offset=0; page=2 offset= perpage * 1; ...
  const offset = (pageNow - 1) * perpageNow

  // 最終組合的sql語法
  const sqlProducts = `SELECT *, other_id FROM rent ${where} ${orderby} LIMIT ${limit} OFFSET ${offset}`
  console.log(sqlProducts)
  // 最終組合的sql語法(計數用)

  const sqlCount = `SELECT COUNT(*) AS count FROM rent ${where}`

  console.log(sqlProducts)
  console.log(sqlCount)

  try {
    const products = await db.query(sqlProducts) // 执行产品列表查询
    const totalCount = await db.query(sqlCount) // 执行产品总数查询
    const otherIds = products[0].map((product) => product.other_id)
    res.json({
      status: 'success',
      data: {
        total: totalCount[0][0].count,
        products: products[0],
        pageCount: Math.ceil(totalCount[0][0].count / perpageNow), // 新增總頁數
        currentPage: pageNow, // 新增當前頁碼
        otherIds: otherIds, // 将 other_id 数组传递给前端
      },
    })
  } catch (error) {
    console.error('Error querying database:', error)
    res.status(500).json({ error: 'Database error' })
  }
})

router.get('/:id', async (req, res) => {
  const id = req.params.id // 從請求的路由參數中獲取 id
  const sql = 'SELECT * FROM rent WHERE id = ?' // 使用 SQL 查詢選擇相應的租屆數據

  try {
    const result = await db.query(sql, [id]) // 執行 SQL 查詢，並將 id 傳遞為參數

    if (result.length === 0) {
      res.status(404).json({ error: 'Rent not found' }) // 如果找不到相應的租金數據，返回 404 錯誤
    } else {
      res.json(result[0]) // 如果找到相應的租金數據，將其作為 JSON 格式的回應返回
    }
  } catch (error) {
    console.error('Error querying database:', error)
    res.status(500).json({ error: 'Database error' })
  }
})

export default router
