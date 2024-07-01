import React, { useState, useEffect } from 'react'
import styles from '@/styles/style_lai.module.css'
import Sidebar from '@/components/sidebar/sidebar'
import twCity from '@/data/TwCities.json'
import stylesA from '@/styles/member/login.module.css'
import { FaImage } from 'react-icons/fa'
import { initUserData, useAuth } from '@/hooks/use-auth'
import Link from 'next/link'
import Swal from 'sweetalert2'

export default function Member() {
  const today = new Date().toISOString().split('T')[0]
  // 登入成功會員資料用
  const { auth, setAuth } = useAuth()
  const { isAuth, userData } = auth
  const [user, setUser] = useState(null)
  // 縣市API
  const [selectedCity, setSelectedCity] = useState('')
  const [district, setDistrict] = useState([])
  const handleCityChange = (e) => {
    const city = e.target.value
    setSelectedCity(city)
    twCity.find((v) => {
      if (v.name === city) {
        setDistrict(v.districts)
      }
    })
  }
  // 上傳頭像用
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewURL, setPreviewURL] = useState('')
  useEffect(() => {
    if (userData && userData.photo) {
      if (userData.photo.includes('http')) {
        // setPreviewURL(`http://localhost:3005/uploads/m1.jpg`)
        setPreviewURL(`${userData.photo}`)
      } else {
        setPreviewURL(`http://localhost:3005/uploads/${userData.photo}`)
      }
    }
  }, [userData])
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    console.log(file)
    if (file) {
      // 設定到狀態中
      setSelectedFile(file)
      // 產生預覽網誌
      setPreviewURL(URL.createObjectURL(file))
    } else {
      setSelectedFile(null)
      // 設回預設值
      setPreviewURL('')
    }
  }
  const handleFileUpload = async () => {
    if (!selectedFile) {
      return
    }
    const fd = new FormData()
    const timestamp = Date.now()
    const newFileName = `${timestamp}_${selectedFile.name}`
    // 這裡要對照伺服器中上傳的名稱(req.files.avatar)
    fd.append('avatar', selectedFile, newFileName)
    // 傳送至伺服器
    const res = await fetch(
      `http://localhost:3005/api/member/upload-avatar/${userData.id}`,
      {
        method: 'POST',
        body: fd,
      }
    )
    const data = await res.json()
    setPreviewURL(URL.createObjectURL(selectedFile))
    Swal.fire({
      icon: 'success',
      title: '頭像更改成功',
      showConfirmButton: false,
      timer: 2000,
    })
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }
  // 取得使用者DATA
  const getMember = async (id) => {
    const res = await fetch(`http://localhost:3005/api/member/user/${id}`).then(
      (res) => res.json()
    )
    return res.data
  }
  useEffect(() => {
    const fetchData = async () => {
      const data = await getMember(userData.id)
      setUser({
        name: data?.name || '',
        account: data?.account || '',
        email: data?.email || '',
        phone: data?.phone || '',
        birthday: data?.birthday || '',
        gender: data?.gender || 'Male',
        address: data?.address || '',
        address_city: data?.address_city || '',
        address_district: data?.address_district || '',
      })
    }
    if (userData && userData.id) {
      fetchData()
    }
  }, [userData])

  const handleFieldChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  // 以下兩個useEffect是地區抓會員預設值
  useEffect(() => {
    if (user && user.address_city) {
      setSelectedCity(user.address_city)
      const selectedCityData = twCity.find(
        (city) => city.name === user.address_city
      )
      if (selectedCityData) {
        setDistrict(selectedCityData.districts)
      }
    }
  }, [user])
  // 會員抓預設地區
  useEffect(() => {
    setUser((prevUser) => ({
      ...prevUser,
      address_district: prevUser ? prevUser.address_district : '',
      address_city: prevUser ? prevUser.city : '臺北市',
    }))
  }, [])

  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    birthday: '',
    gender: '',
    address: '',
    address_city: '',
    address_district: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {
      name: '',
      phone: '',
      birthday: '',
      gender: '',
      address: '',
      address_city: '',
      address_district: '',
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
    if (!user.birthday) {
      newErrors.birthday = '請輸入生日'
      hasErrors = true
    }
    if (user.gender == '') {
      newErrors.gender = '請選擇性別'
      hasErrors = true
    }
    if (!user.address) {
      newErrors.address = '請輸入詳細地址'
      hasErrors = true
    } else if (user.address == '' || user.address == 'undefined') {
      newErrors.address = '請輸入詳細地址'
      hasErrors = true
    }
    if (!user.address_city) {
      newErrors.address_city = '請選擇縣市'
      hasErrors = true
    }
    if (!user.address_district) {
      newErrors.address_district = '請選擇地區'
      hasErrors = true
    }
    setErrors(newErrors)
    if (hasErrors) {
      return
    }
    const res = await fetch(
      `http://localhost:3005/api/member/user/${userData.id}`,
      {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      }
    )
    const data = await res.json()
    if (data.status === 'success') {
      Swal.fire({
        icon: 'success',
        title: '資料修改成功',
        showConfirmButton: false,
        timer: 3000,
      })
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }
    if (data.error) {
      Swal.fire({
        icon: 'error',
        title: '修改失敗',
        text: '請確認所需欄位是否有錯誤',
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
          <div
            className={` col-12 col-sm-2 order-sm-last d-flex flex-column align-items-center mt-2`}
          >
            <div className={`${styles.cardPhoto}  mx-auto  mb-3`}>
              <img src={previewURL} />
            </div>
            <label
              className={`${styles.upload} d-flex justify-content-center align-items-center text-light bg-dark`}
            >
              <div className="d-flex">
                <FaImage />
                <h6 className="ms-1">選擇圖</h6>
              </div>
              <h6>片</h6>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="d-none"
              />
            </label>
            <div className="mt-2">
              <button
                className={`text-light bg-primary ${styles.bts} ${styles.selImg}   mb-3 px-3`}
                onClick={handleFileUpload}
              >
                更改頭像
              </button>
              <div className={`content ${styles.noneRWD}`}>
                <p className="text-center">
                  檔案大小:最大1MB
                  <br />
                  檔案限制:jpg,png
                </p>
              </div>
            </div>
          </div>
          <div className={`col-12 col-sm-7 m-sm-0 ms-2`}>
            <div className="row  align-items-start">
              <form onSubmit={handleSubmit}>
                <label className="row form-label mb-2" htmlFor="account">
                  會員帳號/信箱
                </label>
                <input
                  className="form-control mb-3"
                  type="text"
                  name="account"
                  disabled
                  value={
                    userData && userData.google_uid
                      ? 'Google登入會員'
                      : userData && userData.line_uid
                      ? 'Line登入會員'
                      : user
                      ? user.account
                      : ''
                  }
                  onChange={handleFieldChange}
                />
                {!userData?.google_uid && !userData?.line_uid && (
                  <>
                    <label className="row form-label mb-2" htmlFor="password">
                      密碼
                    </label>
                    <Link href="/member/reset-password">
                      <button
                        className={`col-12 mb-3 text-light bg-primary ${styles.btl}`}
                        type="button"
                      >
                        設定新密碼
                      </button>
                    </Link>
                  </>
                )}
                <label className="row form-label mb-2 " htmlFor="name">
                  姓名
                </label>
                <input
                  className="form-control mb-1"
                  type="text"
                  name="name"
                  value={user ? user.name : ''}
                  onChange={handleFieldChange}
                />
                <h6 className="error text-primary mt-2">{errors.name}</h6>
                <label className="row form-label mb-2 mt-3" htmlFor="phone">
                  手機
                </label>
                <input
                  className="form-control mb-2"
                  type="tel"
                  name="phone"
                  value={user ? user.phone : ''}
                  onChange={handleFieldChange}
                />
                <h6 className="error text-primary mt-2">{errors.phone}</h6>
                <label className="row form-label mb-2 mt-3" htmlFor="birthday">
                  生日
                </label>
                <input
                  className="form-control mb-2"
                  type="date"
                  name="birthday"
                  max={today}
                  value={user ? user.birthday : ''}
                  onChange={handleFieldChange}
                />
                <h6 className="error text-primary mt-2">{errors.birthday}</h6>
                <label className="row form-label mb-2 mt-3" htmlFor="gender">
                  性別
                </label>
                <select
                  className={`form-select mb-2 `}
                  name="gender"
                  value={user ? user.gender : ''}
                  onChange={handleFieldChange}
                >
                  <option value="">請選擇性別</option>
                  <option value="Male">男</option>
                  <option value="Female">女</option>
                  <option value="Other">其他</option>
                </select>
                <h6 className="error text-primary">{errors.gender}</h6>
                <label className="row form-label mb-2 mt-3" htmlFor="address">
                  地址
                </label>
                <div className="row">
                  <div className="form-floating col-6">
                    <select
                      className="form-select mb-2"
                      onChange={(e) => {
                        handleCityChange(e), handleFieldChange(e)
                      }}
                      value={user ? user.address_city : ''}
                      name="address_city"
                    >
                      {/* <option defaultValue value="">
                        請選擇縣市
                      </option> */}
                      {twCity.map((v, i) => {
                        return (
                          <option key={i} value={v.name}>
                            {v.name}
                          </option>
                        )
                      })}
                    </select>
                    <h6 className="error text-primary">
                      {errors.address_city}
                    </h6>
                    <label
                      htmlFor="floatingSelect"
                      className={`ps-3 ${stylesA.left}`}
                    >
                      請選擇縣市
                    </label>
                  </div>
                  <div className="form-floating col-6">
                    <select
                      className="form-select mb-2"
                      name="address_district"
                      onChange={(e) => {
                        handleFieldChange(e)
                      }}
                      value={user ? user.address_district : ''}
                    >
                      {district.map((v, i) => {
                        return (
                          <option key={i} value={v.name}>
                            {v.name}
                          </option>
                        )
                      })}
                    </select>
                    <h6 className="error text-primary">
                      {errors.address_district}
                    </h6>
                    <label
                      htmlFor="floatingSelect"
                      className={`ps-3 ${stylesA.left}`}
                    >
                      請選擇區/鎮
                    </label>
                  </div>
                </div>
                <input
                  className="form-control mb-2 mt-3"
                  type="text"
                  name="address"
                  value={user ? user.address : ''}
                  onChange={(e) => {
                    handleFieldChange(e)
                  }}
                  placeholder="請輸入詳細地址"
                />
                <h6 className="error text-primary">{errors.address}</h6>
                <div className="d-flex ">
                  <button
                    className={`mt-3 mb-5 ms-auto text-light bg-primary ${styles.bts} ${styles.btnSubmit}`}
                  >
                    儲存
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
