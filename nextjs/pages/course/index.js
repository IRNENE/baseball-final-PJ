import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './course.module.css'
import Script from 'next/script'
import DatePicker from 'react-datepicker'
import favorite from '@/public/images/course/Rectangle false.svg'
import favoriteLove from '@/public/images/course/Rectangle true.svg'
import DateRangePicker from '@/pages/course/DateRangePicker'
import SuperSimple from './price.jsx'
import Example from './Example' // 導入 Example 組件
import ModalComponent from './modal'
import Sorting from './sorting'
import { initUserData, useAuth } from '@/hooks/use-auth'
import axios from 'axios'
import Swal from 'sweetalert2'

export default function Course() {
  const [courses, setCourses] = useState([])
  const [types, setTypes] = useState([])
  const [selectedTypeName, setSelectedTypeName] = useState('所有')
  const [formData, setFormData] = useState({ inputValue: '' })
  const [selectedColor, setSelectedColor] = useState('#EE3E27')
  const [courseCount, setCourseCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [priceMin, setPriceMin] = useState(1)
  const [priceMax, setPriceMax] = useState(20000)
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState(null)
  const [shouldShowPagination, setShouldShowPagination] = useState(true)
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const pageSize = 4 //一頁有幾個產品
  const { auth, setAuth } = useAuth() // 使用对象解构语法
  const { isAuth, useData } = auth
  const userData = auth.userData
  const [favoriteProductIds, setFavoriteProductIds] = useState([])
  // 在父组件中定义状态变量用于保存选择的日期范围
  const [isSearchPerformed, setIsSearchPerformed] = useState(false)
  const [tempInputValue, setTempInputValue] = useState('')
  const [sortOption, setSortOption] = useState('')
  //處理排序
  const [hoveredIndices, setHoveredIndices] = useState([])

  const handleSortChangeSM = (event) => {
    setSortOption(event)
    console.log(event)
  }
  const handleSortChange = (event) => {
    setSortOption(event.target.value)
    console.log(event.target.value)
    setCurrentPage(1)
  }
  // 處理搜尋表單提交
  const handleSubmit = (event) => {
    event.preventDefault()

    if (isSearchPerformed) {
      // 如果搜索已执行，用户按下了返回按钮
      // 重置输入框的值
      setFormData({ inputValue: '' })
      setTempInputValue('')
      // 重置搜索执行状态
      setIsSearchPerformed(false)
      setCurrentPage(1)
    } else {
      // 获取输入框的值
      const formData = new FormData(event.target)
      const inputValue = formData.get('inputName')

      // 将输入值存储在状态变量中
      setFormData({ inputValue })

      // 设置搜索执行状态为 true
      setIsSearchPerformed(true)
      setCurrentPage(1)
    }

    // 重置表单输入框
    event.target.reset()
  }
  //資料課資料判斷
  useEffect(() => {
    fetchURL()
  }, [
    selectedTypeName,
    formData,
    priceMin,
    priceMax,
    startDate,
    endDate,
    sortOption,
  ])
  const fetchURL = async () => {
    let url = 'http://localhost:3005/api/course?'
    if (priceMin && priceMax) {
      url += `priceMin=${priceMin}&priceMax=${priceMax}&`
    }

    if (startDate && !endDate) {
      url += `startDate=${startDate}&endDate=null&`
    } else if (startDate && endDate) {
      url += `startDate=${startDate}&endDate=${endDate}&`
    }
    if (selectedTypeName !== '所有') {
      url += `type=${selectedTypeName}&`
    }
    if (formData.inputValue) {
      const encodedKeyword = encodeURIComponent(formData.inputValue)
      url += `search=${encodedKeyword}&`
    }
    if (sortOption) {
      url += `sortOption=${sortOption}&`
    }
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCourses(data)
        setCourseCount(data.length)
      })
  }
  //類別判斷
  useEffect(() => {
    fetch('http://localhost:3005/api/course/type')
      .then((response) => response.json())
      .then((data) => {
        setTypes(data)
      })
      .catch((error) => console.error('Error fetching types:', error))
  }, [])

  // const formatDescription = (description) => {
  //   // 检查 description 是否已定义且是一个字符串
  //   if (typeof description === 'string') {
  //     // 将所有出现的 "/<br>" 替换为 "<br>"
  //     return description.split('/<br>').join('<br>')
  //   } else {
  //     // 如果 description 不是字符串，返回原始值或空字符串
  //     return description || ''
  //   }
  // }

  //若有更換使用者更新我的收藏愛心判斷
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3005/api/favorite/user/${userData.id}/`
        )
        const favoriteProducts = response.data.map((item) => item.product_id)
        setFavoriteProductIds(favoriteProducts)
        console.log('favoriteProductIds:', favoriteProductIds)
      } catch (error) {
        console.error('Error fetching favorite data:', error)
      }
    }
    fetchFavorites()
  }, [userData.id])

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

  const scrollToCourse = () => {
    const courseSection = document.getElementById('course');
    if (courseSection) {
      courseSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
  // 處理分頁按鈕點擊事件
  const handlePageChange = (page) => {
    scrollToCourse();
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

  //篩選日期
  const handleDateChange = (start, end) => {
    // 将日期对象转换为 'YYYY-MM-DD 00:00:00' 格式
    const formatDateToMidnight = (date) => {
      if (date === 'null') {
        console.error('The date provided is null. Unable to format date.')
        return 'null'
      }

      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0') // 月份是从0开始，所以要加1
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day} `
    }

    // 使用 formatDateToMidnight 函数格式化开始日期和结束日期
    const formattedStartDate = start ? formatDateToMidnight(start) : ''
    const formattedEndDate = end ? formatDateToMidnight(end) : ''

    console.log(formattedStartDate, formattedEndDate)

    // 将格式化后的日期设置为组件状态
    setStartDate(formattedStartDate)
    setEndDate(formattedEndDate)
    setCurrentPage(1)
  }
  //篩選金額初始化
  const handlePriceNull = (NullPriceMin, NullPriceMax) => {
    console.log(NullPriceMin, NullPriceMax)
    setPriceMin(NullPriceMin)
    setPriceMax(NullPriceMax)
    setCurrentPage(1)
  }

  //篩選金額
  const handlePriceChange = (newPriceMin, newPriceMax) => {
    console.log('Received new price range:', newPriceMin, newPriceMax)
    setPriceMin(newPriceMin)
    setPriceMax(newPriceMax)
    setCurrentPage(1)
  }

  //喧染USER我的收藏
  const fetchFavorites = async () => {
    console.log('Fetching favorites data...')
    try {
      const response = await axios.get(
        `http://localhost:3005/api/favorite/user/${userData.id}/`
      )
      const favoriteProducts = response.data.map((item) => item.product_id)
      setFavoriteProductIds(favoriteProducts)
      console.log('favoriteProductIds:', favoriteProductIds)
    } catch (error) {
      console.error('Error fetching favorite data:', error)
    }
  }

  useEffect(() => {
    fetchFavorites()
  }, [userData.id])

  // 加入我的收藏
  const handleToggleFav = (courseId) => {
    // 创建 POST 请求数据
    const favData = {
      user_id: userData.id,
      product_id: courseId,
      class_id: 'C',
    }

    // 发送 POST 请求
    fetch('http://localhost:3005/api/favorite', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(favData),
    })
      .then((response) => {
        // 检查响应状态
        if (!response.ok) {
          throw new Error('Failed to process request')
        }
        return response.json()
      })
      .then((data) => {
        // 检查响应中的状态
        if (data.status === 'success') {
          console.log('已加入我的收藏')
        } else if (data.status === 'fail') {
          console.log('已從我的收藏刪除')
        }
        // 操作完成后，调用 fetchFavorites 刷新数据
        fetchFavorites()
      })
      .catch((error) => {
        console.error('Error:', error)
        Swal.fire({
          icon: 'error',
          zIndex: '9999999',
          title: '請先完成登入',
        })
      })
  }
  const handleMouseEnter = (index) => {
    setHoveredIndices((prevHoveredIndices) => [...prevHoveredIndices, index])
  }

  const handleMouseLeave = (index) => {
    setHoveredIndices((prevHoveredIndices) =>
      prevHoveredIndices.filter((i) => i !== index)
    )
  }

  return (
    <>
      <div className={`navber-img-sun ${styles.navberImgSun}`}>
        <div className={`${styles.navberImgTextSun}`}>
          <h1>課程專區</h1>
          <h4>養成強打的關鍵秘訣 結合科學提升表現</h4>
        </div>
      </div>
      <div className={`container ${styles.container}`}>
        <div
          className={`main-1-sun  d-sm-flex justify-content-between align-items-center ${styles.main1Sun}`}
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
                類別
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {selectedTypeName}
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
                  value={tempInputValue}
                  // onChange 事件处理函数仅更新临时状态变量 tempInputValue
                  onChange={(e) => setTempInputValue(e.target.value)}
                  name="inputName"
                />
                <button
                  type="submit"
                  className={`btn ${
                    isSearchPerformed ? 'btn-return' : 'btn-search'
                  } ${styles.SearchBtnSun}`} // 根据状态决定按钮样式
                >
                  {/* 根据 isSearchPerformed 状态决定按钮内容 */}
                  {isSearchPerformed ? '返回' : '搜索'}
                </button>
              </div>
            </form>
            <div className="sort-sun d-sm-flex d-none align-items-center">
              <p className="d-none d-sm-block me-5">共 {courseCount} 件商品 </p>
              <div className="input mb-3">
                <select
                  className="form-select"
                  id="inputGroupSelect01"
                  onChange={handleSortChange}
                >
                  <option selected="">排序( 預設 )</option>
                  <option value={1}>價格:高-低</option>
                  <option value={2}>價格:低-高</option>
                  {/* <option value={3}>編碼:高-低</option>
                  <option value={4}>編碼:低-高</option> */}
                  <option value={3}>更新日期:新-舊</option>
                  <option value={4}>更新日期:舊-新</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <hr className={`${styles.hr}`} />
        <div className={`d-block d-sm-flex main-2-sun ${styles.main2Sun}`}>
          <div className={`d-sm-block filter-sun  ${styles.filterSun}`}>
            <SuperSimple
              onPriceChange={handlePriceChange}
              onPriceNull={handlePriceNull}
            />
            <br />
            <div>
              <h6>日期</h6>
            </div>
            <DateRangePicker onDateChange={handleDateChange} className="ms-2" />
          </div>

          <div className={`d-flex mb-3  AllFifterSm ${styles.AllFifterSm}`}>
            <div className={`TypeBtn  ${styles.TypeBtnSun}`}>
              <Example onTypeSelect={handleTypeClick} />
            </div>
            <div className={`PriceDateBtn ${styles.PriceDateBtn}`}>
              <ModalComponent
                onDateChange={handleDateChange}
                onPriceChange={handlePriceChange}
              />
            </div>
            <div className={`SortBtn ${styles.PriceDateBtn}`}>
              <Sorting onSortChange={handleSortChangeSM} />
            </div>
          </div>
          <div className="TypeAndCourse"  id="course">
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
              {dataToShow.length === 0 ? (
                // 當 `dataToShow` 為空時，顯示提示消息
                <h2>查無此商品</h2>
              ) : (
                dataToShow.map((course, index) => {
                  // 為每個商品生成 photoArray
                  const photoArray = course.photo.split(',')

                  // 使用 photoArray[0] 作為圖片的路徑
                  const firstPhoto = photoArray[0]
                  const isHovered = hoveredIndices.includes(index)
                  return (
                    <div
                      className="d-flex"
                      key={course.id}
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={() => handleMouseLeave(index)}
                      style={{
                        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                        transition: 'transform 0.2s ease-in-out',
                      }}
                    >
                      <Link href={`/course/${course.id}`} legacyBehavior>
                        <a
                          className={`course-card-sun d-flex ${styles.CourseCardSun} custom-link-color-Sun`}
                        >
                          <div className={`${styles.CourseCardImg}`}>
                            {/* 使用 firstPhoto 作為圖片路徑 */}
                            <img
                              src={`/images/course/${firstPhoto}`}
                              alt={course.name}
                            />
                          </div>
                          <div
                            className={`courseCardTextSun ${styles.CourseCardTextSun}`}
                          >
                            <p className="fw-bold">{course.type}</p>
                            <h3
                              className={`teacherText ${styles.courseNameText}`}
                            >
                              {course.name}
                            </h3>
                            {/* 其他商品信息 */}
                            <p>教練: {course.teacher_name}</p>
                            <p>
                              時間:
                              {new Date(course.course_start).toLocaleString(
                                'zh-TW',
                                {
                                  hour12: false,
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                }
                              )}
                              <br className={`${styles.brData}`} />~
                              {new Date(course.course_end).toLocaleString(
                                'zh-TW',
                                {
                                  hour12: false,
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                }
                              )}
                            </p>
                            課程內容:
                            <br />
                            <div
                              className={`description ${styles.description}`}
                              dangerouslySetInnerHTML={{
                                __html: course.description,
                              }}
                            />
                          </div>
                        </a>
                      </Link>
                      <div
                        className={`d-flex align-items-end text-end justify-content-center flex-column ${styles.CourseCardFavoriteAndPrice}`}
                      >
                        {/* 根据 course.fav 的值来显示不同的图片，并在点击时切换 */}
                        <div
                          className={`d-flex justify-content-center text-center ${styles.CourseCardFavorite}`}
                          onClick={() => handleToggleFav(course.id)}
                        >
                          <Image
                            src={
                              favoriteProductIds.includes(course.id)
                                ? favoriteLove
                                : favorite
                            }
                            alt=""
                            width={24} // 根据实际需求设置宽度
                            height={24} // 根据实际需求设置高度
                          />
                        </div>
                        <div className={`mt-auto  ${styles.CourseCardPrice}`}>
                          <p>${course.price}</p>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
              {dataToShow.length === 0 ? (
                // 如果沒有數據要顯示，這裡可以放置一些提示或其他內容，或者直接省略
                <div className="d-none">沒有可顯示的內容</div>
              ) : (
                shouldShowPagination && (
                  <nav aria-label="Page navigation example d-flex justify-content-center">
                    <ul className="mt-5 pagination d-flex justify-content-center">
                      {/* 上一頁按鈕 */}
                      <li
                        className={`page-item ps-2 ${styles.pages} ${
                          currentPage === 1 ? 'd-none' : ''
                        }`}
                      >
                        <a
                          className="page-link"
                          href="#course"
                          aria-label="Previous"
                          onClick={(event) => {
                            event.preventDefault()
                            handlePageChange(currentPage - 1)
                          }}
                        >
                          <img
                            src={`/images/pages-icon/icon.png`}
                            className=""
                          />
                        </a>
                      </li>

                      {/* 頁碼按鈕 */}
                      {Array.from({ length: totalPages }, (_, index) => {
                        const page = index + 1
                        if (
                          page === 1 || // 第一頁
                          page === currentPage || // 目前頁面
                          page === totalPages || // 最後一頁
                          Math.abs(currentPage - page) <= 1 || // 相鄰頁面
                          (currentPage <= 3 && page <= 5) || // 目前頁面在前五頁
                          (currentPage >= totalPages - 2 &&
                            page >= totalPages - 4) // 目前頁面在後五頁
                        ) {
                          return (
                            <li
                              key={page}
                              className={`page-item ${
                                currentPage === page ? 'active' : ''
                              }`}
                            >
                              <a
                                className={`page-link ${styles.pages}`}
                                href="#course"
                                onClick={(event) => {
                                  event.preventDefault()
                                  handlePageChange(page)
                                }}
                              >
                                {page}
                              </a>
                            </li>
                          )
                        } else if (
                          (currentPage > 3 && page === 2) || // 省略號前面的頁碼
                          (currentPage < totalPages - 2 &&
                            page === totalPages - 1) // 省略號後面的頁碼
                        ) {
                          return (
                            <li key={page} className={`page-item disabled`}>
                              <a
                                className={`page-link ${styles.pages}`}
                                href="#course"
                                onClick={(event) => event.preventDefault()}
                              >
                                ...
                              </a>
                            </li>
                          )
                        }
                        return null
                      })}

                      {/* 下一頁按鈕 */}
                      <li
                        className={`page-item pb-1 ps-2 ${
                          currentPage === totalPages ? 'd-none' : ''
                        }`}
                      >
                        <a
                          className="page-link"
                          href="#course"
                          aria-label="Next"
                          onClick={(event) => {
                            event.preventDefault()
                            handlePageChange(currentPage + 1)
                          }}
                        >
                          <img
                            src={`/images/pages-icon/Polygon 2.png`}
                            className=""
                          />
                        </a>
                      </li>
                    </ul>
                  </nav>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
