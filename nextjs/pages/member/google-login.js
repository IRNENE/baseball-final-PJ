import useFirebase from '@/hooks/use-firebase'
import { initUserData, useAuth } from '@/hooks/use-auth'
import { useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'

const parseJwt = (token) => {
  const base64Payload = token.split('.')[1]
  const payload = Buffer.from(base64Payload, 'base64')
  return JSON.parse(payload.toString())
}

export default function GoogleLoginRedirect() {
  const { logoutFirebase, loginGoogleRedirect, initApp } = useFirebase()
  const { auth, setAuth } = useAuth()

  // 監聽firebase的google登入狀態
  useEffect(() => {
    initApp(callbackGoogleLoginRedirect)
  }, [])

  // google登入後，要向伺服器登入
  const callbackGoogleLoginRedirect = async (providerData) => {
    // console.log(providerData)
    // 已登入，不做動作
    if (auth.isAuth) return

    // 登入
    const googleLogin = async (providerData = {}) => {
      const res = await fetch(`http://localhost:3005/api/google-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 允許攜帶cookie
        credentials: 'include',
        body: JSON.stringify(providerData),
      })
      const resData = await res.json()

      if (resData.status === 'success') {
        const jwtUser = parseJwt(resData.data.accessToken)

        const res1 = await fetch(
          `http://localhost:3005/api/member/${jwtUser.id}`,
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            // 允許攜帶cookie
            credentials: 'include',
          }
        )
        const res1Data = await res1.json()

        if (res1Data.status === 'success') {
          const dbUser = res1Data.data
          const userData = { ...initUserData }

          for (const key in userData) {
            if (Object.hasOwn(dbUser, key)) {
              userData[key] = dbUser[key] || ''
            }
            // console.log(userData)
          }

          setAuth({
            isAuth: true,
            userData,
          })
          toast.success('已成功登入')
        } else {
          toast.error('登入後無法得到會員資料')
        }
      } else {
        toast.error('登入失敗')
      }
    }
    googleLogin(providerData)
  }

  const handleLogout = async () => {
    logoutFirebase()
    const res = await fetch(`http://localhost:3005/api/member/logout`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
    const data = await res.json()
    if (data.status === 'success') {
      toast.success('已成功登出帳號')

      setAuth({
        isAuth: false,
        userData: initUserData,
      })
    } else {
      toast.error('登出失敗')
    }
  }
  return (
    <>
      <h1>Google Login重定向測試頁</h1>
      <p>會員狀態:{auth.isAuth ? '已登入' : '未登入'}</p>
      <button onClick={() => loginGoogleRedirect()}>Google登入</button>
      <br />
      <button onClick={handleLogout}>登出</button>
      <br />
      <hr />
      {/* 土司訊息視窗用 */}
      <Toaster />
    </>
  )
}
