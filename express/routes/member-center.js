import express from 'express'
const router = express.Router()
import db from '##/configs/mysql.js'
import 'dotenv/config.js'

router.get('/wishlist/:id', async (req, res) => {
  const userId = req.params.id
  const sortOrder = req.query.sortOrder
  let sql = `
  SELECT favorite.*, user.name , product.name ,product.price, product.image_url
  FROM favorite 
  JOIN user  
  ON user.id = favorite.user_id 
  JOIN product
  ON favorite.product_id = product.id
  WHERE user.id = ? AND class_id = 'P'
  `

  // 根據 sortOrder 動態設置排序方式
  if (sortOrder) {
    switch (sortOrder) {
      case '1':
        sql += ' ORDER BY favorite.product_id ASC'
        break
      case '2':
        sql += ' ORDER BY favorite.product_id DESC'
        break
    }
  }

  const [result] = await db.query(sql, [userId])
  res.json(result)
})

router.get('/wishlist-rent/:id', async (req, res) => {
  const userId = req.params.id
  const sortOrder = req.query.sortOrder
  let sql = `
  SELECT favorite.*, user.name , rent.name ,rent.price, rent.img
  FROM favorite 
  JOIN user  
  ON user.id = favorite.user_id 
  JOIN rent
  ON favorite.product_id = rent.id
  WHERE user.id = ? AND favorite.class_id = 'R'
  `

  // 根據 sortOrder 動態設置排序方式
  if (sortOrder) {
    switch (sortOrder) {
      case '1':
        sql += ' ORDER BY favorite.product_id ASC'
        break
      case '2':
        sql += ' ORDER BY favorite.product_id DESC'
        break
    }
  }
  const [result] = await db.query(sql, [userId])
  res.json(result)
})

router.get('/wishlist-course/:id', async (req, res) => {
  const userId = req.params.id
  const sortOrder = req.query.sortOrder
  let sql = `
  SELECT favorite.*, user.name , course.name ,course.price, course.photo, course.type, course.description, course.course_start, course.course_end , teacher.name AS t_name
  FROM favorite 
  JOIN user  
  ON user.id = favorite.user_id 
  JOIN course
  ON favorite.product_id = course.id
  JOIN teacher
  ON course.teacher_id = teacher.id
  WHERE user.id = ? AND class_id = 'C'
  `
  // 根據 sortOrder 動態設置排序方式
  if (sortOrder) {
    switch (sortOrder) {
      case '1':
        sql += ' ORDER BY course.course_start ASC'
        break
      case '2':
        sql += ' ORDER BY course.course_start DESC'
        break
    }
  }

  const [result] = await db.query(sql, [userId])
  res.json(result)
})

router.get('/order-history/:id', async (req, res) => {
  const userId = req.params.id
  const sortOrder = req.query.sortOrder
  let sql = `
  SELECT \`order\`.*
  FROM \`order\`
  WHERE \`order\`.user_id = ? 
  `
  // 根據 sortOrder 動態設置排序方式
  if (sortOrder) {
    switch (sortOrder) {
      case '1':
        sql += ' ORDER BY `order`.order_time ASC'
        break
      case '2':
        sql += ' ORDER BY `order`.order_time DESC'
        break
    }
  }
  const [result] = await db.query(sql, [userId])
  res.json(result)
})

router.get('/order-history/detail/:id', async (req, res) => {
  const orderId = req.params.id
  let sql = `
  SELECT \`order\`.*, order_detail.* , product.name AS p_name , rent.name AS r_name, course.name AS c_name , rent.price AS r_price, teacher.name AS t_name , course.description , coupon.name AS cp_name
  FROM \`order\`
  JOIN order_detail
  ON order_detail.order_id = \`order\`.id
  LEFT JOIN product
  ON product.id = order_detail.product_id
  LEFT JOIN rent
  ON rent.id = order_detail.rent_id
  LEFT JOIN course
  ON course.id = order_detail.course_id
  LEFT JOIN teacher
  ON teacher.id = course.teacher_id
  LEFT JOIN coupon
  ON \`order\`.coupon_code = coupon.coding
  WHERE order_detail.order_id = '${orderId}' 
  `
  const [result] = await db.query(sql)
  res.json(result)
})

router.get('/myjoin-open/:id', async (req, res) => {
  const userId = req.params.id
  const sortType = req.query.sortType

  let sqlJoins = `
  SELECT join_team_user.*, user.name AS userName, user.photo, join_team.* 
  FROM join_team_user 
  JOIN user  
  ON user.id = join_team_user.user_id 
  JOIN join_team
  ON join_team_user.join_team_id = join_team.id
  WHERE user.id = ? 
  `

  const sqlMember = `SELECT jtu.join_team_id AS join_team_id, user.name AS user_name, user.photo AS user_photo, jtu.is_host AS is_host
  FROM join_team AS jt
  JOIN join_team_user AS jtu
  ON jt.id = jtu.join_team_id
  JOIN user
  ON jtu.user_id = user.id 
  `

  const [joins] = await db.query(sqlJoins, [userId])
  const [members] = await db.query(sqlMember)

  // 將揪團成員資料加入進揪團資料
  const mergedData = {}

  // 將每個揪團作為鍵名儲存在 mergedData 中，並將members 設置為空陣列
  joins.forEach((join) => {
    mergedData[join.id] = { ...join, members: [] }
  })

  // 將每個參與成員的資訊添加到對應揪團的 members 陣列裡
  members.forEach((member) => {
    const teamId = member.join_team_id
    if (!mergedData[teamId]) {
      // 如果 mergedData 中不存在該揪團的資料，則創建一個新的物件
      mergedData[teamId] = { members: [] }
    }
    mergedData[teamId].members.push({
      user_name: member.user_name,
      is_host: member.is_host,
      user_photo: member.user_photo,
    })
  })
  // 將 mergedData 轉換成陣列
  const result = Object.values(mergedData)
  console.log(result)

  return res.json({
    status: 'success',
    data: {
      joins: result,
    },
  })
})

export default router
