import express from 'express'
const router = express.Router()
import db from '##/configs/mysql.js'


router.get('/', async (req, res) => {
    const sql = `SELECT * FROM teacher`
  
    const result = await db.query(sql)
    // console.log(result)
    res.send(result[0])
  })

  export default router