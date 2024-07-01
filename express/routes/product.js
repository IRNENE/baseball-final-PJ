import express from 'express'
const router = express.Router()
import db from '##/configs/mysql.js'

// router.get('/', async (req, res) => {
//   try {
//     // 接收查询参数
//     const { sortOption } = req.query

//     // 构建 SQL 查询
//     let sql = `SELECT * FROM product`

//     // 添加排序条件
//     if (sortOption) {
//       switch (sortOption) {
//         case '0':
//           sql += ` ORDER BY id ASC`
//           break
//         case '1': // 价格排序：高至低
//           sql += ` ORDER BY price DESC`
//           break
//         case '2': // 价格排序：低至高
//           sql += ` ORDER BY price ASC`
//           break
//         case '3': // 按照创建时间从新到旧排序
//           sql += ` ORDER BY created_at DESC`
//           break
//         case '4': // 按照创建时间从旧到新排序
//           sql += ` ORDER BY created_at ASC`
//           break
//         // 其他排序选项可以在这里添加
//       }
//     }

//     // 执行 SQL 查询
//     const result = await db.query(sql)

//     // 返回查询结果
//     res.json({ success: true, products: result })
//   } catch (error) {
//     // 返回错误信息
//     res.status(500).json({ success: false, message: error.message })
//   }
// })

// router.get('/', async (req, res) => {
//   const sql = `SELECT * FROM product`

//   const result = await db.query(sql)
//   // console.log(result)
//   res.send(result[0])
// })

