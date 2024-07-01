import express from 'express'
const router = express.Router()
import transporter from '##/configs/mail.js'
import 'dotenv/config.js'
import db from '##/configs/mysql.js'
import { createOtp, updatePassword } from '##/db-helpers/otp.js'

const mailText = (otpToken) => `棒球好玩家會員您好:
以下為重設密碼所需之驗證碼，
請輸入以下6位驗證碼於"電子郵件驗證碼"欄位，
驗證碼時效為30分鐘，逾時需再次發送驗證碼請求:

${otpToken}

棒球好玩家 網站
敬上
`
// 發送驗證用
router.post('/otp', async (req, res, next) => {
  const { account } = req.body

  if (!account) return res.json({ status: 'error', message: '缺少必要資料' })
  // 建立otp，建立失敗回傳{}
  const otp = await createOtp(account)
  if (!otp.token) {
    return res.json({ status: 'error', message: 'Email錯誤或期間內重複要求' })
  }

  // 寄送email
  const mailOptions = {
    // 這裡要改寄送人名稱，email在.env檔中代入
    from: `"support"<${process.env.SMTP_TO_EMAIL}>`,
    to: account,
    subject: '重設密碼要求的電子郵件驗証碼',
    text: mailText(otp.token),
  }
  transporter.sendMail(mailOptions, (err, mailRes) => {
    if (err) {
      return res.json({ status: 'error', message: '發送電子郵件失敗' })
    } else {
      return res.json({ status: 'success', data: null })
    }
  })
})

// 重設密碼
router.post('/reset', async (req, res) => {
  const { account, token, password } = req.body
  if (!token || !account || !password) {
    return res.json({ status: 'error', message: '缺少必要資料' })
  }
  const result = await updatePassword(account, token, password)
  if (!result) {
    return res.json({ status: 'error', message: '修改密碼失敗' })
  }
  return res.json({ status: 'success', data: null })
})

export default router
