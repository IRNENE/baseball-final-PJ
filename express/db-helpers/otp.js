// 資料庫查詢處理函式
import db from '##/configs/mysql.js'
import { generateToken } from '#configs/otp.js'
import md5 from 'md5'

// 判斷token是否到期, true代表到期
// const hasExpired = (expTimestamp) => {
//   return Date.now() > expTimestamp
// }

// 判斷是否可以重設token, true代表可以重設
const shouldReset = (expTimestamp, exp, limit = 60) => {
  const createdTimestamp = expTimestamp - exp * 60 * 1000
  return Date.now() - createdTimestamp > limit * 1000
}

// exp = 是 30 分到期,  limit = 60 是 60秒內不產生新的token
const createOtp = async (account, exp = 30, limit = 60) => {
  const [user] = await db.query(`SELECT * FROM user WHERE account='${account}'`)

  if (user.length === 0) {
    console.log('ERROR - 使用者帳號不存在'.bgRed)
    return {}
  }
  // 檢查otp是否已經存在
  const [foundOtp] = await db.query(
    `SELECT * FROM otp WHERE email='${account}'`
  )
  // 找到記錄，因為在60s(秒)內限制，所以"不能"產生新的otp token
  if (
    foundOtp.length !== 0 &&
    !shouldReset(foundOtp[0].exp_timestamp, exp, limit)
  ) {
    console.log('ERROR - 60s(秒)內要求重新產生otp'.bgRed)
    return {}
  }

  // 找到記錄，超過60s(秒)內限制，所以可以產生新的otp token
  if (
    foundOtp.length !== 0 &&
    shouldReset(foundOtp[0].exp_timestamp, exp, limit)
  ) {
    // 以使用者輸入的Email作為secret產生otp token
    const token = generateToken(account)

    // 到期時間 預設 exp = 30 分鐘到期
    const exp_timestamp = Date.now() + exp * 60 * 1000

    // 修改Otp
    await db.query(
      `UPDATE otp SET token='${token}', exp_timestamp='${exp_timestamp}' WHERE email='${account}'`
    )

    return {
      ...foundOtp,
      exp_timestamp,
      token,
    }
  }

  // 以下為"沒找到otp記錄"
  // 以使用者輸入的Email作為secret產生otp token
  const token = generateToken(account)

  // 到期時間 預設 exp = 30 分鐘到期
  const exp_timestamp = Date.now() + exp * 60 * 1000

  // 建立新記錄
  const [otp] = await db.query(
    `INSERT INTO otp (user_id, email, token, exp_timestamp) VALUES ('${user[0].id}', '${account}', '${token}', '${exp_timestamp}')`
  )
  const [otpData] = await db.query(
    `SELECT * FROM otp WHERE id = ${otp.insertId}`
  )

  return otpData[0]
}

// 更新密碼
const updatePassword = async (account, token, password) => {
  const md5Password = md5(password)
  // 檢查otp是否已經存在
  const [foundOtp] = await db.query(
    `SELECT * FROM otp WHERE email='${account}' AND token='${token}'`
  )

  // 沒找到回傳false
  if (foundOtp.length === 0) {
    console.log('ERROR - OTP Token資料不存在'.bgRed)
    return false
  }

  // 計算目前時間比對是否超過，到期的timestamp
  if (Date.now() > foundOtp.exp_timestamp) {
    console.log('ERROR - OTP Token已到期'.bgRed)
    return false
  }

  // 修改密碼
  await db.query(
    `UPDATE user SET password = '${md5Password}' WHERE id = '${foundOtp[0].user_id}'`
  )

  // 移除otp記錄
  await db.query(`DELETE FROM otp WHERE id = '${foundOtp[0].id}'`)

  return true
}

export { createOtp, updatePassword }
