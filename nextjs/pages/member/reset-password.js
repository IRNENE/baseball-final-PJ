import React, { useState, useEffect } from 'react'
import styles from '@/styles/style_lai.module.css'
import Sidebar from '@/components/sidebar/sidebar'
import { initUserData, useAuth } from '@/hooks/use-auth'
import District from '@/components/district/district'
import Link from 'next/link'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import Swal from 'sweetalert2'

export default function ResetPassword() {
  const { auth, setAuth } = useAuth()
  const { isAuth, userData } = auth
  // 顯示密碼用
  const [showPassword, setShowPassword] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)
  const [eye, setEye] = useState(<FaEyeSlash />)
  const [eye2, setEye2] = useState(<FaEyeSlash />)
  const handleShowPassword = () => {
    showPassword == false ? setShowPassword(true) : setShowPassword(false)
    showPassword == false ? setEye(<FaEye />) : setEye(<FaEyeSlash />)
  }
  const handleShowPassword2 = () => {
    showPassword2 == false ? setShowPassword2(true) : setShowPassword2(false)
    showPassword2 == false ? setEye2(<FaEye />) : setEye2(<FaEyeSlash />)
  }

  const [user, setUser] = useState({
    password1: '',
    password2: '',
  })
  const [errors, setErrors] = useState({
    password1: '',
    password2: '',
  })
  const handleFieldChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }
  //驗證密碼不可包含特殊字符
  const passwordRegex = /^[a-zA-Z0-9]*$/
  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {
      password1: '',
      password2: '',
    }
    let hasErrors = false
    if (!user.password1) {
      newErrors.password1 = '請輸入密碼'
      hasErrors = true
    } else if (user.password1.length < 6) {
      newErrors.password1 = '密碼長度需介於6~15個字間'
      hasErrors = true
    } else if (!passwordRegex.test(user.password1)) {
      newErrors.password1 = '密碼不可包含特殊字元'
      hasErrors = true
    }
    if (!user.password2) {
      newErrors.password2 = '請輸入新密碼'
      hasErrors = true
    }
    if (user.password1 !== user.password2) {
      newErrors.password2 = '密碼輸入不一致，請重新確認'
      hasErrors = true
    }
    if (hasErrors) {
      setErrors(newErrors)
      return
    }
    const res = await fetch(
      `http://localhost:3005/api/member/reset-password/${userData.id}`,
      {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      }
    ).then((res) => res.json())
    if (res.status === 'success') {
      Swal.fire({
        // position: "top-end",
        icon: 'success',
        title: '成功修改密碼',
        showConfirmButton: false,
        timer: 2000,
      })
      setTimeout(() => {
        window.location.href = 'http://localhost:3000/member/profile'
      }, 1000)
    }
    if (res.status === 'error') {
      Swal.fire({
        icon: 'error',
        title: '修改密碼失敗',
        text: '新密碼不得與舊密碼相同',
      })
    }
  }
  return (
    <>
      <div className="container">
        <div className="row">
          <div className={styles.boxMargin}>
            <h5>
              會員中心 /
              <a className={styles.noBottom} href="">
                <span className={styles.bread}> 會員資料</span>
              </a>
            </h5>
          </div>
        </div>
        <div className="row">
          <Sidebar />

          <div className={`col-12 col-sm-7 mx-2 mx-sm-0 mt-3 mt-sm-0`}>
            <div className="row  align-items-start">
              <form onSubmit={handleSubmit}>
                <label className="row form-label mb-2" htmlFor="password1">
                  新密碼
                </label>
                <div className="position-relative">
                  <input
                    className="form-control mb-1"
                    type={showPassword ? 'text' : 'password'}
                    name="password1"
                    maxLength="15"
                    onChange={handleFieldChange}
                  />
                  <button
                    type="button"
                    onClick={handleShowPassword}
                    className={`position-absolute ${styles['bt-eye']}`}
                  >
                    {eye}
                  </button>
                  <h6 className="error text-primary">{errors.password1}</h6>
                </div>
                <label className="row form-label mb-2 mt-3" htmlFor="password2">
                  確認新密碼
                </label>
                <div className="position-relative">
                  <input
                    className="form-control mb-1"
                    type={showPassword2 ? 'text' : 'password'}
                    name="password2"
                    maxLength="15"
                    onChange={handleFieldChange}
                  />
                  <button
                    type="button"
                    onClick={handleShowPassword2}
                    className={`position-absolute ${styles['bt-eye']}`}
                  >
                    {eye2}
                  </button>
                  <h6 className="error text-primary">{errors.password2}</h6>
                </div>
                <div className="d-flex justify-content-center justify-content-sm-end ">
                  <button
                    className={`mt-3 mb-5  me-3 text-light bg-primary ${styles.bts}`}
                  >
                    修改
                  </button>
                  <Link href="/member/profile">
                    <button
                      className={`mt-3 mb-5  text-light bg-primary ${styles.bts}`}
                      type="button"
                    >
                      取消
                    </button>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
