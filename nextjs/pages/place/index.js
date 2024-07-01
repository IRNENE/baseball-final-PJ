import React, { useState } from 'react'
import stylesA from '@/styles/member/place.module.css'
import styles from '@/styles/join/join_list.module.css'
// import District from '@/components/district/district'
import Link from 'next/link'
import twCity from '@/data/TwCities.json'
import stylesB from '@/styles/member/login.module.css'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { MdPhoneInTalk } from 'react-icons/md'
import { LuParkingCircle, LuParkingCircleOff } from 'react-icons/lu'
import { GrRestroomMen, GrRestroomWomen } from 'react-icons/gr'
import { VscGlobe } from 'react-icons/vsc'
import { useLoader } from '@/hooks/use-loader'
import Swal from 'sweetalert2'
import { initUserData, useAuth } from '@/hooks/use-auth'
import moment from 'moment'

export default function Place() {
  const [searchSelectedCity, setSearchSelectedCity] = useState('')
  const [searchDistrict, setSearchDistrict] = useState([])
  const [searchSelectedDistrict, setSearchSelectedDistrict] = useState('')
  const [searchGymType, setSearchGymType] = useState('棒球場')
  const [searchData, setSearchData] = useState([])
  const [imgUrl, setImgUrl] = useState({})
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [searchSelect, setSearchSelect] = useState(true)
  const { show, setShow } = useLoader()
  const [selectedPlace, setSelectedPlace] = useState('')

  const handleSearchCityChange = (e) => {
    const city = e.target.value
    setSearchSelectedCity(city)
    twCity.find((v) => {
      if (v.name === city) {
        setSearchDistrict(v.districts)
        setSearchSelectedDistrict('')
        setSearchSelect(true)
      }
    })
  }
  const handleSearchDistrictChange = (e) => {
    const district = e.target.value
    setSearchSelectedDistrict(district)
    setSearchSelect(false)
  }
  const handleSearchGymTypeChange = (e) => {
    const type = e.target.value
    setSearchGymType(type)
  }

  const handleSearchSubmit = async (e) => {
    e.preventDefault()
    setShow(true)
    const data = await fetch(
      `https://iplay.sa.gov.tw/odata/GymSearch?City=${searchSelectedCity}&Country=${searchSelectedDistrict}&GymType=${searchGymType}`
    ).then((res) => res.json())
    // setSearchData(data.value)
    // console.log(data)

    const Fetch2 = data.value.map(async (Data) => {
      const data2 = await fetch(
        `https://iplay.sa.gov.tw/odata/Gym(${Data.GymID})`
      )
        .then((res) => res.json())
        .catch((err) => err)
      // console.log(data2)

      return {
        ...Data,
        website: data2.WebUrl,
        photo1: data2.Photo1Url,
        photo2: data2.Photo2Url,
        Park: data2.ParkType,
        toilet: data2.PassEasyToilet,
      }
    })
    const searchDataWithOther = await Promise.all(Fetch2)
    setSearchData(searchDataWithOther)
    setFormSubmitted(true)
    setShow(false)
  }
  // console.log(searchData)

  const handleMouseEnter = (index, imgUrl) => {
    setImgUrl((prevImgUrls) => {
      return {
        ...prevImgUrls,
        [index]: imgUrl,
      }
    })
  }

  const handleJoin = (e) => {
    setSelectedPlace(e.target.id)
    setNewJoin({
      ...newJoin,
      address_city: searchSelectedCity,
      address_district: searchSelectedDistrict,
      gymType: searchGymType,
      place: e.target.id,
    })
  }

  // 揪團modal使用

  const [maxText, setMaxText] = useState('')
  const maxLength = 150
  let isComposition = false
  const isChrome =
    typeof window !== 'undefined' &&
    window.navigator.userAgent.indexOf('Chrome') > -1

  const handleComposition = (e) => {
    if (e.type === 'compositionend') {
      isComposition = false
      if (isChrome) {
        handleChange(e)
      }
    } else {
      isComposition = true
    }
  }

  const handleChange = (e) => {
    if (!isComposition) {
      let inputValue = e.target.value
      setMaxText(inputValue)
    }
  }

  const handleBlur = (e) => {
    setMaxText(e.target.value)
    handleFieldChange(e)
  }

  // 檢查是否超過字數上限，用於設置文字顏色
  const textColor = maxText.length >= maxLength ? 'red' : 'black'

  // 取得登入會員的id
  const { auth, setAuth } = useAuth()
  const userId = auth.userData.id
  // console.log(userId)

  // -- 新增開團用 --
  // 紀錄新增揪團表單各欄位的name與value
  const [newJoin, setNewJoin] = useState({
    userId: userId,
    name: '',
    address_city: '',
    address_district: '',
    gymType: '',
    place: '',
    activity_date: '',
    deadline_date: '',
    total_member: 2,
    description: '',
    joinImg: '',
  })
  // 紀錄各欄位要顯示的錯誤訊息
  const [errors, setErrors] = useState({
    name: '',
    place: '',
    activity_date: '',
    total_member: '',
    description: '',
  })

  // 上傳揪團封面圖片
  const [selectedFile, setSelectedFile] = useState(null)
  const [newFileName, setNewFileName] = useState('')

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    // console.log(file)

    if (file) {
      // console.log(file)
      const timestamp = Date.now()
      const fileName = file.name
      const fileExtension = fileName.split('.').pop() // 取得副檔名
      // console.log(fileExtension);
      const newFileName = `${timestamp}_join.${fileExtension}`
      // console.log(newFileName)
      setSelectedFile(file)
      setNewFileName(newFileName)
      setNewJoin({
        ...newJoin,
        joinImg: newFileName,
      })
    } else {
      setSelectedFile(null)
      setNewJoin({
        ...newJoin,
        joinImg: 'joinDefaultImg.jpg',
      })
    }
  }

  // onChange - 將各個輸入欄位的值紀錄並設定到newJoin物件裡
  const handleFieldChange = (e) => {
    setNewJoin({
      ...newJoin,
      userId: userId,
      [e.target.name]: e.target.value,
      description: maxText,
    })
  }

  // 取得當下時間
  const currentDateTime = moment()
  // 加上一天
  const minDateTime = currentDateTime.add(1, 'days').format('YYYY-MM-DDTHH:mm')

  // 當活動日期欄位變更時的處理函數
  const handleActivityDateChange = (e) => {
    const activityDate = e.target.value
    const activityDateTime = moment(activityDate)

    // 將活動日期減去一天
    const deadlineDateTime = activityDateTime.subtract(1, 'days')

    // 格式化並設定到 newJoin 物件的 deadline_date 屬性中
    const deadlineDate = deadlineDateTime.format('YYYY-MM-DD HH:mm')

    // 更新 newJoin 物件，同時設定活動日期和截止日期
    setNewJoin({
      ...newJoin,
      activity_date: activityDate, // 設定活動日期
      deadline_date: deadlineDate, // 設定截止日期
    })
  }

  // 驗證揪團需要人數
  const validateTotalMember = (totalMember) => {
    // 檢查是否為數字並且大於等於 2
    const regex = /^\d+$/
    return regex.test(totalMember) && parseInt(totalMember) >= 2
  }

  // 送出開團表單資料
  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {
      name: '',
      place: '',
      activity_date: '',
      total_member: '',
      description: '',
    }

    // 預設 - 沒有錯誤
    let hasErrors = false

    if (!newJoin.name) {
      newErrors.name = '- 請輸入揪團名稱'
      hasErrors = true
    }
    if (newJoin.address_city === '請選擇縣市' || !newJoin.address_city) {
      newErrors.place = '- 請選擇縣市'
      hasErrors = true
    } else if (newJoin.gymType === '請選擇場地類型' || !newJoin.gymType) {
      newErrors.place = '- 請選擇場地類型'
      hasErrors = true
    } else if (newJoin.place === '請選擇場地' || !newJoin.place) {
      newErrors.place = '- 請選擇場地'
      hasErrors = true
    } else if (newJoin.place === '此地區查詢不到相關場地') {
      newErrors.place = '- 請選擇其他地區的場地'
      hasErrors = true
    }
    if (!newJoin.activity_date) {
      newErrors.activity_date = '- 請選擇揪團日期'
      hasErrors = true
    }
    if (!newJoin.total_member) {
      newErrors.total_member = '- 請輸入揪團人數'
      hasErrors = true
    } else if (!validateTotalMember(newJoin.total_member)) {
      newErrors.total_member = '- 人數需大於2人'
      hasErrors = true
    }
    if (!newJoin.description) {
      newErrors.description = '- 請輸入揪團介紹'
      hasErrors = true
    }
    // 設定錯誤訊息，且如果有錯誤的話就終止送出表單
    setErrors(newErrors)
    if (hasErrors) {
      console.log(newJoin)
      return
    }

    // POST - 傳入後端的資料
    const res = await fetch('http://localhost:3005/api/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newJoin),
    })

    const data = await res.json()
    if (data.status === 'success') {
      Swal.fire({
        icon: 'success',
        title: '新增揪團成功!',
        showConfirmButton: false,
        timer: 2000,
      })
      setTimeout(() => {
        window.location.href = 'http://localhost:3000/join'
      }, 1000)
    }

    // 選擇了圖片時才執行上傳
    if (selectedFile) {
      const formData = new FormData()
      formData.append('joinImg', selectedFile, newFileName)

      const res = await fetch('http://localhost:3005/api/join/upload-joinImg', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      console.log('圖片上傳成功:', data)
    }
  }
  return (
    <>
      <div className={`container-fluid mb-4  ${stylesA.top}`}>
        <div className="container">
          <h1>場域地圖</h1>
          <br />
          <br />
          <h4>想找好地點練習?</h4>
          <h4>開始尋找</h4>
        </div>
      </div>
      <div className="container mt-5">
        <form className="searchBox text-center " onSubmit={handleSearchSubmit}>
          <div className="row d-flex justify-content-center">
            <div className="form-floating col-sm-3 col-10 mb-1">
              <select
                className="form-select"
                onChange={(e) => {
                  handleSearchCityChange(e)
                }}
                name="City"
              >
                <option defaultValue value="">
                  請選擇縣市
                </option>
                {twCity.map((v, i) => {
                  return (
                    <option key={i} value={v.name}>
                      {v.name}
                    </option>
                  )
                })}
              </select>
              <label
                htmlFor="floatingSelect"
                className={`ps-3 ${stylesB.left}`}
              >
                請選擇縣市
              </label>
            </div>
            <div className="form-floating col-sm-3 col-10 mb-1">
              <select
                className="form-select"
                name="Country"
                onChange={handleSearchDistrictChange}
              >
                {searchSelect && (
                  <option selected value="">
                    請選擇縣市
                  </option>
                )}
                {searchDistrict.map((v, i) => {
                  return (
                    <option key={i} value={v.name}>
                      {v.name}
                    </option>
                  )
                })}
              </select>
              <label
                htmlFor="floatingSelect"
                className={`ps-3 ${stylesB.left}`}
              >
                請選擇行政區
              </label>
            </div>
            <div className="form-floating col-sm-3 col-10">
              <select
                className="form-select"
                name="GymType"
                onChange={handleSearchGymTypeChange}
              >
                <option value="棒球場">棒球場</option>
                <option value="壘球場">壘球場</option>
                <option value="棒、壘球打擊練習場">棒、壘球打擊練習場</option>
              </select>
              <label
                htmlFor="floatingSelect"
                className={`ps-3 ${stylesB.left}`}
              >
                請選擇場地類型
              </label>
            </div>
          </div>
          <div className="mt-3">
            <button className={`bg-black text-white ${stylesA.bt}`}>
              <h5>查詢</h5>
            </button>
          </div>
        </form>
        <hr />
        <div className="result my-5">
          {formSubmitted && searchData.length === 0 && (
            <h4 className="text-center text-primary">
              無符合之場地，請重新選擇。
            </h4>
          )}
          {searchData.map((v, i) => {
            return (
              <div key={i}>
                <div className=" row align-items-start justify-content-center my-5">
                  <div
                    className={`col-12 col-sm-4 mb-3 mb-sm-5 ${stylesA.left}`}
                  >
                    <div className={`${stylesA.imgBox} ${stylesA.imgBig} mb-2`}>
                      <img
                        src={
                          imgUrl[i]
                            ? imgUrl[i]
                            : v.photo1
                            ? v.photo1
                            : 'https://t4.ftcdn.net/jpg/02/51/95/53/360_F_251955356_FAQH0U1y1TZw3ZcdPGybwUkH90a3VAhb.jpg'
                        }
                        alt=""
                      />
                    </div>
                    <div className={`d-flex ${stylesA.imgSmallWrap}`}>
                      <div
                        className={`${stylesA.imgBox} ${stylesA.imgSmall} me-2`}
                        onMouseEnter={() => {
                          handleMouseEnter(i, v.photo1)
                        }}
                      >
                        <img src={v.photo1} alt="" />
                      </div>
                      <div
                        className={`${stylesA.imgBox} ${stylesA.imgSmall}`}
                        onMouseEnter={() => {
                          handleMouseEnter(i, v.photo2)
                        }}
                      >
                        <img src={v.photo2} alt="" />
                      </div>
                    </div>
                  </div>
                  <div className={`col-12 col-sm-6 ${stylesA.right}`}>
                    <h3 className="mb-3 mb-sm-4 text-wrap text-sm-nowrap text-info">
                      {v.Name}
                    </h3>
                    <div className="d-flex align-items-center mb-2 text-info">
                      <FaMapMarkerAlt
                        className={`me-2 text-primary ${stylesA.icon}`}
                      />
                      <h4>{v.Address}</h4>
                    </div>
                    <div className="d-flex align-items-center mb-2 text-info">
                      <MdPhoneInTalk className={`me-2 ${stylesA.icon}`} />
                      <h4>{v.OperationTel}</h4>
                    </div>
                    <div className="d-flex align-items-center mb-4">
                      <VscGlobe className={`me-2 ${stylesA.icon}`} />
                      <Link href={v.website == null ? '' : v.website}>
                        <h4 className="text-primary">官方網站</h4>
                      </Link>
                    </div>
                    {v.Park === '無停車場' ? (
                      <LuParkingCircleOff
                        className={`mb-2 ${stylesA.iconB} ${stylesA.iconPark}`}
                      />
                    ) : (
                      <LuParkingCircle
                        className={`mb-2 ${stylesA.iconB} ${stylesA.iconPark}`}
                      />
                    )}
                    <br />
                    {v.toilet === 0 ? (
                      ''
                    ) : (
                      <>
                        <GrRestroomMen
                          className={`mb-2 ${stylesA.iconB} ${stylesA.iconMan}`}
                        />
                        <GrRestroomWomen
                          className={`mb-2 ${stylesA.iconB} ${stylesA.iconWoman}`}
                        />
                      </>
                    )}
                    <br />
                    <button
                      className={`bg-black text-white ${stylesA.bt}`}
                      id={v.Name}
                      data-bs-toggle="modal"
                      data-bs-target={`#ModalOpen${v.name}`}
                      onClick={handleJoin}
                    >
                      我要開團
                    </button>
                  </div>
                </div>
                <hr />
                {/* 我要開團 - modal */}
                <div
                  className="modal fade"
                  id={`ModalOpen${v.name}`}
                  tabIndex="-1"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div
                    className={`modal-dialog modal-lg text-info ${styles.bodyMT}`}
                  >
                    <div className="modal-content px-3 pt-3">
                      <button
                        type="button"
                        className="btn-close ms-auto"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                      <h1
                        className="modal-title fs-5 mx-auto"
                        id="exampleModalLabel"
                      >
                        我要開團
                      </h1>

                      <div className="modal-body text-start px-4">
                        <form onSubmit={handleSubmit}>
                          <div className="">
                            <label
                              htmlFor="teamName"
                              className="col-form-label"
                            >
                              *揪團名稱
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="name"
                              value={newJoin.name}
                              onChange={handleFieldChange}
                            />
                            <div
                              className={`mt-1 ${styles.miniText}`}
                              style={{ color: 'red', height: 21 }}
                            >
                              <p className="mb-0">{errors.name}</p>
                            </div>
                          </div>

                          <div className="">
                            <label
                              htmlFor="joinDate"
                              className="col-form-label"
                            >
                              *揪團地點
                            </label>
                            <div className="row">
                              <div className="col-6 pe-2">
                                <select
                                  className="form-select"
                                  aria-label="Default select example"
                                  name="address_city"
                                  disabled
                                >
                                  {searchSelectedCity && (
                                    <option defaultValue value="">
                                      {searchSelectedCity}
                                    </option>
                                  )}
                                </select>
                              </div>

                              <div className="col-6 ps-2">
                                <select
                                  className="form-select"
                                  aria-label="Default select example"
                                  name="address_district"
                                  disabled
                                >
                                  {searchSelectedDistrict && (
                                    <option defaultValue value="">
                                      {searchSelectedDistrict}
                                    </option>
                                  )}
                                </select>
                              </div>
                            </div>

                            <div className="row mt-3">
                              <div className="col-6 pe-2">
                                <select
                                  className="form-select"
                                  aria-label="Default select example"
                                  disabled
                                  name="gymType"
                                >
                                  {searchGymType && (
                                    <option selected value="">
                                      {searchGymType}
                                    </option>
                                  )}
                                </select>
                              </div>

                              <div className="col-6 ps-2">
                                <select
                                  className="form-select"
                                  aria-label="Default select example"
                                  name="place"
                                  disabled
                                >
                                  {selectedPlace && (
                                    <option selected value="">
                                      {selectedPlace}
                                    </option>
                                  )}
                                </select>
                              </div>
                            </div>
                            <div
                              className={`mt-1 ${styles.miniText}`}
                              style={{ color: 'red', height: 21 }}
                            >
                              <p className="mb-0">{errors.place}</p>
                            </div>
                          </div>

                          <div className="">
                            <label
                              htmlFor="joinDate"
                              className="col-form-label"
                            >
                              *揪團日期
                              <span className={styles.miniText}>
                                {' '}
                                (截團時間為活動日的前一天)
                              </span>
                            </label>
                            <input
                              type="datetime-local"
                              min={minDateTime}
                              className="form-control"
                              name="activity_date"
                              value={newJoin.activity_date}
                              onChange={(e) => {
                                handleFieldChange(e)
                                handleActivityDateChange(e)
                              }}
                            />
                            <div
                              className={`mt-1 ${styles.miniText}`}
                              style={{ color: 'red', height: 21 }}
                            >
                              <p className="mb-0">{errors.activity_date}</p>
                            </div>
                          </div>

                          {/* 隱藏欄位 */}
                          <div className="" style={{ display: 'none' }}>
                            <label
                              htmlFor="signUpDate"
                              className="col-form-label"
                            >
                              *報名截止日期
                            </label>
                            <input
                              type="datetime-local"
                              className="form-control"
                              name="deadline_date"
                              defaultValue={newJoin.deadline_date}
                            />
                          </div>

                          <div className="">
                            <label
                              htmlFor="teamPeople"
                              className="col-form-label"
                            >
                              *揪團人數{' '}
                              <span className={styles.miniText}>
                                {' '}
                                (需大於2人)
                              </span>
                            </label>
                            <input
                              type="number"
                              min={2}
                              className="form-control"
                              name="total_member"
                              value={newJoin.total_member}
                              onChange={handleFieldChange}
                            />
                            <div
                              className={`mt-1 ${styles.miniText}`}
                              style={{ color: 'red', height: 21 }}
                            >
                              <p className="mb-0">{errors.total_member}</p>
                            </div>
                          </div>

                          <div>
                            <label
                              htmlFor="joinText"
                              className="col-form-label"
                            >
                              *揪團介紹
                            </label>
                            <textarea
                              className={`form-control ${styles['join-Text']}`}
                              rows={3}
                              onChange={(e) => {
                                handleChange(e)
                                handleFieldChange(e)
                              }}
                              onCompositionStart={(e) => {
                                handleComposition(e)
                              }}
                              onCompositionUpdate={(e) => {
                                handleComposition(e)
                              }}
                              onCompositionEnd={(e) => {
                                handleComposition(e)
                              }}
                              onBlur={(e) => {
                                handleBlur(e)
                              }}
                              maxLength={maxLength}
                              name="description"
                            ></textarea>

                            <div className="d-flex justify-content-between mt-2">
                              {maxText.length >= maxLength && (
                                <div style={{ color: 'red' }}>
                                  <p className="mb-0">字數已達上限 !</p>
                                </div>
                              )}
                              {maxText.length == 0 && (
                                <div
                                  className={`${styles.miniText}`}
                                  style={{ color: 'red' }}
                                >
                                  <p className="mb-0">{errors.description}</p>
                                </div>
                              )}
                              <div
                                style={{ color: textColor }}
                                className="ms-auto"
                              >
                                <p className="mb-0">{`${maxText.length} / ${maxLength}`}</p>
                              </div>
                            </div>
                          </div>

                          <div className="mb-2">
                            <label htmlFor="teamImg" className="col-form-label">
                              揪團圖片
                              <span className={styles.miniText}> (選填)</span>
                            </label>
                            <input
                              type="file"
                              className="form-control"
                              name="joinImg"
                              accept="image/*"
                              onChange={(e) => {
                                handleFileChange(e)
                              }}
                            />
                          </div>
                          <div className="d-flex justify-content-between mb-4 mt-4">
                            <button
                              type="button"
                              className="btn btn-secondary me-5"
                              data-bs-dismiss="modal"
                            >
                              取消
                            </button>
                            <button
                              type="submit"
                              className="btn btn-primary text-white"
                            >
                              發起揪團
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
