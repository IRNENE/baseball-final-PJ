import express from 'express'
const router = express.Router()

// 檢查空物件, 轉換req.params為數字
import { getIdParam } from '#db-helpers/db-tool.js'

// sql
import db from '#configs/mysql.js'

// GET - 揪團列表頁
router.get('/', async (req, res) => {
  const { city_name = '', sort = 'jt.id', order = 'DESC' } = req.query

  // 建立資料庫搜尋條件(where從句用)，每個條件用陣列存放，串接時用join(' AND ')
  const conditions = []

  //篩選台灣縣市
  conditions[0] = city_name ? `city_name = '${city_name}'` : ''

  // 去除空字串
  const conditionsValues = conditions.filter((v) => v)

  const where =
    conditionsValues.length > 0
      ? `WHERE` + conditionsValues.map((v) => `(${v})`).join(`AND`)
      : ''

  // 排序用
  const orderby = `ORDER BY ${sort} ${order}`

  // 分頁用
  // page預設為1，perpage預設為12
  // const perpageNow = Number(perpage) || 3
  // const pageNow = Number(page) || 1
  // const limit = perpageNow
  // // page=1 offset=0; page=2 offset= perpage * 1; ...
  // const offset = (pageNow - 1) * perpageNow

  // 最終組合的sql語法(得到揪團所有資訊)
  const sqlJoins = `SELECT *
  FROM join_team AS jt
  ${where}
  ${orderby} 
  `

  // 最終組合的sql語法(得到揪團裡成員的資料)
  const sqlMember = `SELECT jtu.join_team_id AS join_team_id, user.id AS user_id, user.name AS user_name, user.photo AS user_photo, user.phone AS user_phone, jtu.is_host AS is_host, jtu.id AS join_team_user_id
   FROM join_team AS jt
   INNER JOIN join_team_user AS jtu
   ON jt.id = jtu.join_team_id
   INNER JOIN user
   ON jtu.user_id = user.id
   ${where}
   ORDER BY jtu.id`

  // 最終組合的sql語法(計算團數用)
  const sqlCount = `SELECT COUNT(*) AS count
  FROM join_team 
  ${where}`

  // 顯示sql語法
  // console.log(sqlJoins)
  // console.log(sqlCount)
  // console.log(sqlMember)

  // 使用mysql2+sql的查詢方式
  const [joins] = await db.query(sqlJoins)
  const [rows2] = await db.query(sqlCount)
  const [members] = await db.query(sqlMember)

  // 將揪團成員資料加入進揪團資料
  const mergedData = {}

  // 將每個揪團作為鍵名儲存在 mergedData 中，並將members 設置為空陣列
  joins.forEach((join) => {
    mergedData[join.id] = { ...join, members: [] }
  })

  // 將每個參與成員的資訊添加到對應揪團的 members 陣列裡
  members.forEach((member) => {
    mergedData[member.join_team_id].members.push({
      join_team_user_id: member.join_team_user_id,
      user_id: member.user_id,
      user_name: member.user_name,
      is_host: member.is_host,
      user_photo: member.user_photo,
      user_phone: member.user_phone,
    })
  })

  // 將 mergedData 轉換成最終結果
  const result = Object.values(mergedData)
  // 按照 id 的逆序排列結果
  result.sort((a, b) => b.id - a.id)
  // console.log(result)

  // 回傳總筆數
  const total = rows2[0].count

  // 計算頁數
  // const pageCount = Math.ceil(total / Number(perpage)) || 0

  // ------ 需要沒有 WHERE 條件的所有揪團資料 (即將成團輪播需要)-------
  // 最終組合的sql語法(得到揪團所有資訊)
  const sqlOrigin = `SELECT *
  FROM join_team AS jt
  ${orderby}`

  // 最終組合的sql語法(得到揪團裡成員的資料)
  const sqlOriginMember = `SELECT jtu.join_team_id AS join_team_id, user.id AS user_id, user.name AS user_name, user.photo AS user_photo, user.phone AS user_phone, jtu.is_host AS is_host, jtu.id AS join_team_user_id
   FROM join_team AS jt
   INNER JOIN join_team_user AS jtu
   ON jt.id = jtu.join_team_id
   INNER JOIN user
   ON jtu.user_id = user.id`

  // 使用mysql2+sql的查詢方式
  const [origins] = await db.query(sqlOrigin)
  const [originMember] = await db.query(sqlOriginMember)

  // 將揪團成員資料加入進揪團資料
  const originMergedData = {}

  // 將每個揪團作為鍵名儲存在 mergedData 中，並將members 設置為空陣列
  origins.forEach((join) => {
    originMergedData[join.id] = { ...join, members: [] }
  })

  // 將每個參與成員的資訊添加到對應揪團的 members 陣列裡
  originMember.forEach((member) => {
    originMergedData[member.join_team_id].members.push({
      join_team_user_id: member.join_team_user_id,
      user_id: member.user_id,
      user_name: member.user_name,
      is_host: member.is_host,
      user_photo: member.user_photo,
      user_phone: member.user_phone,
    })
  })

  // 將 mergedData 轉換成最終結果
  const originResult = Object.values(originMergedData)
  // 按照 id 的逆序排列結果
  originResult.sort((a, b) => b.id - a.id)

  // 回傳JSON
  return res.json({
    status: 'success',
    data: {
      total,
      joins: result,
      origins: originResult,
    },
  })
})

