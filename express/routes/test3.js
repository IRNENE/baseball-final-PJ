import express from 'express'
import fs from 'fs'
import path from 'path'
const router = express.Router()

import db from '##/configs/mysql.js'
router.get('/', async (req, res) => {
  const result = await db.query(`SELECT * FROM rent WHERE id BETWEEN 1 AND 20`)
  return res.json(result[0])
})
// 使用檔名來取得圖片
router.get('/img/assets/img/rent_product_img/:filename', (req, res) => {
  // 從路由參數中取得圖片檔案名稱
  const filename = req.params.filename
  // 實際的圖片資料夾路徑
  const imagesFolder = 'C:/xampp/htdocs/baseball/assets/img/rent_product_img'
  // 將路徑和檔名組合起來
  const imagePath = path.join(imagesFolder, filename)

  // 檢查檔案是否存在
  if (fs.existsSync(imagePath)) {
    // 讀取檔案
    const image = fs.readFileSync(imagePath)
    // 告訴前端，返回的檔案是img
    res.writeHead(200, { 'Content-Type': 'image/jpeg' })
    res.end(image, 'binary')
  } else {
    res.status(404).json({ error: 'Image not found' })
  }
})

export default router
