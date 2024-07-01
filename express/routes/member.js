import express from 'express'
const router = express.Router()
import db from '##/configs/mysql.js'
import md5 from 'md5'
import jwt from 'jsonwebtoken'
import 'dotenv/config.js'
import authenticate from '##/middlewares/authenticate.js'
import { getIdParam } from '##/db-helpers/db-tool.js'
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

router.get('/', (req, res) => {
  res.send('hello world')
})

// 註冊-路由
router.post('/', async (req, res) => {
  try {
    const {
      name,
      account,
      phone,
      password,
      gender,
      birthday,
      address,
      address_city,
      address_district,
    } = req.body
    //新增時間
    const now = new Date()
    const created = now.toISOString().replace('T', ' ')
    const md5Password = md5(password)
    //判斷是否已有帳號
    let sqlTest = `SELECT * FROM user WHERE account = ? `
    const [row] = await db.query(sqlTest, [account])
    if (row.length > 0) {
      return res.json({ error: 'email已存在，請嘗試登入或選擇其他email' })
    }
    let sql = `INSERT INTO user (account,password,birthday,created,phone,address,address_city,address_district,gender,name,valid) VALUES ('${account}','${md5Password}','${birthday}','${created}','${phone}','${address}','${address_city}','${address_district}','${gender}','${name}','1')`
    await db.query(sql)
    return res.json({
      status: 'success',
      message: '註冊成功',
    })
  } catch (error) {
    return res.status(500).json({ status: 'error', message: '伺服器錯誤' })
  }
})

// 登入-路由
router.post('/login', async (req, res) => {
  try {
    const loginUser = req.body
    if (!loginUser.account || !loginUser.password) {
      return res.json({
        status: 'fail',
        data: '請輸入帳號及密碼',
      })
    }
    const md5Password = md5(loginUser.password)
    const user = await db.query(
      `SELECT * FROM user WHERE account = '${loginUser.account}'`
    )
    if (user[0].length === 0) {
      return res.json({
        status: 'fail',
        data: '查無此帳號，請重試或註冊帳號',
      })
    }
    if (user[0][0].password !== md5Password) {
      return res.json({
        status: 'fail',
        data: '密碼錯誤',
      })
    }

    const returnUser = {
      id: user[0][0].id,
      username: user[0][0].name,
      google_uid: user[0][0].google_uid,
    }

    const accessToken = jwt.sign(returnUser, accessTokenSecret, {
      expiresIn: '1d',
    })

    res.cookie('accessToken', accessToken, { httpOnly: true })
    res.json({
      status: 'success',
      data: { accessToken },
    })

    // 測試回傳data
    // return res.json({
    //   status: 'success',
    //   data: user[0][0],
    // })
  } catch (error) {
    return res.status(500).json({ status: 'error', message: '伺服器錯誤' })
  }
})

// 登出-路由
router.post('/logout', authenticate, (req, res) => {
  try {
    res.clearCookie('accessToken', { httpOnly: true })
    res.json({ status: 'success', data: '登出成功' })
  } catch (error) {
    return res.status(500).json({ status: 'error', message: '伺服器錯誤' })
  }
})

// 檢查登入狀態-路由
router.get('/check', authenticate, async (req, res) => {
  try {
    const user = await db.query(
      `SELECT * FROM user WHERE id = '${req.user.id}'`
    )
    delete user[0][0].password
    return res.json({
      status: 'success',
      data: user[0][0],
    })
  } catch (error) {
    return res.status(500).json({ status: 'error', message: '伺服器錯誤' })
  }
})

// 取得單筆會員資料
router.get('/:id', authenticate, async (req, res) => {
  try {
    const id = getIdParam(req)

    if (req.user.id !== id) {
      return res.json({
        status: 'error',
        message: '會員資料取得失敗',
      })
    }
    const user = await db.query(
      `SELECT * FROM user WHERE id = '${req.user.id}'`
    )
    delete user[0][0].password
    return res.json({
      status: 'success',
      data: user[0][0],
    })
  } catch (error) {
    return res.status(500).json({ status: 'error', message: '伺服器錯誤' })
  }
})

// 取得指定會員資料
router.get('/user/:id', async (req, res) => {
  try {
    const [user] = await db.query(
      `SELECT * FROM user WHERE id = '${req.params.id}'`
    )
    delete user[0].password
    return res.json({
      status: 'success',
      data: user[0],
    })
  } catch (error) {
    return res.status(500).json({ status: 'error', message: '伺服器錯誤' })
  }
})

// 修改會員資料
router.patch('/user/:id', async (req, res) => {
  try {
    const {
      name,
      phone,
      birthday,
      gender,
      address,
      address_city,
      address_district,
    } = req.body
    const user = await db.query(
      `UPDATE user SET name = '${name}',phone = '${phone}',birthday = '${birthday}',gender = '${gender}',address = '${address}',address_city = '${address_city}',address_district = '${address_district}' WHERE id = '${req.params.id}'`
    )
    return res.json({
      status: 'success',
      data: user[0],
    })
  } catch (error) {
    return res.status(500).json({ status: 'error', message: '伺服器錯誤' })
  }
})

// 修改密碼
router.patch('/reset-password/:id', async (req, res) => {
  try {
    const { password1 } = req.body
    const md5Password = md5(password1)
    const [user] = await db.query(
      `SELECT password FROM user WHERE id = '${req.params.id}'`
    )
    const oldPassword = user[0].password
    if (md5Password === oldPassword) {
      return res.status(400).json({ status: 'error', message: '新舊密碼相同' })
    }

    const updateUser = await db.query(
      `UPDATE user SET password = '${md5Password}' WHERE id = '${req.params.id}'`
    )
    return res.json({
      status: 'success',
      data: updateUser[0],
    })
  } catch (error) {
    return res.status(500).json({ status: 'error', message: '伺服器錯誤' })
  }
})

// 上傳會員頭像
router.post('/upload-avatar/:id', async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: 'No file uploaded',
      })
    } else {
      let avatar = req.files.avatar
      avatar.mv('./uploads/' + avatar.name)
      const data = await db.query(
        `UPDATE user SET photo='${avatar.name}' WHERE id = '${req.params.id}'`
      )
      res.json({
        status: true,
        message: 'File is uploaded',
        data: {
          name: avatar.name,
          mimetype: avatar.mimetype,
          size: avatar.size,
        },
      })
    }
  } catch (error) {
    return res.status(500).json({ status: 'error', message: '伺服器錯誤' })
  }
})

export default router
