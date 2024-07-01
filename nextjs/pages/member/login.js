import React, { useState, useEffect } from 'react'
import useFirebase from '@/hooks/use-firebase'
import styles from '@/styles/member/login.module.css'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { FaLine } from 'react-icons/fa'
import Link from 'next/link'
import Swal from 'sweetalert2'
import { initUserData, useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/router'

const parseJwt = (token) => {
  const base64Payload = token.split('.')[1]
  const payload = Buffer.from(base64Payload, 'base64')
  return JSON.parse(payload.toString())
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [eye, setEye] = useState(<FaEyeSlash />)
  const router = useRouter()
  const [user, setUser] = useState({
    account: '',
    password: '',
  })
  const [errors, setErrors] = useState({
    account: '',
    password: '',
  })
  const handleShowPassword = () => {
    showPassword == false ? setShowPassword(true) : setShowPassword(false)
    showPassword == false ? setEye(<FaEye />) : setEye(<FaEyeSlash />)
  }
  const handleFieldChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return regex.test(email)
  }
  const { auth, setAuth } = useAuth()
  const { isAuth, userData } = auth

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {
      account: '',
      password: '',
    }
    let hasErrors = false
    if (!user.account) {
      newErrors.account = '請輸入電子信箱'
      hasErrors = true
    } else if (!validateEmail(user.account)) {
      newErrors.account = '請輸入正確的Email格式'
      hasErrors = true
    }
    if (!user.password) {
      newErrors.password = '請輸入密碼'
      hasErrors = true
    } else if (user.password.length < 6) {
      newErrors.password = '密碼長度應介於6~15個字間'
      hasErrors = true
    }
    setErrors(newErrors)
    if (hasErrors) {
      return
    }

    handleLogin()
  }
  const handleLogin = async () => {
    const res = await fetch('http://localhost:3005/api/member/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      // 允許攜帶cookie
      credentials: 'include',
      body: JSON.stringify(user),
    })
    const data = await res.json()
    if (data.status === 'fail') {
      Swal.fire({
        icon: 'error',
        title: '登入失敗',
        text: '請重新嘗試，或註冊帳號',
      })
    }
    if (data.status === 'success') {
      const jwtUser = parseJwt(data.data.accessToken)
      // console.log(jwtUser)

      const getUserInfo = await fetch(
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
      const userInfo = await getUserInfo.json()
      if (userInfo.status === 'success') {
        const dbUser = userInfo.data
        const userData = { ...initUserData }
        // console.log(dbUser)
        for (const key in userData) {
          if (Object.hasOwn(dbUser, key)) {
            userData[key] = dbUser[key] || ''
          }
          // console.log(userData)
        }
      }

      setAuth({
        isAuth: true,
        userData,
      })
      Swal.fire({
        // position: "top-end",
        icon: 'success',
        title: '成功登入，頁面即將跳轉',
        showConfirmButton: false,
        timer: 2000,
      })
      setTimeout(() => {
        window.location.href = 'http://localhost:3000/member/profile'
      }, 1000)
    }
  }

  // google登入用
  const { loginGoogleRedirect, initApp } = useFirebase()

  // 監聽firebase的google登入狀態
  // useEffect(() => {
  //   initApp(callbackGoogleLoginRedirect)
  // }, [])
  const handleGoogleLogin = () => {
    initApp(callbackGoogleLoginRedirect)
    // loginGoogleRedirect()
  }

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
          Swal.fire({
            // position: "top-end",
            icon: 'success',
            title: '成功登入，頁面即將跳轉',
            showConfirmButton: false,
            timer: 2000,
          })
          setTimeout(() => {
            window.location.href = 'http://localhost:3000/member/profile'
          }, 1000)
        } else {
          Swal.fire({
            icon: 'error',
            title: '登入失敗',
            text: '無法取得會員資料',
          })
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: '登入失敗',
          text: '請重新嘗試，或註冊帳號',
        })
      }
    }
    googleLogin(providerData)
  }

  // Line登入用
  // 處理line登入後，要向伺服器進行登入動作
  const callbackLineLogin = async (query) => {
    const qs = new URLSearchParams({
      ...query,
    }).toString()
    const res = await fetch(
      `http://localhost:3005/api/line-login/callback?${qs}`,
      { credentials: 'include' }
    ).then((res) => res.json())
    // console.log(res)

    if (res.status === 'success') {
      const jwtUser = parseJwt(res.data.accessToken)
      const res1 = await fetch(
        `http://localhost:3005/api/member/${jwtUser.id}`,
        {
          // headers: {
          //   Accept: 'application/json',
          //   'Content-Type': 'application/json',
          // },
          // 允許攜帶cookie
          credentials: 'include',
        }
      ).then((res) => res.json())

      if (res1.status === 'success') {
        const dbUser = res1.data
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
        Swal.fire({
          // position: "top-end",
          icon: 'success',
          title: '成功登入，頁面即將跳轉',
          showConfirmButton: false,
          timer: 2000,
        })
        setTimeout(() => {
          window.location.href = 'http://localhost:3000/member/profile'
        }, 1000)
      } else {
        Swal.fire({
          icon: 'error',
          title: '登入失敗',
          text: '無法取得會員資料',
        })
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: '登入失敗',
        text: '請重新嘗試，或註冊帳號',
      })
    }
  }

  // 處理line登入
  const goLineLogin = async () => {
    if (auth.isAuth) return
    const data = await fetch(`http://localhost:3005/api/line-login/login`, {
      credentials: 'include',
      // }).then((res) => {
      //   res.json()
      // console.log(res.data.url)
      // if (res.data.url) {
      //   window.location.href = res.data.url
      // }
    }).then((res) => res.json())
    if (data) {
      window.location.href = data.url
    }
    // console.log(data)
  }

  useEffect(() => {
    if (router.isReady) {
      if (!router.query.code) return

      callbackLineLogin(router.query)
    }
  }, [router.isReady, router.query])

  // const handleLogout = async () => {
  //   const res = await fetch(`http://localhost:3005/api/member/logout`, {
  //     method: 'POST',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     credentials: 'include',
  //   })
  //   const data = await res.json()
  //   if (data.status === 'success') {
  //     toast.success('已成功登出帳號')
  //   }
  // }
  return (
    <>
      <div className={`container login ${styles.login}`}>
        <div className={`m-auto ${styles.wrap}`}>
          <div className="title">
            <h3 className="text-center mt-5 mb-2">歡迎登入</h3>
            <p className="text-center">
              沒有棒球好玩家帳號?{' '}
              <Link href="/member/signup" className="text-primary">
                立即註冊
              </Link>
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                placeholder=""
                name="account"
                onChange={handleFieldChange}
              />
              <label htmlFor="floatingInput">電子信箱</label>
            </div>
            <h6 className="error text-primary">{errors.account}</h6>
            <br />
            <div className="form-floating mb-3 position-relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder=""
                name="password"
                onChange={handleFieldChange}
                maxLength="15"
              />
              <label htmlFor="floatingInput">密碼</label>
              <button
                className={`position-absolute ${styles['bt-eye']}`}
                type="button"
                onClick={handleShowPassword}
              >
                {eye}
              </button>
            </div>
            <h6 className="error text-primary">{errors.password}</h6>
            <br />
            <div className="d-flex justify-content-between align-items-center">
              <div></div>
              <Link href="/member/forget" className="text-primary">
                <h6>忘記密碼?</h6>
              </Link>
            </div>
            <br />
            <button className={`py-2 mb-4 text-light bg-black ${styles.log}`}>
              <h3>登入</h3>
            </button>
          </form>
          <h5 className="mb-3 text-center">———或使用以下帳號快速登入———</h5>
          <div className="d-flex justify-content-center">
            <button
              className={`text-center mb-5 d-flex align-items-center me-5 ${styles.google}`}
              onClick={handleGoogleLogin}
            >
              <FcGoogle />
              <h6 className="ms-1">Google</h6>
            </button>
            <button
              className={`text-center mb-5 d-flex align-items-center ${styles.google}`}
              onClick={() => goLineLogin()}
            >
              <FaLine className={styles.line} />
              <h6 className="ms-1">Line</h6>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