router.get('/', async (req, res) => {
  try {
    // 接收查询参数
    const { price, class2, color, other, brand, search, sortOption } = req.query

    // 构建 SQL 查询
    let sql = `SELECT * FROM product WHERE 1=1` // 默认查询条件（即无条件）

    // 添加价格筛选条件
    if (price) {
      switch (price) {
        case 'below500':
          sql += ` AND (product.price * 0.8) < 500`
          break
        case '500to1000':
          sql += ` AND (product.price * 0.8) >= 500 AND (product.price * 0.8) < 1000`
          break
        case '1000to2000':
          sql += ` AND (product.price * 0.8) >= 1000 AND (product.price * 0.8) < 2000`
          break
        case '2000to3000':
          sql += ` AND (product.price * 0.8) >= 2000 AND (product.price * 0.8) < 3000`
          break
        case 'above3000':
          sql += ` AND (product.price * 0.8) >= 3000`
          break
        // 其他价格筛选选项可以在这里添加
      }
    }

    // 添加分类筛选条件
    if (class2) {
      sql += ` AND product.class = '${class2}'`
    }

    // 添加其他筛选条件
    if (other) {
      sql += ` AND product.other LIKE '%${other}%'` // 根据其他筛选条件添加相应的 SQL 逻辑
    }

    // 添加品牌筛选条件
    if (brand) {
      sql += ` AND product.brand = '${brand}'`
    }
    if (color) {
      sql += ` AND product.color = '${color}'`
    }

    // 添加搜索条件
    if (search) {
      const encodedKeyword = db.escape(`%${search}%`)
      sql += ` AND product.name LIKE ${encodedKeyword}`
    }

    // 添加排序条件
    if (sortOption) {
      switch (sortOption) {
        case '0':
          sql += ` ORDER BY product.id ASC`
          break
        case '1': // 按照课程创建时间从旧到新排序
          sql += ` ORDER BY product.created_at ASC`
          break
        case '2': // 按照课程创建时间从新到旧排序
          sql += ` ORDER BY product.created_at DESC`
          break
        case '3': // 价格排序：低至高
          sql += ` ORDER BY product.price ASC`
          break
        case '4': // 价格排序：高至低
          sql += ` ORDER BY product.price DESC`
          break
        // 其他排序选项可以在这里添加
      }
    }

    // 處理如果沒找到資料

    // 执行 SQL 查询
    // const products = await db.query(sql)
    // 执行查询
    const result = await db.query(sql, [
      price,
      class2,
      other,
      brand,
      search,
      sortOption,
    ])

    // 返回结果
    res.send(result[0])
  } catch (error) {
    console.error('Error fetching product data:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

router.get('/search/:name', async (req, res) => {
  const searchName = req.params.name
  let sql = `SELECT * FROM product WHERE name LIKE '%${searchName}%'`

  try {
    const result = await db.query(sql)
    res.send(result[0])
  } catch (error) {
    console.error('Error querying database:', error)
    res.status(500).send('Error querying database')
  }
})

router.get('/:Id', async (req, res) => {
  const id = req.params.Id
  const sql = `SELECT * FROM product WHERE product.id = ${id}`

  try {
    const result = await db.query(sql)
    res.send(result[0])
  } catch (error) {
    console.error('Error querying database:', error)
    res.status(500).send('Error querying database')
  }
})

router.get('/by-type/:productClass', async (req, res) => {
  const productClass = decodeURIComponent(req.params.productClass)
  // 根据产品类型处理相应的逻辑，比如从数据库中获取相关产品信息并返回
  const sql = `SELECT * FROM product WHERE product.class = ? ORDER BY RAND() LIMIT 8`

  try {
    // 将 type 参数作为数组传递
    const [result] = await db.query(sql, [productClass])

    // 如果查询结果不为空，则返回结果
    if (result && result.length > 0) {
      res.json(result)
    } else {
      // 如果查询结果为空，则返回 HTTP 404 状态码
      res.status(404).send('No courses found for the given type')
    }
  } catch (error) {
    console.error('Error querying database:', error)
    res.status(500).send('Error querying database')
  }
})
//以下不確定功能
router.get('/product-color/:productId/:color', async (req, res) => {
  const { productId, color } = req.params

  // 检查颜色参数是否有效
  const validColors = ['red', 'green', 'blue', 'yellow'] // 允许的颜色列表
  if (!validColors.includes(color)) {
    return res.status(400).send('Invalid color parameter')
  }

  try {
    // 根据产品ID查询相应的颜色图片文件名
    const sql = `SELECT * FROM product WHERE id = ?`
    const result = await db.query(sql, [color, productId])

    if (result.length > 0 && result[0][color]) {
      res.json({ imageName: result[0][color] })
    } else {
      res.status(404).send('Image not found for the given product and color')
    }
  } catch (error) {
    console.error('Error querying database:', error)
    res.status(500).send('Database query failed')
  }
})
//获取指定产品ID和图片文件名对应的颜色信息

router.get(
  '/product-color-by-filename/:productId/:filename',
  async (req, res) => {
    const { productId, filename } = req.params

    try {
      // 定义允许的颜色字段映射到数据库列名
      const colorMap = {
        red: 'red',
        green: 'green',
        blue: 'blue',
        yellow: 'yellow',
      }

      // 通过文件名识别颜色
      const colorKey = Object.keys(colorMap).find((key) =>
        filename.includes(key)
      )

      // 检查识别出的颜色是否有效
      if (!colorKey) {
        return res.status(400).send('No valid color found in filename')
      }

      // 构建查询
      const sql = `SELECT * FROM product WHERE id = ?`
      const result = await db.query(sql, [colorMap[colorKey], productId])

      if (result.length > 0 && result[0][colorMap[colorKey]]) {
        res.json({ color: colorKey, imageName: result[0][colorMap[colorKey]] })
      } else {
        res
          .status(404)
          .send('No image found for the given product ID and color')
      }
    } catch (error) {
      console.error('Error querying database:', error)
      res.status(500).send('Database query failed')
    }
  }
)
// // 獲取收藏商品
// router.get('/wishlist', async (req, res) => {
//   try {
//     // 從資料庫中獲取已收藏的商品列表
//     const userId = req.body.id
//     const sql = `SELECT * FROM favorite WHERE user_id ='${userId}'`
//     const [result] = await db.query(sql)
//     console.log(result)
//     res.send(result)
//   } catch (error) {
//     console.error('讀取錯誤', error)
//     res.status(500).send('讀取錯誤')
//   }
// })

// // 將商品添加到收藏列表
// router.post('/wishlist/:productId', async (req, res) => {
//   const productId = req.params.productId
//   const userId = req.user.id

//   try {
//     // 檢查商品是否已經在收藏列表中
//     const checkSql = `SELECT * FROM favorite WHERE user_id = ${userId} AND product_id = ${productId}`
//     const existingFavorite = await db.query(checkSql)
//     if (existingFavorite.length > 0) {
//       return res.status(400).send('此商品已收藏')
//     }

//     // 將商品添加到收藏列表
//     const insertSql = `INSERT INTO favorite (user_id, product_id, class_id) VALUES (${userId}, ${productId}), P`
//     await db.query(insertSql)

//     res.status(201).send('收藏成功')
//   } catch (error) {
//     console.error('Error querying database:', error)
//     res.status(500).send('Error querying database')
//   }
// })

// // 從收藏列表中移除商品
// router.delete('/wishlist/:productId', authenticate, async (req, res) => {
//   const productId = req.params.productId
//   const userId = req.user.id

//   try {
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
