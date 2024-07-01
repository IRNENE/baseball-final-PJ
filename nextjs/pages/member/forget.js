import React, { useEffect, useState } from 'react'
import styles from '@/styles/member/login.module.css'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import useInterval from '@/hooks/use-interval'
import Swal from 'sweetalert2'
import Link from 'next/link'

export default function ForgetPassword() {
  const [showPassword, setShowPassword] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)
  const [eye, setEye] = useState(<FaEyeSlash />)
  const [eye2, setEye2] = useState(<FaEyeSlash />)

  const [disable, setDisable] = useState(false)
  const [count, setCount] = useState(60)
  const [delay, setDelay] = useState(null)
  const [showReset, setShowReset] = useState(false)

  const [user, setUser] = useState({
    account: '',
    token: '',
    password: '',
    password2: '',
  })
  const [errors, setErrors] = useState({
    account: '',
    token: '',
    password: '',
    password2: '',
  })
  const passwordRegex = /^[a-zA-Z0-9]*$/

  const handleFieldChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  const handleShowPassword = () => {
    showPassword == false ? setShowPassword(true) : setShowPassword(false)
    showPassword == false ? setEye(<FaEye />) : setEye(<FaEyeSlash />)
  }
  const handleShowPassword2 = () => {
    showPassword2 == false ? setShowPassword2(true) : setShowPassword2(false)
    showPassword2 == false ? setEye2(<FaEye />) : setEye2(<FaEyeSlash />)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {
      account: '',
      token: '',
      password: '',
      password2: '',
    }
    let hasErrors = false
    if (!user.account) {
      newErrors.account = '請輸入電子信箱'
      hasErrors = true
    }
    if (!user.token) {
      newErrors.token = '請輸入驗證碼'
      hasErrors = true
    }
    if (!user.password) {
      newErrors.password = '請輸入密碼'
      hasErrors = true
    } else if (user.password.length < 6) {
      newErrors.password = '密碼長度需介於6~15個字間'
      hasErrors = true
    } else if (!passwordRegex.test(user.password)) {
      newErrors.password = '密碼不可包含特殊字元'
      hasErrors = true
    }
    if (!user.password2) {
      newErrors.password2 = '請輸入密碼'
      hasErrors = true
    }
    if (user.password !== user.password2) {
      newErrors.password2 = '密碼輸入不一致，請重新確認'
      hasErrors = true
    }
    setErrors(newErrors)
    if (hasErrors) {
      return
    }
    handleReset()
  }

  useInterval(() => {
    setCount(count - 1)
  }, delay)
  useEffect(() => {
    if (count <= 0) {
      setDelay(null)
      setDisable(false)
    }
  }, [count])

  const handleOtpToken = async () => {
    const { account } = user
    if (delay !== null) {
      Swal.fire({
        icon: 'error',
        title: '驗證碼寄送失敗',
        text: `${data.message}`,
      })
      return
    }
    const res = await fetch(`http://localhost:3005/api/reset-password/otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ account }),
    })
    const data = await res.json()

    if (data.status === 'success') {
      Swal.fire({
        // position: "top-end",
        icon: 'success',
        title: '已寄送驗證碼至信箱',
        showConfirmButton: false,
        timer: 2000,
      })
      setCount(60)
      setDelay(1000)
      setDisable(true)
      setShowReset(true)
    } else {
      Swal.fire({
        icon: 'error',
        title: '驗證碼寄送失敗',
        text: `${data.message}`,
      })
    }
  }

  const handleReset = async () => {
    const { account, token, password } = user
    const res = await fetch(`http://localhost:3005/api/reset-password/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ account, token, password }),
    })
    const data = await res.json()
    if (data.status === 'success') {
      Swal.fire({
        // position: "top-end",
        icon: 'success',
        title: '密碼已完成修改',
        showConfirmButton: false,
        timer: 2000,
      })
      setTimeout(() => {
        window.location.href = 'http://localhost:3000/member/login'
      }, 1000)
    } else {
      Swal.fire({
        icon: 'error',
        title: '密碼修改失敗',
        text: '請重新確認驗證碼及密碼',
      })
    }
  }

  return (
    <>
      <div className={`container login ${styles.login}`}>
        <div className={`m-auto ${styles.wrap}`}>
          <div className="title">
            <h3 className="text-center mt-5 mb-4">重設密碼</h3>
          </div>
          <form action="" className="text-center" onSubmit={handleSubmit}>
            <div className="form-floating">
              <input
                type="email"
                className="form-control"
                placeholder=""
                name="account"
                onChange={handleFieldChange}
                disabled={showReset}
              />
              <label htmlFor="floatingInput">請輸入電子信箱</label>
            </div>
            <br />
            <button
              className={`text-light bg-dark py-2 px-4 ${
                disable ? styles['verify-disabled'] : styles['verify']
              }`}
              type="button"
              onClick={handleOtpToken}
              disabled={disable}
            >
              <h6>{delay ? count + '秒後可再次取得驗證碼' : '取得驗證碼'}</h6>
            </button>
            {showReset && (
              <>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder=""
                    name="token"
                    onChange={handleFieldChange}
                  />
                  <label htmlFor="floatingInput">電子郵件驗證碼</label>
                </div>
                <h6 className="error text-primary text-start">
                  {errors.token}
                </h6>
                <br />
                <div className="form-floating mb-3 position-relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder=""
                    name="password"
                    onChange={handleFieldChange}
                  />
                  <label htmlFor="floatingInput">新密碼</label>
                  <button
                    className={`position-absolute ${styles['bt-eye']}`}
                    type="button"
                    onClick={handleShowPassword}
                  >
                    {eye}
                  </button>
                </div>
                <h6 className="error text-primary text-start">
                  {errors.password}
                </h6>
                <br />
                <div className="form-floating mb-3 position-relative">
                  <input
                    type={showPassword2 ? 'text' : 'password'}
                    className="form-control"
                    placeholder=""
                    name="password2"
                    onChange={handleFieldChange}
                  />
                  <label htmlFor="floatingInput">確認新密碼</label>
                  <button
                    className={`position-absolute ${styles['bt-eye']}`}
                    type="button"
                    onClick={handleShowPassword2}
                  >
                    {eye2}
                  </button>
                </div>
                <h6 className="error text-primary text-start">
                  {errors.password2}
                </h6>
                <br />
                <button
                  className={`py-2 mb-5 text-light bg-black ${styles.log}`}
                  // onClick={handleReset}
                >
                  <h3>修改密碼</h3>
                </button>
              </>
            )}
          </form>
          {!showReset && (
            <>
              <p className="text-center my-5">
                沒有棒球好玩家帳號?{' '}
                <Link href="/member/signup" className="text-primary">
                  立即註冊
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  )
}
