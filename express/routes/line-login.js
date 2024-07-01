import express from 'express'
const router = express.Router()

import jsonwebtoken from 'jsonwebtoken'
import db from '##/configs/mysql.js'

// line-login模組
import line_login from '#services/line-login.js'

// 存取`.env`設定檔案使用
import 'dotenv/config.js'

// 定義安全的私鑰字串
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
// line 登入使用
const channel_id = process.env.LINE_CHANNEL_ID
const channel_secret = process.env.LINE_CHANNEL_SECRET
const callback_url = process.env.LINE_LOGIN_CALLBACK_URL

const LineLogin = new line_login({
  channel_id,
  channel_secret,
  // react line page callback url
  // 必需要與 LINE Developer 的 "Callback URL" 設定一致
  callback_url,
  scope: 'openid profile',
  prompt: 'consent',
  bot_prompt: 'normal',
})

// ------------ 以下為路由 ------------
// 此為產生登入網址，傳回前端後，要導向line網站進行登入
router.get('/login', LineLogin.authJson())

// 登出機制
router.get('/logout', async function (req, res, next) {
  if (!req.query.line_uid) {
    return res.json({ status: 'error', message: '缺少必要資料' })
  }

  // // 查詢
  const dbUser = await db.query(
    `SELECT * FROM user WHERE line_uid = '${req.query.line_uid}'`
  )
  const line_access_token = dbUser.line_access_token

  // 登出時撤銷 access token
  LineLogin.revoke_access_token(line_access_token)

  // 清除cookie
  res.clearCookie('accessToken', { httpOnly: true })
  // 因登入過程中也用到session，也會產生 SESSION_ID，所以也要清除
  res.clearCookie('SESSION_ID', { httpOnly: true })

  return res.json({ status: 'success', data: null })
})

// 此api路由為line登入後，從前端(react/next)callback的對應路由頁面，即真正登入處理路由
router.get(
  '/callback',
  LineLogin.callback(
    // 登入成功的回調函式 Success callback
    async (req, res, next, token_response) => {
      console.log(token_response)

      const line_uid = token_response.id_token.sub

      // 1. 先查詢資料庫是否有同line_uid的資料
      const [total] = await db.query(
        `SELECT * FROM user WHERE line_uid = '${line_uid}'`
      )

      // 要加到access token中回傳給前端的資料
      let returnUser = {
        id: 0,
        username: '',
        google_uid: '',
        line_uid: '',
      }

      if (total.length > 0) {
        const [dbUser] = await db.query(
          `SELECT * FROM user WHERE line_uid = '${line_uid}'`
        )

        // 回傳給前端的資料
        returnUser = {
          id: dbUser[0].id,
          username: dbUser[0].username,
          google_uid: dbUser[0].google_uid,
          line_uid: dbUser[0].line_uid,
        }
      } else {
        const user = {
          name: token_response.id_token.name,
          email: '',
          line_uid: token_response.id_token.sub,
          line_access_token: token_response.access_token,
          photo_url: token_response.id_token.picture,
        }

        // await insertOne('users', newUser)

        // 新增會員資料
        const [newUser] = await db.query(
          `INSERT INTO user (name,email,line_uid,line_access_token,photo) VALUES ('${user.name}','${user.email}','${user.line_uid}','${user.line_access_token}','${user.photo_url}')`
        )
        const [newUserData] = await db.query(
          `SELECT * FROM user WHERE id = '${newUser.insertId}'`
        )
        // *************************************************
        // 回傳給前端的資料
        returnUser = {
          id: newUserData[0].id,
          username: newUserData[0].name,
          google_uid: newUserData[0].google_uid,
          line_uid: newUserData[0].line_uid,
        }
      }

      // 產生存取令牌(access token)，其中包含會員資料
      const accessToken = jsonwebtoken.sign(returnUser, accessTokenSecret, {
        expiresIn: '3d',
      })

      // 使用httpOnly cookie來讓瀏覽器端儲存access token
      res.cookie('accessToken', accessToken, { httpOnly: true })

      // 傳送access token回應(react可以儲存在state中使用)
      return res.json({
        status: 'success',
        data: {
          accessToken,
        },
      })
    },
    // 登入失敗的回調函式 Failure callback
    (req, res, next, error) => {
      console.log('line login fail')

      return res.json({ status: 'error', message: { error } })
    }
  )
)

export default router
