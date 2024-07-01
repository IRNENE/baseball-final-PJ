import express from 'express'
const router = express.Router()
import db from '##/configs/mysql.js'

router.get('/article', async (req, res) => {
  const [data] = await db.query(
    `SELECT * FROM article ORDER BY RAND() LIMIT 12`
  )
  return res.json({
    status: 'success',
    data: data,
  })
})

router.get('/otherArticle', async (req, res) => {
  try {
    const [data] = await db.query(`SELECT * FROM article ORDER BY RAND() LIMIT 4`)
    return res.status(200).json({ status: 'success', data: data })
  } catch (error) {
    return res.status(500).json({ status: error, message: '伺服器錯誤' })
  }
})

router.get('/:type', async (req, res) => {
  const [data] = await db.query(
    `SELECT * FROM article WHERE type = '${req.params.type}' `
  )
  return res.json({
    status: 'success',
    data: data,
  })
})
router.get('/detail/:id', async (req, res) => {
  const [data] = await db.query(
    `SELECT * FROM article WHERE id = '${req.params.id}'`
  )
  return res.json({
    status: 'success',
    data: data[0],
  })
})

// 以下為簡易將文章已句點當分隔，並加上<p>標籤
// router.get('/modify/set', async (req, res) => {
//   let x = 5
//   while (x <= 92) {
//     const [data] = await db.query(
//       `SELECT description FROM article WHERE id='${x}'`
//     )
//     const des = data[0].description
//     const des2 = des.split('。')
//     const arr = []
//     for (let i of des2) {
//       let ans = `<p>${i}。</p>`
//       arr.push(ans)
//     }
//     const finalData = arr.join('')
//     const update = await db.query(
//       `UPDATE article SET description = '${finalData}' WHERE id = '${x}'`
//     )
//     x++
//     console.log(x)
//   }
// })

export default router