// GET - 得到單筆資料
router.get('/:id', async (req, res) => {
  try {
    // 轉為數字
    const id = getIdParam(req)

    // 得到揪團所有資訊
    const sqlJoins = `SELECT *
    FROM join_team AS jt
    WHERE id = ?`

    const [joins] = await db.query(sqlJoins, [id])
    // console.log(joins)

    // 得到揪團裡成員的資料
    const sqlMember = `SELECT jtu.join_team_id AS join_team_id, user.id AS user_id, user.name AS user_name, user.photo AS user_photo, user.phone AS user_phone, jtu.is_host AS is_host, jtu.id AS join_team_user_id
    FROM join_team AS jt
    INNER JOIN join_team_user AS jtu
    ON jt.id = jtu.join_team_id
    INNER JOIN user
    ON jtu.user_id = user.id
    WHERE jt.id = ${id}`
    const [members] = await db.query(sqlMember)

    // 將揪團成員資料加入進揪團資料
    const mergedData = {}

    // 將每個揪團作為鍵名儲存在 mergedData 中，並將members 設置為空陣列
    joins.forEach((join) => {
      mergedData[join.id] = { ...join, members: [] }
    })

    // 將每個參與成員的資訊添加到對應揪團的 members 陣列裡
    members.forEach((member) => {
      mergedData[member.join_team_id].members.push({
        join_team_user_id: member.join_team_user_id,
        user_id: member.user_id,
        user_name: member.user_name,
        is_host: member.is_host,
        user_photo: member.user_photo,
        user_phone: member.user_phone,
      })
    })

    // 將 mergedData 轉換成最終結果
    const result = Object.values(mergedData)
    console.log(result)

    return res.json({ status: 'success', data: { result } })
  } catch (error) {
    return res.status(500).json({ status: error, message: '伺服器錯誤' })
  }
})

// POST - 新增開團
router.post('/', async (req, res) => {
  const {
    userId,
    name,
    address_city,
    address_district,
    place,
    activity_date,
    deadline_date,
    total_member,
    description,
    joinImg,
  } = req.body

  let join_img = joinImg
  if (join_img == '') {
    join_img = 'joinDefaultImg.jpg'
  }

  try {
    // 新增開團資料
    const sqlNewTeam = `
      INSERT INTO join_team 
      (name, total_member, activity_date, deadline_date, city_name, district_name, place_name, description, image, created_at, valid) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)
    `
    const [result] = await db.query(sqlNewTeam, [
      name,
      total_member,
      activity_date,
      deadline_date,
      address_city,
      address_district,
      place,
      description,
      join_img,
      1,
    ])

    // 獲取新插入的 ID
    const newId = result.insertId

    // 在關聯的 join_team_user 資料表中添加資料
    const sqlNewUser = `
      INSERT INTO join_team_user 
      (join_team_id, user_id, is_host) 
      VALUES (?, ?, ?)
    `
    await db.query(sqlNewUser, [newId, userId, 1])

    res.status(201).json({ status: 'success', message: '開團成功' })
  } catch (error) {
    console.error('開團失敗:', error)
    res.status(500).json({ status: 'error', message: '開團失敗' })
  }
})

router.post('/upload-joinImg', async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: '沒有檔案上傳',
      })
    } else {
      let joinImg = req.files.joinImg
      joinImg.mv('./uploads/' + joinImg.name)
      res.status(201).json({ status: 'success', message: '圖片上傳成功' })
    }
  } catch (error) {
    res.status(500).json(error)
  }
})

// POST - 參加揪團 (加入 - 參加的成員資料)
router.post('/joinIn', async (req, res) => {
  try {
    const { join_team_id, user_id } = req.body
    // 先判斷按參加的會員是否已在這個團裡
    const checkSql = `SELECT * FROM join_team_user WHERE join_team_id = ? AND user_id = ?`
    const [checkRows] = await db.query(checkSql, [join_team_id, user_id])
    if (checkRows.length > 0) {
      return res.status(400).json({ status: 'error', message: '已參加過此團' })
    }

    // 如果沒參加過這個團，加入此會員資料
    const sql = `INSERT INTO join_team_user
  (join_team_id, user_id, is_host)
  VALUES(?, ?, ?)`

    const [result] = await db.query(sql, [join_team_id, user_id, 0])
    res.status(201).json({ status: 'success', message: '加入揪團成功' })
  } catch (error) {
    res
      .status(500)
      .json({ status: 'error', message: '加入揪團失敗，請稍後重試' })
  }
})

// DELETE - 退出揪團 (刪除 - 參加的成員資料)
router.delete('/teamUser/:id', async (req, res) => {
  try {
    const { id } = req.params
    const deleteSql = `DELETE FROM join_team_user WHERE id = ?`
    await db.query(deleteSql, [id])
    res.status(201).json({ status: 'success', message: '退出揪團成功' })
  } catch (error) {
    res
      .status(500)
      .json({ status: 'error', message: '退出揪團失敗，請稍後重試' })
  }
})

export default router
