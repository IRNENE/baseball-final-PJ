import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './course.module.css'
import Link from 'next/link'
import Script from 'next/script'
import DatePicker from 'react-datepicker'
import favorite from '@/public/images/course/Rectangle false.svg'
import favoriteLove from '@/public/images/course/Rectangle true.svg'
import DateRangePicker from '@/pages/course/DateRangePicker'
import SuperSimple from './price.jsx'
import Example from './Example' // 導入 Example 組件
import ModalComponent from './modal'
import Sorting from './sorting'

export default function Course() {
  const [courses, setCoursSuperSimplees] = useState([])
  const [types, setTypes] = useState([])
  const [selectedTypeName, setSelectedTypeName] = useState('所有')
  const [formData, setFormData] = useState({ inputValue: '' })
  const [selectedColor, setSelectedColor] = useState('#EE3E27')
  const [courseCount, setCourseCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pricemix, setPricemix] = useState(0)
  const [pricemax, setPricemax] = useState(9999)
  const [startdata, setStartdata] = useState(null)
  const [enddata, setEnddata] = useState(null)
  const [shouldShowPagination, setShouldShowPagination] = useState(true)
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const pageSize = 4

  // 處理表單提交
  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const inputValue = formData.get('inputName')
    setFormData({ inputValue })
    event.target.reset()
  }

  // 獲取課程數據
  useEffect(() => {
    let url = 'http://localhost:3005/api/course'
    if (formData.inputValue) {
      const encodedKeyword = encodeURIComponent(formData.inputValue)
      url = `http://localhost:3005/api/course/search/${encodedKeyword}`
    } else if (selectedTypeName && selectedTypeName !== '所有') {
      url = `http://localhost:3005/api/course/type/${selectedTypeName} `
    }
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCourses(data)
        setCourseCount(data.length)
      })
      .catch((error) => console.error('Error fetching courses:', error))
  }, [selectedTypeName, formData])

  // 獲取類型數據
  useEffect(() => {
    fetch('http://localhost:3005/api/course/type')
      .then((response) => response.json())
      .then((data) => {
        setTypes(data)
      })
      .catch((error) => console.error('Error fetching types:', error))
  }, [])

  const formatDescription = (description) => {
    return description.split('/<br>').join('<br>')
  }

  // 處理類型點擊事件
  const handleTypeClick = (typeName) => {
    setSelectedTypeName(typeName)
    setCurrentPage(1)
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(max-width: 575px)')

      // 處理媒體查詢變化
      function handleMediaQueryChange(event) {
        setShouldShowPagination(!event.matches) // 如果寬度小於 575 像素，設置 shouldShowPagination 為 false
        setIsSmallScreen(event.matches) // 如果寬度小於 575 像素，設置 isSmallScreen 為 true
      }

      // 添加監聽器
      mediaQuery.addEventListener('change', handleMediaQueryChange)

      // 初始檢查媒體查詢結果
      handleMediaQueryChange(mediaQuery)

      // 在組件卸載時清除監聽器
      return () => {
        mediaQuery.removeEventListener('change', handleMediaQueryChange)
      }
    }
  }, [])

  // 處理分頁按鈕點擊事件
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // 計算總頁數
  const totalPages = Math.ceil(courses.length / pageSize)

  // 計算顯示的課程列表
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, courses.length)
  const visibleCourses = courses.slice(startIndex, endIndex)

  // 根據 isSmallScreen 狀態條件渲染數據列表
  const dataToShow = isSmallScreen ? courses : visibleCourses

  // 點擊圖標切換收藏狀態
  const handleToggleFav = (courseId) => {
    const updatedCourses = courses.map((course) => {
      if (course.id === courseId) {
        return { ...course, fav: !course.fav }
      }
      return course
    })
    setCourses(updatedCourses)
  }

  const handlePriceChange = (newPricemix, newPricemax) => {
    console.log('Received new price range:', newPricemix, newPricemax)
    setPricemix(newPricemix)
    setPricemax(newPricemax)
  }

  return (
    <>
      <div className={`navber-img-sun ${styles.navberImgSun}`}>
        <div className={`${styles.navberImgTextSun}`}>
          <h1>打擊課程</h1>
          <h4>養成強打的關鍵秘訣 結合科學提升表現</h4>
        </div>
      </div>
      <div className={`container ${styles.container}`}>
        <div
          className={`main-1-sun d-sm-flex justify-content-between align-items-center ${styles.main1Sun}`}
        >
          <nav
            className={`${styles.breadcrumbItem}`}
            aria-label="breadcrumb mb-3"
          >
            <ol className="breadcrumb">
              <li className={`breadcrumb-item`}>
                <a href="#">所有課程</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Library
              </li>
            </ol>
          </nav>
          <div className={`search-sun ${styles.SearchSun}`}>
            <form onSubmit={handleSubmit}>
              <div className={`input-group mb-3`}>
                <input
                  type="text"
                  className={`form-control ${styles.formControl}`}
                  aria-label="Recipient's username"
                  aria-describedby="button-addon2"
                  name="inputName"
                />
                <button
                  className={`search-btn-sun btn ${styles.SearchBtnSun}`}
                  type="submit"
                  id="button-addon2"
                >
                  搜尋
                </button>
              </div>
            </form>
            <div className="sort-sun d-sm-flex d-none align-items-center">
              <p className="d-none d-sm-block me-5">共 {courseCount} 件商品 </p>
              <div className="input mb-3">
                <select className="form-select" id="inputGroupSelect01">
                  <option selected="">排序</option>
                  <option value={1}>價格:高-低</option>
                  <option value={2}>價格:低-高</option>
                  <option value={3}>編碼:高-低</option>
                  <option value={4}>編碼:低-高</option>
                  <option value={5}>更新日期:新-舊</option>
                  <option value={6}>更新日期:舊-新</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <hr className={`${styles.hr}`} />
        <div className={`d-block d-sm-flex main-2-sun ${styles.main2Sun}`}>
          <div className={`d-sm-block filter-sun  ${styles.filterSun}`}>
            <SuperSimple onPriceChange={handlePriceChange} />
            <br />
            <form>
              <div>
                <h6>日期</h6>
              </div>
              <DateRangePicker />
              <div
                className={`d-flex justify-content-between ${styles.btnBox}`}
              >
                <button
                  className="btn btn-secondary me-3"
                  style={{ width: '132.5px' }}
                >
                  取消
                </button>
                <button
                  className="btn btn-primary"
                  style={{ width: '132.5px' }}
                >
                  確定日期
                </button>
              </div>
            </form>
          </div>

          <div className={`d-flex mb-3 ms-3 AllFifterSm ${styles.AllFifterSm}`}>
            <div className={`TypeBtn  ${styles.TypeBtnSun}`}>
              <Example onTypeSelect={handleTypeClick} />
            </div>
            <div className={`PriceDateBtn ${styles.PriceDateBtn}`}>
              <ModalComponent />
            </div>
            <div className={`SortBtn ${styles.PriceDateBtn}`}>
              <Sorting />
            </div>
          </div>
          <div className="TypeAndCourse">
            <p className=" d-sm-none me-5">共 {courseCount} 件商品 </p>
            <div className={`TypeSelect d-none d-sm-flex ${styles.TypeSelect}`}>
              {types.map((type) => (
                <div
                  key={type.name}
                  className={`type-sun d-flex ${styles.TypeSun}`}
                  onClick={() => handleTypeClick(type.name)}
                  style={{
                    color:
                      selectedTypeName === type.name ? selectedColor : 'black',
                  }}
                >
                  <div className={`typeCardSun ${styles.TypeCardSun}`}>
                    <img src={`/images/course/${type.img}`} alt="" />
                    <h6 className="fw-bold mt-1">{type.name}</h6>
                  </div>
                </div>
              ))}
            </div>

            <div className={`course-card-sun `}>
              {dataToShow.map((course) => (
                <div
                  key={course.id}
                  className={`course-card-sun d-flex  ${styles.CourseCardSun}`}
                >
                  {' '}
                  <div className={`${styles.CourseCardImg}`}>
                    <img src={`/images/course/${course.photo}`} alt="" />
                  </div>
                  <div
                    className={`courseCardTextSun ${styles.CourseCardTextSun}`}
                  >
                    <p className="fw-bold">{course.type}</p>
                    <h3 className={`teacherText ${styles.courseNameText}`}>
                      {course.name}
                    </h3>
                    <p>教練:{course.teacher_name}</p>
                    <p>
                      時間:
                      {new Date(course.course_start).toLocaleString('zh-TW', {
                        hour12: false, // 使用24小时制
                        hour: '2-digit',
                        minute: '2-digit',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                      <br className={`${styles.brData}`} />~
                      {new Date(course.course_end).toLocaleString('zh-TW', {
                        hour12: false, // 使用24小时制
                        hour: '2-digit',
                        minute: '2-digit',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </p>
                    <div
                      className={`description ${styles.description}`}
                      dangerouslySetInnerHTML={{
                        __html: formatDescription(course.description),
                      }}
                    />
                  </div>
                  <div
                    className={`d-flex align-items-end text-end justify-content-center flex-column ${styles.CourseCardFavoriteAndPrice}`}
                  >
                    {/* 根据 course.fav 的值来显示不同的图片，并在点击时切换 */}
                    <div
                      className={`d-flex justify-content-center text-center ${styles.CourseCardFavorite}`}
                      onClick={() => handleToggleFav(course.id)}
                    >
                      <Image
                        src={course.fav ? favoriteLove : favorite}
                        alt=""
                      />
                    </div>
                    <div className={`mt-auto  ${styles.CourseCardPrice}`}>
                      <p>${course.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {shouldShowPagination && (
        <nav aria-label="Page navigation example d-flex justify-content-center">
          <ul className="mt-5 pagination d-flex justify-content-center">
            {/* 上一頁按鈕 */}
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <a
                className="page-link"
                href="#"
                aria-label="Previous"
                onClick={(event) => {
                  event.preventDefault()
                  handlePageChange(currentPage - 1)
                }}
              >
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>

            {/* 頁碼按鈕 */}
            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1
              return (
                <li
                  key={page}
                  className={`page-item ${
                    currentPage === page ? 'active' : ''
                  }`}
                >
                  <a
                    className="page-link"
                    href="#"
                    onClick={(event) => {
                      event.preventDefault()
                      handlePageChange(page)
                    }}
                  >
                    {page}
                  </a>
                </li>
              )
            })}

            {/* 下一頁按鈕 */}
            <li
              className={`page-item ${
                currentPage === totalPages ? 'disabled' : ''
              }`}
            >
              <a
                className="page-link"
                href="#"
                aria-label="Next"
                onClick={(event) => {
                  event.preventDefault()
                  handlePageChange(currentPage + 1)
                }}
              >
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      )}
    </>
  )
}
