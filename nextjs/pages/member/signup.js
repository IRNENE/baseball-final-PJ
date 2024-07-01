import React, { useState } from 'react'
import styles from '@/styles/member/signup.module.css'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import District from '@/components/district/district'
import Swal from 'sweetalert2'

export default function Signup() {
  // input date使用(不可大於當日日期)
  const today = new Date().toISOString().split('T')[0]
  // 切換密碼可見使用
  const [showPassword, setShowPassword] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)
  const [eye, setEye] = useState(<FaEyeSlash />)
  const [eye2, setEye2] = useState(<FaEyeSlash />)
  const [user, setUser] = useState({
    name: '',
    phone: '',
    account: '',
    password: '',
    password2: '',
    birthday: '',
    gender: 'Male',
    address: '',
    address_city: '',
    address_district: '',
  })
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    account: '',
    password: '',
    password2: '',
    birthday: '',
  })

  const handleShowPassword = () => {
    showPassword == false ? setShowPassword(true) : setShowPassword(false)
    showPassword == false ? setEye(<FaEye />) : setEye(<FaEyeSlash />)
  }
  const handleShowPassword2 = () => {
    showPassword2 == false ? setShowPassword2(true) : setShowPassword2(false)
    showPassword2 == false ? setEye2(<FaEye />) : setEye2(<FaEyeSlash />)
  }

  const handleFieldChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  //驗證email格式
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return regex.test(email)
  }
  //驗證密碼不可包含特殊字符
  const passwordRegex = /^[a-zA-Z0-9]*$/

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {
      name: '',
      phone: '',
      account: '',
      password: '',
      password2: '',
      birthday: '',
    }

    let hasErrors = false
    if (!user.name) {
      newErrors.name = '請輸入姓名'
      hasErrors = true
    }
    if (!user.phone) {
      newErrors.phone = '請輸入電話號碼'
      hasErrors = true
    } else if (!Number(user.phone)) {
      newErrors.phone = '請輸入正確的電話號碼'
      hasErrors = true
    }
    if (!user.account) {
      newErrors.account = '請輸入Email'
      hasErrors = true
    } else if (!validateEmail(user.account)) {
      newErrors.account = '請輸入正確的Email'
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
    if (!user.birthday) {
      newErrors.birthday = '請輸入生日'
      hasErrors = true
    }

    setErrors(newErrors)
    if (hasErrors) {
      return
    }
    const res = await fetch('http://localhost:3005/api/member', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
    const data = await res.json()
    if (data.status === 'success') {
      Swal.fire({
        // position: "top-end",
        icon: 'success',
        title: '成功註冊帳號，即將回到登入頁面',
        showConfirmButton: false,
        timer: 3000,
      })
      setTimeout(() => {
        window.location.href = 'http://localhost:3000/member/login'
      }, 1000)
    }
    if (data.error) {
      Swal.fire({
        icon: 'error',
        title: '註冊失敗',
        text: 'Email已存在，請嘗試登入或選擇其他Email',
      })
    }
  }

  return (
    <>
      <div className={`container ${styles.signup}`}>
        <div className={`m-auto ${styles.wrap}`}>
          <h3 className="text-center mb-3 mt-5">加入會員</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                placeholder=""
                name="name"
                value={user.name}
                onChange={handleFieldChange}
              />
              <label htmlFor="floatingInput">*姓名</label>
            </div>
            <h6 className="error text-primary">{errors.name}</h6>
            <div className="form-floating mb-3">
              <input
                type="tel"
                className="form-control"
                placeholder=""
                name="phone"
                value={user.phone}
                onChange={handleFieldChange}
              />
              <label htmlFor="floatingInput">*電話號碼</label>
            </div>
            <h6 className="error text-primary">{errors.phone}</h6>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                placeholder=""
                name="account"
                value={user.account}
                onChange={handleFieldChange}
              />
              <label htmlFor="floatingInput">
                *Email <span>(將作為登入帳號)</span>
              </label>
            </div>
            <h6 className="error text-primary">{errors.account}</h6>
            <div className="form-floating mb-3 position-relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder=""
                name="password"
                value={user.password}
                onChange={handleFieldChange}
                maxLength="15"
              />
              <label htmlFor="floatingInput">*密碼</label>
              <button
                className={`position-absolute ${styles['bt-eye']}`}
                type="button"
                onClick={handleShowPassword}
              >
                {eye}
              </button>
            </div>
            <h6 className="error text-primary">{errors.password}</h6>
            <div className="form-floating mb-3 position-relative">
              <input
                type={showPassword2 ? 'text' : 'password'}
                className="form-control"
                placeholder=""
                name="password2"
                value={user.password2}
                onChange={handleFieldChange}
                maxLength="15"
              />
              <label htmlFor="floatingInput">*確認密碼 </label>
              <button
                className={`position-absolute ${styles['bt-eye']}`}
                type="button"
                onClick={handleShowPassword2}
              >
                {eye2}
              </button>
            </div>
            <h6 className="error text-primary mb-3">{errors.password2}</h6>
            <label htmlFor="gender">*性別</label>
            <br />
            <input
              type="radio"
              name="gender"
              value="Male"
              className="me-2"
              defaultChecked
              onClick={handleFieldChange}
            />
            <label htmlFor="gender" className="me-3 mb-2">
              男
            </label>
            <input
              type="radio"
              name="gender"
              value="Female"
              className="me-2"
              onClick={handleFieldChange}
            />
            <label htmlFor="gender" className="me-3 mb-2">
              女
            </label>
            <input
              type="radio"
              name="gender"
              value="Other"
              className="me-2"
              onClick={handleFieldChange}
            />
            <label htmlFor="gender" className="me-3 mb-2">
              其他
            </label>
            <div className="form-floating mb-3">
              <input
                type="date"
                className="form-control"
                placeholder=""
                name="birthday"
                max={today}
                onChange={handleFieldChange}
              />
              <label htmlFor="floatingInput">*生日</label>
            </div>
            <h6 className="error text-primary mb-5">{errors.birthday}</h6>

            <h6>地址可於註冊後填寫，將用於配送地址。</h6>

            <District onChange={handleFieldChange} />
            <div className="form-floating mb-5">
              <input
                type="text"
                className="form-control"
                name="address"
                placeholder=""
                onChange={handleFieldChange}
              />
              <label htmlFor="floatingInput">請輸入詳細地址</label>
            </div>
            <div className="d-flex mb-3">
              <button className={`m-auto bg-black text-light ${styles.bt}`}>
                <h5>送出</h5>
              </button>
            </div>
            <div className="text-center mb-5">
              <p>
                註冊及同意<span className="text-primary">服務條款</span>及
                <span className="text-primary">隱私權政策</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
