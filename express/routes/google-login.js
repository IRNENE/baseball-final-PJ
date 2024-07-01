import express from 'express'
import db from '##/configs/mysql.js'
import jsonwebtoken from 'jsonwebtoken'
import 'dotenv/config.js'

const router = express.Router()
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

router.post('/', async function (req, res, next) {
  if (!req.body.providerId || !req.body.uid) {
    return res.json({ status: 'error', message: '缺少google登入資料' })
  }
  const { displayName, email, uid, photoURL } = req.body
  const google_uid = uid

  // 檢查是否有google_uid
  const [total] = await db.query(
    `SELECT * FROM user WHERE google_uid = '${google_uid}'`
  )

  let returnUser = {
    id: 0,
    username: '',
    google_uid: '',
  }

  if (total.length > 0) {
    const [dbUser] = await db.query(
      `SELECT * FROM user WHERE google_uid = '${google_uid}'`
    )

    returnUser = {
      id: dbUser[0].id,
      username: dbUser[0].name,
      google_uid: dbUser[0].google_uid,
    }
  } else {
    const [newUser] = await db.query(
      `INSERT INTO user (name, email, google_uid, photo) VALUES ('${displayName}','${email}','${google_uid}','${photoURL}')`
    )
    const [newUserData] = await db.query(
      `SELECT * FROM user WHERE id = '${newUser.insertId}'`
    )
    returnUser = {
      id: newUserData[0].id,
      username: newUserData[0].name,
      google_uid: newUserData[0].google_uid,
    }
  }

  const accessToken = jsonwebtoken.sign(returnUser, accessTokenSecret, {
    expiresIn: '3d',
  })

  res.cookie('accessToken', accessToken, { httpOnly: true })

  return res.json({
    status: 'success',
    data: {
      accessToken,
    },
  })
})

export default router
