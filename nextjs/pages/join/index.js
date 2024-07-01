import { useState, useEffect } from 'react'
import moment from 'moment'
import Link from 'next/link'
import Swal from 'sweetalert2'
import twCity from '@/data/TwCities.json'
import styles from '@/styles/join/join_list.module.css'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
// import Pagination from '@/components/pagination/pagination'
import District from '@/components/district-join/district'
import { initUserData, useAuth } from '@/hooks/use-auth'
import { useLoader } from '@/hooks/use-loader'
import { BiSolidLeftArrow, BiSolidRightArrow } from 'react-icons/bi'
import { useRouter } from 'next/router'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

export default function JoinList() {
  const router = useRouter()
  // slide 輪播設定
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 1, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 650 },
      items: 2,
      slidesToSlide: 1, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 650, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  }

  // 向下捲動用
  const handleScroll = () => {
    const scrollStep = 1000 // 每次滾動距離
    const scrollInterval = 10 // 滾動間隔時間
    const targetY = 1000 // 目標距離
    let currentY = window.screenY

    const scrollIntervalID = setInterval(() => {
      if (currentY < targetY) {
        window.scrollBy(0, scrollStep)
        currentY += scrollStep
        if (currentY >= targetY) {
          clearInterval(scrollIntervalID)
        }
      } else {
        window.scrollBy(0, -scrollStep)
        currentY -= scrollStep
        if (currentY <= targetY) {
          clearInterval(scrollIntervalID)
        }
      }
    }, scrollInterval)
  }

  // 條件用
  const [city, setCity] = useState('')

  // 頁碼設定
  // const [test, setTest] = useState([])
  // const [currentPage, setCurrentPage] = useState(1)
  // const a = fetch('https://jsonplaceholder.typicode.com/users')
  //   .then((res) => res.json())
  //   .then((data) => {
  //     // console.log(data)
  //     let arr = data.map((v, i) => v.winery)
  //     // console.log(arr)
  //     setTest(arr)
  //   })

  // 分頁用
  // const [page, setPage] = useState(1)
  // const [perpage, setPerpage] = useState(3)

  // -- * -- 新增開團用 -- * --
  // 設定揪團介紹的字數上限
  const [maxText, setMaxText] = useState('')
  const maxLength = 200
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

  // 揪團地區4個欄位的onChange觸發
  const handleCityChange = (city) => {
    setNewJoin({
      ...newJoin,
      address_city: city,
      address_district: '',
      gymType: '',
      place: '',
    })
  }
  const handleDistrictChange = (district) => {
    setNewJoin({
      ...newJoin,
      address_district: district,
      gymType: '',
      place: '',
    })
  }
  const handleGymTypeChange = (gymType) => {
    setNewJoin({
      ...newJoin,
      gymType: gymType,
      place: '',
    })
  }
  const handlePlaceChange = (place) => {
    setNewJoin({
      ...newJoin,
      place: place,
    })
  }

  // 檢查是否超過字數上限，用於設置文字顏色
  const textColor = maxText.length >= maxLength ? 'red' : 'black'

  // 最後得到的資料

  // 取得列表所有資料
  const [joins, setJoins] = useState([])
  // 取得單獨開團的資料
  const [joinInfo, setJoinInfo] = useState([])

  // 取得單獨團的格式化日期使用 (活動日期)
  const [formattedDate, setFormattedDate] = useState('')
  const [formattedTime, setFormattedTime] = useState('')
  // 取得單獨團的格式化日期使用 (截止日期)
  const [formattedDateEnd, setFormattedDateEnd] = useState('')
  const [formattedTimeEnd, setFormattedTimeEnd] = useState('')
  // 紀錄原始完整揪團資料
  const [originJoins, setOriginJoins] = useState([])
  // 紀錄即將截團(剩餘天數不到7天且人數未滿的)
  const [commingJoins, setCommingJoins] = useState([])
  // 紀錄揪團中的數量
  const [teamIngCount, setTeamIngCount] = useState(0)
  // 紀錄已成團的數量
  const [teamSuccessCount, setTeamSuccessCount] = useState(0)

  // 紀錄參加團的資料
  const [joinInInfo, setJoinInInfo] = useState({
    join_team_id: 0,
    user_id: 0,
    is_post: 0,
  })

  // 取得登入會員的id
  const { auth, setAuth } = useAuth()
  const { isAuth, userData } = auth
  const userId = auth.userData.id

  const [total, setTotal] = useState(0)
  const [pageCount, setPageCount] = useState(0)

  const [currentPage, setCurrentPage] = useState(1)
  const [shouldShowPagination, setShouldShowPagination] = useState(true)
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  const [isScroll, setIsScroll] = useState(false)

  // 處理分頁按鈕點擊事件
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }
  const pageSize = 12 //一頁有幾個揪團
  // 計算總頁數
  const totalPages = Math.ceil(joins.length / pageSize)

  // 計算顯示的揪團列表
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, joins.length)
  const visibleCourses = joins.slice(startIndex, endIndex)

  // 根據 isSmallScreen 狀態條件渲染數據列表
  const dataToShow = isSmallScreen ? joins : visibleCourses

  //分頁手機板隱藏
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(max-width: 575px)')

      // 處理媒體查詢變化
      function handleMediaQueryChange(event) {
        setShouldShowPagination(!event.matches) // 如果寬度小於 575 像素，設置 shouldShowPagination 為 false
        setIsSmallScreen(event.matches) // 如果寬度小於 575 像素，設置 isSmallScreen 為 true
        setIsScroll(true)
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

  // 取得每個團倒數天數的陣列(不使用這個/已改直接新增到資料物件裡)
  // const [deadline, setDeadline] = useState([])
  // 取得單獨團的倒數天數(不使用這個/已改直接新增到資料物件裡)
  // const [endDate, setEndDate] = useState('')

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
  const minDateTime = currentDateTime.add(2, 'days').format('YYYY-MM-DDTHH:mm')

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

    // 有選擇了圖片時才執行上傳
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

  const [isLoading, setIsLoading] = useState(true)
  const [isSameDate, setIsSameDate] = useState(false)

  // -- * -- 揪團列表用 (列表卡片們) -- * --
  // 獲得揪團所有卡片
  const getJoins = async (params = {}) => {
    // 用URLSearchParams產生查詢字串
    const searchParams = new URLSearchParams(params)
    const url = `http://localhost:3005/api/join?${searchParams.toString()}`

    try {
      const res = await fetch(url)
      const data = await res.json()

      if (data.status === 'success') {
        setTotal(data.data.total)
        setPageCount(data.data.pageCount)

        const updatedJoins = data.data.joins.map((join) => {
          const deadline = moment(join.deadline_date)
          const now = moment()

          // 比較年月日是否相同
          // const sameDate = now.isSame(deadline, 'day')

          const diffInMillis = deadline.diff(now) // 取得秒的差值
          const days = Math.floor(diffInMillis / (1000 * 60 * 60 * 24)) // 計算天數
          return { ...join, countDown: days } // 將 countDown 加到 join 物件裡
        })
        setJoins(updatedJoins)

        // 保存不受WHERE條件影響的所有資料
        const updatedOrigin = data.data.origins.map((join) => {
          const deadline = moment(join.deadline_date)
          const now = moment()
          const diffInMillis = deadline.diff(now) // 取得秒的差值
          const days = Math.floor(diffInMillis / (1000 * 60 * 60 * 24)) // 計算天數
          return { ...join, countDown: days } // 將 countDown 加到 join 物件裡
        })
        // console.log(updatedOrigin)

        setOriginJoins(updatedJoins) // 保存原始所有的開團資訊

        // 過濾出 countDown 小於等於 7 的資料
        const filteredJoins = updatedOrigin.filter(
          (join) =>
            join.countDown <= 7 &&
            join.countDown >= 0 &&
            join.members.length < join.total_member
        )
        setCommingJoins(filteredJoins) // 將符合條件的"即將截團"設定到useState

        // 得到揪團中的資料筆數
        const ing = updatedOrigin.filter(
          (join) =>
            join.countDown >= 0 && join.members.length < join.total_member
        )
        setTeamIngCount(ing.length) // 將符合條件的"揪團中"的數量設定到useState

        // 得到已成團的資料筆數
        const success = updatedOrigin.filter(
          (join) => join.members.length === join.total_member
        )
        setTeamSuccessCount(success.length) // 將符合條件的"已成團"的數量設定到另一個useState

        setTimeout(() => {
          setIsLoading(false)
        }, 50)
      }
    } catch (error) {
      console.log('讀取揪團失敗')
    }
  }

  useEffect(() => {
    getJoins()
  }, [router.isReady])

  const [activeState, setActiveState] = useState('全部')

  // 條件篩選用
  const handleState = (state, userId) => {
    setActiveState(state)
    if (state && state === '全部') {
      setJoins(originJoins)
    }
    if (state && state === '揪團中') {
      const teamIng = originJoins.filter(
        (join) => join.countDown >= 0 && join.members.length < join.total_member
      )
      setJoins(teamIng)
    }
    if (state && state === '已成團') {
      const teamSuccess = originJoins.filter(
        (join) =>
          (join.countDown > 0 && join.members.length === join.total_member) ||
          (join.countDown <= 0 && join.members.length === join.total_member)
      )
      setJoins(teamSuccess)
    }
    if (state && state === '我的揪團') {
      if (userId) {
        const myTeam = originJoins.filter(
          (join) =>
            join.members.filter((member) => member.user_id === userId).length >
            0
        )
        setJoins(myTeam)
      } else {
        Swal.fire({
          icon: 'error',
          title: '查詢我的揪團前請先登入',
        })
      }
    }
  }

  // 縣市篩選用
  const handleMiniCityChange = (e) => {
    const miniCity = e.target.value
    setCity(miniCity)
    const params = {
      city_name: miniCity,
    }
    setActiveState('全部')
    getJoins(params)
  }

  // -- * -- 獲取單筆揪團資料用 -- * --
  // 點擊揪團卡片時，得到對應id資料
  const handleCardClick = async (id, userId) => {
    // console.log(id)
    // console.log(userId)
    setJoinInInfo({
      ...joinInInfo,
      user_id: userId,
      join_team_id: id,
    })
    const url = `http://localhost:3005/api/join/${id}`
    const res = await fetch(url)
    const data = await res.json()

    const oneData = data.data.result[0]
    // console.log(oneData)

    // 計算單獨團的倒數時間
    const now = moment()
    const newdeadlineDate = moment(oneData.deadline_date)
    const diffInDays = newdeadlineDate.diff(now)
    const days = Math.floor(diffInDays / (1000 * 60 * 60 * 24))
    // console.log(endDate);

    // 使用 moment.js 將資料庫撈取的時間改成要用的格式 (活動日期)
    const newFormattedDate = moment(oneData.activity_date).format('YYYY-MM-DD')
    const newFormattedTime = moment(oneData.activity_date).format('HH:mm')
    setFormattedDate(newFormattedDate)
    setFormattedTime(newFormattedTime)

    // 使用 moment.js 將資料庫撈取的時間改成要用的格式 (截止日期)
    const newFormattedDateEnd = moment(oneData.deadline_date).format(
      'YYYY-MM-DD'
    )
    const newFormattedTimeEnd = moment(oneData.deadline_date).format('HH:mm')
    setFormattedDateEnd(newFormattedDateEnd)
    setFormattedTimeEnd(newFormattedTimeEnd)

    if (data.status === 'success') {
      setJoinInfo({
        ...oneData,
        countDown: days,
      })
    }
  }

  // 點擊參加揪團後，新增成員資料
  const handleJoinClick = async (userId, joinInfo) => {
    if (!userId) {
      Swal.fire({
        icon: 'error',
        title: '加入揪團前請先登入',
      })
      return
    } else {
      setJoinInInfo({
        ...joinInInfo,
        user_id: userId,
        is_post: 0,
      })
      // console.log(joinInInfo)
      const joinInCheck = joinInfo.members.find(
        (member) => member.user_id === userId
      )
      // console.log(joinInCheck)
      // 確認參加者原本沒有參加此團的話，就新增此會員到揪團資料裡
      if (!joinInCheck) {
        const res = await fetch('http://localhost:3005/api/join/joinIn', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(joinInInfo),
        })

        const data = await res.json()
        if (data.status === 'success') {
          Swal.fire({
            icon: 'success',
            title: '成功加入揪團!',
            showConfirmButton: false,
            timer: 1300,
          })

          try {
            const res2 = await fetch('http://localhost:3005/api/join')
            const data2 = await res2.json()

            if (data2.status === 'success') {
              const updatedJoins = data2.data.joins.map((join) => {
                const deadline = moment(join.deadline_date)
                const now = moment()
                const diffInMillis = deadline.diff(now) // 取得秒的差值
                const days = Math.floor(diffInMillis / (1000 * 60 * 60 * 24)) // 計算天數
                return { ...join, countDown: days } // 將 countDown 加到 join 物件裡
              })
              setJoins(updatedJoins)
            }
          } catch (error) {
            console.log('讀取揪團失敗')
          }

          const res3 = await fetch(
            `http://localhost:3005/api/join/${joinInfo.id}`
          )
          const data3 = await res3.json()
          const oneData = data3.data.result[0]

          // 計算單獨團的倒數時間
          const now = moment()
          const newdeadlineDate = moment(oneData.deadline_date)
          const diffInDays = newdeadlineDate.diff(now)
          const days = Math.floor(diffInDays / (1000 * 60 * 60 * 24))
          // console.log(endDate);

          // 使用 moment.js 將資料庫撈取的時間改成要用的格式 (活動日期)
          const newFormattedDate = moment(oneData.activity_date).format(
            'YYYY-MM-DD'
          )
          const newFormattedTime = moment(oneData.activity_date).format('HH:mm')
          setFormattedDate(newFormattedDate)
          setFormattedTime(newFormattedTime)

          // 使用 moment.js 將資料庫撈取的時間改成要用的格式 (截止日期)
          const newFormattedDateEnd = moment(oneData.deadline_date).format(
            'YYYY-MM-DD'
          )
          const newFormattedTimeEnd = moment(oneData.deadline_date).format(
            'HH:mm'
          )
          setFormattedDateEnd(newFormattedDateEnd)
          setFormattedTimeEnd(newFormattedTimeEnd)

          if (data3.status === 'success') {
            setJoinInfo({
              ...oneData,
              countDown: days,
            })
          }
        }
      }
    }
  }

  // useEffect(() => {
  //   getJoins()
  // }, [joinInfo])

  // 會員退出揪團用
  const deleteUserClick = async (join_team_user_id) => {
    const res = await fetch(
      `http://localhost:3005/api/join/teamUser/${join_team_user_id}`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      }
    )
    const data = await res.json()
    if (data.status === 'success') {
      Swal.fire({
        icon: 'success',
        title: '成功退出揪團',
        showConfirmButton: false,
        timer: 1000,
      })
      setTimeout(() => {
        window.location.href = 'http://localhost:3000/join'
      }, 300)
    } else {
      console.log(data.status)
    }
  }

  return (
    <>
      <div className={styles.topbg}>
        <div className={`container h-100 ${styles.topText}`}>
          <div className={styles['text-btn']}>
            <div className={`mb-5 ${styles['bold-text']}`}>
              <h3 className="mb-3">想打球但人數總是不夠嗎?</h3>
              <h3>揪團揪起來!</h3>
            </div>
            <div className="d-flex justify-content-center">
              <button
                type="button"
                className={`me-5 ${styles['btn-mydark']} ${styles['bold-text']}`}
                data-bs-toggle={userId > 0 ? 'modal' : ''}
                data-bs-target={userId > 0 ? '#ModalOpen' : ''}
                onClick={() => {
                  if (!userId) {
                    Swal.fire({
                      icon: 'error',
                      title: '新增開團前請先登入',
                    })
                  }
                }}
              >
                我要開團
              </button>

              <button
                className={`${styles['btn-mydark']} ${styles['bold-text']}`}
                type="button"
                onClick={handleScroll}
              >
                我要跟團
              </button>
            </div>
          </div>
        </div>
      </div>

      {userId > 0 && (
        <>
          {/* 我要開團 - modal */}
          <div
            className={`modal fade`}
            id="ModalOpen"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className={`modal-dialog modal-lg text-info ${styles.bodyMT}`}>
              <div className="modal-content px-3 pt-3">
                <button
                  type="button"
                  className="btn-close ms-auto"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
                <h1 className="modal-title fs-5 mx-auto" id="exampleModalLabel">
                  我要開團
                </h1>

                <div className="modal-body text-start px-4">
                  <form onSubmit={handleSubmit}>
                    <div className="">
                      <label htmlFor="teamName" className="col-form-label">
                        * 揪團名稱
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
                      <label htmlFor="joinDate" className="col-form-label">
                        * 揪團地點
                      </label>
                      <District
                        onCityChange={handleCityChange}
                        onDistrictChange={handleDistrictChange}
                        onGymTypeChange={handleGymTypeChange}
                        onPlaceChange={handlePlaceChange}
                      ></District>
                      <div
                        className={`mt-1 ${styles.miniText}`}
                        style={{ color: 'red', height: 21 }}
                      >
                        <p className="mb-0">{errors.place}</p>
                      </div>
                    </div>

                    <div className="">
                      <label htmlFor="joinDate" className="col-form-label">
                        * 揪團活動日期
                        <span className={styles.miniText}>
                          {' '}
                          (截止時間為活動日的前一天)
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
                      <label htmlFor="signUpDate" className="col-form-label">
                        * 報名截止日期
                      </label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        name="deadline_date"
                        defaultValue={newJoin.deadline_date}
                      />
                    </div>

                    <div className="">
                      <label htmlFor="teamPeople" className="col-form-label">
                        * 揪團人數{' '}
                        <span className={styles.miniText}> (需大於2人)</span>
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
                      <label htmlFor="joinText" className="col-form-label">
                        * 揪團介紹
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
                        <div style={{ color: textColor }} className="ms-auto">
                          <p className="mb-0">{`${maxText.length} / ${maxLength}`}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-2">
                      <label htmlFor="teamImg" className="col-form-label">
                        揪團圖片<span className={styles.miniText}> (選填)</span>
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
                    <div className="d-flex justify-content-between mb-1 mt-4">
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
        </>
      )}

      <section>
        {/* 顯示開團數 */}
        <div className="container d-flex flex-column align-items-center position-relative text-info">
          <div className={styles.teamtotal}>
            <div className={styles.ing}>
              <h2 className="mb-2 text-primary">
                {isLoading ? '--' : teamIngCount}
              </h2>
              <h3>揪團中</h3>
            </div>

            <div className={styles.end}>
              <h2 className="mb-2 text-primary">
                {isLoading ? '--' : teamSuccessCount}
              </h2>
              <h3>已成團</h3>
            </div>
          </div>
        </div>

        <div className="container text-info">
          <h2 className={`text-center ${styles['s1-title']}`}>近期揪團</h2>
          {/* 即將開團的slide */}
          {!isLoading && commingJoins.length === 0 && (
            <div className={`${styles.noInfo}`}>
              <h1 className="">- 目前尚無揪團 -</h1>
            </div>
          )}
          {isLoading && commingJoins.length === 0 && (
            <div className={`${styles.noInfo}`}></div>
          )}
          {commingJoins.length > 0 && (
            <Carousel
              swipeable={true}
              draggable={true}
              showDots={false}
              responsive={responsive}
              ssr={true} // means to render carousel on server-side.
              infinite={true}
              autoPlay={true}
              autoPlaySpeed={2000}
              keyBoardControl={true}
              customTransition="transform 300ms ease-in-out"
              transitionDuration={100}
              containerClass="slide "
              removeArrowOnDeviceType={['tablet', 'mobile']}
              dotListClass="custom-dot-list-style"
              itemClass={`d-flex justify-content-center gap-1`}
            >
              {commingJoins.map((v, i) => {
                const formattedDate = moment(v.activity_date).format(
                  'YYYY-MM-DD'
                )
                const formattedTime = moment(v.activity_date).format('HH:mm')
                return (
                  <div key={v.id} className="col-auto">
                    <div className={`mb-5 ${styles.joinCard}`}>
                      <Link
                        href=""
                        className={`text-decoration-none ${styles.aText}`}
                        data-bs-toggle="modal"
                        data-bs-target={`#ModalTeamInfo${joinInfo.id}`}
                        onClick={(e) => handleCardClick(v.id, userId)}
                      >
                        <img
                          src={`http://localhost:3005/uploads/${v.image}`}
                          className={styles.joinCardImgTop}
                          alt={`揪團卡片封面圖${v.image}`}
                        />
                        <div className={`text-center ${styles.cardPosition}`}>
                          <h6
                            className={`mb-1 text-white ${styles['bold-text']}`}
                          >
                            {v.members.map((member, j) => {
                              if (member.is_host === 1) {
                                return <div key={j}>{member.user_name}</div>
                              }
                            })}
                          </h6>
                          <div className={`${styles.circle} ${styles.avatar}`}>
                            {v.members.map((member, j) => {
                              if (member.is_host === 1) {
                                return (
                                  <img
                                    src={
                                      member.user_photo &&
                                      member.user_photo.includes('http')
                                        ? `${member.user_photo}`
                                        : `http://localhost:3005/uploads/${member.user_photo}`
                                    }
                                    alt={`主揪大頭照${member.user_photo}`}
                                    key={j}
                                  />
                                )
                              }
                            })}
                          </div>
                        </div>
                        <div className={styles.joinCardBody}>
                          <div style={{ display: 'none' }}>{v.id}</div>
                          <h5 className={`text-black ${styles.lineClampBox}`}>
                            {v.name}
                          </h5>
                          <h6>
                            {formattedDate} &nbsp;{formattedTime}
                          </h6>
                          <h6 className={`${styles.lineClampBox}`}>
                            {v.place_name}
                          </h6>
                          <div className="d-flex justify-content-between align-items-center mt-3">
                            <div
                              className="d-flex gap-1 justify-content-start flex-wrap overflow-hidden"
                              style={{ width: 210, height: 50 }}
                            >
                              {v.members.map((member, j) => {
                                if (member.is_host === 0) {
                                  return (
                                    <>
                                      <div
                                        key={j}
                                        className={`${styles.circle} ${styles.avatar}`}
                                      >
                                        <img
                                          src={
                                            member.user_photo &&
                                            member.user_photo.includes('http')
                                              ? `${member.user_photo}`
                                              : `http://localhost:3005/uploads/${member.user_photo}`
                                          }
                                          alt=""
                                        />
                                      </div>
                                    </>
                                  )
                                }
                                if (v.members.length === 1) {
                                  return (
                                    <div className="d-flex align-items-center text-secondary fw-bold">
                                      <p>- 目前無其他參與團員 -</p>
                                    </div>
                                  )
                                }
                              })}
                            </div>
                            <div className="text-end d-flex flex-column justify-content-center">
                              <h6 className="text-nowrap">
                                已揪&nbsp; / &nbsp;共需
                              </h6>
                              <h6 className="mb-0 text-nowrap">
                                <span className="">
                                  {v.members.length}人&nbsp;{' '}
                                </span>
                                / &nbsp;
                                {v.total_member}人
                              </h6>
                            </div>
                          </div>
                          {v.countDown > 0 &&
                            v.members.length < v.total_member && (
                              <h5 className="text-primary text-center mt-4">
                                剩餘 {v.countDown} 天 !
                              </h5>
                            )}
                          {v.countDown === 0 &&
                            v.members.length < v.total_member && (
                              <h5 className="text-primary text-center mt-4">
                                即將截團 !
                              </h5>
                            )}
                          {v.members.length === v.total_member && (
                            <h5 className="text-primary text-center mt-4">
                              - 已成團 -
                            </h5>
                          )}
                          {v.countDown < 0 &&
                            v.members.length < v.total_member && (
                              <h5 className="text-secondary text-center mt-4">
                                已截止 - 未成團
                              </h5>
                            )}
                        </div>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </Carousel>
          )}

          {/* Modal - 揪團詳細資訊 */}
          <div
            className={`modal fade`}
            id={`ModalTeamInfo${joinInfo.id}`}
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div
              className={`modal-dialog modal-lg text-info modal-dialog-scrollable`}
            >
              <div className={`modal-content pt-3`}>
                <div className="d-flex justify-content-end px-3 pb-3">
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>

                <div className="modal-body pt-0 px-4">
                  <div className="row">
                    <div className="col-sm-12 col-md-7 pt-1 mb-3">
                      <div className={styles.teamImg}>
                        <img
                          className={styles.objectFitCover}
                          src={`http://localhost:3005/uploads/${joinInfo.image}`}
                          alt={joinInfo.image}
                        />
                      </div>
                    </div>

                    <div className={`col-sm-12 col-md-5 ${styles.teamInfo}`}>
                      <h4 className="text-black text-wrap">{joinInfo.name}</h4>
                      <h5 className="text-black">揪團資訊</h5>
                      <div className="d-flex align-items-center mb-3">
                        {joinInfo &&
                          joinInfo.members &&
                          joinInfo.members.map((v, i) => {
                            if (v.is_host === 1) {
                              return (
                                <>
                                  <div
                                    className={`${styles.circle} ${styles.avatar}`}
                                  >
                                    <img
                                      key={i}
                                      src={
                                        v.user_photo &&
                                        v.user_photo.includes('http')
                                          ? `${v.user_photo}`
                                          : `http://localhost:3005/uploads/${v.user_photo}`
                                      }
                                      alt=""
                                    />
                                  </div>
                                  <h5 className="text-black ms-4 mb-0">
                                    {v.user_name}
                                  </h5>
                                </>
                              )
                            }
                          })}
                      </div>

                      <h6 className="">
                        {formattedDate} &nbsp;{formattedTime}
                      </h6>
                      <h6 className={` text-wrap ${styles['bold-text']}`}>
                        {joinInfo.place_name}
                      </h6>
                      <div className="d-flex justify-content-between">
                        <h6>已揪 / 共需 :</h6>
                        <h6>
                          <span>
                            {joinInfo && joinInfo.members
                              ? joinInfo.members.length
                              : 0}
                            人&nbsp;
                          </span>
                          / {joinInfo ? joinInfo.total_member : 0}人
                        </h6>
                      </div>
                      <p className={`mb-2 ${styles['bold-text']}`}>
                        報名截止時間 :
                      </p>

                      <h6 className="">
                        {formattedDateEnd} &nbsp;{formattedTimeEnd}
                      </h6>

                      {joinInfo &&
                        joinInfo.members &&
                        joinInfo.countDown > 0 &&
                        joinInfo.members.length < joinInfo.total_member && (
                          <h6 className="text-primary">
                            剩餘 {joinInfo.countDown} 天 !
                          </h6>
                        )}
                      {joinInfo &&
                        joinInfo.members &&
                        joinInfo.countDown === 0 &&
                        joinInfo.members.length < joinInfo.total_member && (
                          <h6 className="text-primary">即將截團 !</h6>
                        )}
                      {joinInfo &&
                        joinInfo.members &&
                        joinInfo.members.length === joinInfo.total_member && (
                          <h6 className="text-primary">- 已成團 -</h6>
                        )}
                      {joinInfo &&
                        joinInfo.members &&
                        joinInfo.countDown < 0 &&
                        joinInfo.members.length < joinInfo.total_member && (
                          <h6 className="text-secondary">已截止 - 未成團</h6>
                        )}
                    </div>

                    <div className="col-sm-12 col-md-7 mb-2">
                      <div>
                        <h5 className="text-black mb-2 mt-2">揪團介紹</h5>
                        <p className={styles.lineHeight}>
                          {joinInfo.description}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`col-sm-12 col-md-5 mb-3 ${styles.teamInfo}`}
                    >
                      <h5 className="text-black mb-3">揪團成員</h5>
                      <div className="d-flex justify-content-start flex-wrap gap-2">
                        {joinInfo &&
                          joinInfo.members &&
                          joinInfo.members.map((v, i) => {
                            if (v.is_host === 0) {
                              return (
                                <>
                                  <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip>{v.user_name}</Tooltip>}
                                  >
                                    <div
                                      className={`${styles.circle} ${styles.avatar}`}
                                    >
                                      <img
                                        key={i}
                                        src={
                                          v.user_photo &&
                                          v.user_photo.includes('http')
                                            ? `${v.user_photo}`
                                            : `http://localhost:3005/uploads/${v.user_photo}`
                                        }
                                        alt=""
                                      />
                                    </div>
                                  </OverlayTrigger>
                                </>
                              )
                            }
                            if (joinInfo.members.length === 1) {
                              return <p>- 目前無其他參與團員 -</p>
                            }
                          })}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`d-flex justify-content-between modal-footer ${styles.noBorderTop}`}
                >
                  <button
                    type="button"
                    className="btn btn-secondary border"
                    data-bs-dismiss="modal"
                  >
                    取消
                  </button>

                  {/* 在人數還沒額滿時 */}
                  {joinInfo.members &&
                    joinInfo.members.length < joinInfo.total_member && (
                      <>
                        {/* 如果時間已經截止了 */}
                        {joinInfo.countDown < 0 && (
                          <button
                            type="button"
                            className="btn btn-secondary"
                            disabled
                          >
                            已截止
                          </button>
                        )}

                        {/* 如果會員本人是此團主揪 */}
                        {joinInfo.countDown > 0 &&
                          joinInfo.members.find(
                            (member) =>
                              member.user_id === userId && member.is_host === 1
                          ) && (
                            <>
                              <div className="d-flex align-items-center text-primary">
                                <h6>等待其他成員加入···</h6>
                              </div>
                            </>
                          )}

                        {/* 如果會員本身已加入揪團，且時間還沒截止*/}
                        {joinInfo.countDown >= 0 &&
                          joinInfo.members.find(
                            (member) =>
                              member.user_id === userId && member.is_host === 0
                          ) && (
                            <button
                              type="button"
                              className="btn btn-secondary"
                              data-bs-toggle="modal"
                              data-bs-target={`#exampleModalDelete${
                                joinInfo.members.find(
                                  (member) =>
                                    member.user_id === userId &&
                                    member.is_host === 0
                                ).join_team_user_id
                              }`}
                            >
                              退出揪團
                            </button>
                          )}
                        {/* 如果會員尚未加入此團 */}
                        {joinInfo.countDown >= 0 &&
                          !joinInfo.members.find(
                            (member) => member.user_id === userId
                          ) && (
                            <button
                              type="button"
                              className="btn btn-primary text-white"
                              onClick={(e) => handleJoinClick(userId, joinInfo)}
                            >
                              參加揪團
                            </button>
                          )}
                      </>
                    )}

                  {/* 如果會員本人是此團主揪，且人數已達標成團 */}
                  {joinInfo.members &&
                    joinInfo.members.length === joinInfo.total_member &&
                    joinInfo.members.some(
                      (member) =>
                        member.user_id === userId && member.is_host === 1
                    ) && (
                      <>
                        <div className="d-flex align-items-center text-primary">
                          <h6>人數已額滿，成功揪團 !</h6>
                        </div>
                      </>
                    )}

                  {/* 如果此團人數已額滿，且查看詳細的會員本來就沒有加入此團 */}
                  {joinInfo.members &&
                    joinInfo.members.length === joinInfo.total_member &&
                    !joinInfo.members.some(
                      (member) => member.user_id === userId
                    ) && (
                      <button
                        type="button"
                        className="btn btn-secondary text-white"
                        disabled={true}
                      >
                        已額滿
                      </button>
                    )}

                  {/* 如果此團人數已額滿，在時間截止前，會員本身是已經在此團 */}
                  {joinInfo.members &&
                    joinInfo.countDown >= 0 &&
                    joinInfo.members.length === joinInfo.total_member &&
                    joinInfo.members.find(
                      (member) =>
                        member.user_id === userId && member.is_host === 0
                    ) && (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-toggle="modal"
                        data-bs-target={`#exampleModalDelete${
                          joinInfo.members.find(
                            (member) =>
                              member.user_id === userId && member.is_host === 0
                          ).join_team_user_id
                        }`}
                      >
                        退出揪團
                      </button>
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* Modal - 確認是否取消揪團的提醒 */}
          {joinInfo.members &&
            joinInfo.members.find(
              (member) => member.user_id === userId && member.is_host === 0
            ) &&
            joinInfo.members.map((member) => (
              <div
                key={member.join_team_user_id}
                className="modal fade"
                id={`exampleModalDelete${member.join_team_user_id}`}
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content">
                    <div class="d-flex justify-content-between px-4 py-3">
                      <h1
                        class="modal-title fs-5 text-primary"
                        id="exampleModalLabel"
                      >
                        取消揪團 ?
                      </h1>
                      <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div class="modal-body px-4 mb-2">
                      <h5>確定要退出這個揪團嗎?</h5>
                    </div>
                    <div class="d-flex justify-content-between px-4 py-3">
                      <button
                        type="button"
                        class="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        取消
                      </button>
                      <button
                        type="button"
                        class="btn btn-primary text-white"
                        onClick={() => {
                          deleteUserClick(member.join_team_user_id)
                        }}
                        data-bs-dismiss="modal"
                      >
                        確認退出
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* 條件篩選 */}
      <section className="mt-3 text-info">
        <div className="container">
          <div className="d-flex justify-content-center mb-2">
            <ul className="nav nav-underline mt-2 mb-3 text-center mx-auto">
              <button
                className={`nav-link text-secondary ${
                  activeState === '全部' ? `active` : ''
                }`}
                onClick={() => {
                  handleState('全部')
                  setCurrentPage(1)
                }}
              >
                <li className={`nav-item ${styles.navItem}`}>
                  <h5>全部</h5>
                </li>
              </button>
              <button
                className={`nav-link text-secondary ${
                  activeState === '揪團中' ? `active` : ''
                }`}
                onClick={() => {
                  handleState('揪團中')
                  setCurrentPage(1)
                }}
              >
                <li className={`nav-item ${styles.navItem}`}>
                  <h5>揪團中</h5>
                </li>
              </button>
              <button
                className={`nav-link text-secondary ${
                  activeState === '已成團' ? `active` : ''
                }`}
                onClick={() => {
                  handleState('已成團')
                  setCurrentPage(1)
                }}
              >
                <li className={`nav-item ${styles.navItem}`}>
                  <h5>已成團</h5>
                </li>
              </button>

              {userId > 0 && (
                <>
                  <button
                    className={`nav-link text-secondary ${
                      activeState === '我的揪團' ? `active` : ''
                    }`}
                    onClick={() => {
                      handleState('我的揪團', userId)
                      setCurrentPage(1)
                    }}
                  >
                    <li className={`nav-item ${styles.navItem}`}>
                      <h5>我的揪團</h5>
                    </li>
                  </button>
                </>
              )}
            </ul>
          </div>

          <div className={`d-flex justify-content-end pe-2 ${styles.area}`}>
            <select
              className="form-select rounded-0 mb-3"
              style={{ width: 150 }}
              aria-label="Default select example"
              onChange={(e) => {
                handleMiniCityChange(e)
                setCurrentPage(1)
              }}
              value={city}
            >
              <option defaultValue value="">
                請選擇縣市
              </option>
              {twCity.map((city, i) => {
                return (
                  <option key={i} value={city.name}>
                    {city.name}
                  </option>
                )
              })}
            </select>
          </div>

          <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4">
            {/* 開團卡片列表 */}
            {!isLoading && dataToShow.length === 0 && (
              <div className={`${styles.noInfo}`}>
                <h1 className="">- 目前尚無揪團 -</h1>
              </div>
            )}
            {isLoading && dataToShow.length === 0 && (
              <div className={`${styles.noInfo}`}></div>
            )}
            {dataToShow.length > 0 &&
              dataToShow.map((v, i) => {
                // 使用 moment.js 將資料庫撈取的時間改成要用的格式
                const formattedDate = moment(v.activity_date).format(
                  'YYYY-MM-DD'
                )
                const formattedTime = moment(v.activity_date).format('HH:mm')
                return (
                  <div key={v.id} className="col">
                    <div className={`mb-5 ${styles.joinCard}`}>
                      <Link
                        href=""
                        className={`text-decoration-none ${styles.aText}`}
                        data-bs-toggle="modal"
                        data-bs-target={`#ModalTeamInfo${joinInfo.id}`}
                        onClick={(e) => handleCardClick(v.id, userId)}
                      >
                        <img
                          src={`http://localhost:3005/uploads/${v.image}`}
                          className={styles.joinCardImgTop}
                          alt={`揪團卡片封面圖${v.image}`}
                        />
                        <div className={`text-center ${styles.cardPosition}`}>
                          <h6
                            className={`mb-1 text-white ${styles['bold-text']}`}
                          >
                            {v.members.map((member, j) => {
                              if (member.is_host === 1) {
                                return <div key={j}>{member.user_name}</div>
                              }
                            })}
                          </h6>
                          <div className={`${styles.circle} ${styles.avatar}`}>
                            {v.members.map((member, j) => {
                              if (member.is_host === 1) {
                                return (
                                  <img
                                    src={
                                      member.user_photo &&
                                      member.user_photo.includes('http')
                                        ? `${member.user_photo}`
                                        : `http://localhost:3005/uploads/${member.user_photo}`
                                    }
                                    alt={`主揪大頭照${member.user_photo}`}
                                    key={j}
                                  />
                                )
                              }
                            })}
                          </div>
                        </div>
                        <div className={styles.joinCardBody}>
                          <div style={{ display: 'none' }}>{v.id}</div>
                          <h5 className={`text-black ${styles.lineClampBox}`}>
                            {v.name}
                          </h5>
                          <h6>
                            {formattedDate} &nbsp;{formattedTime}
                          </h6>
                          <h6 className={`${styles.lineClampBox}`}>
                            {v.place_name}
                          </h6>
                          <div className="d-flex justify-content-between align-items-center mt-3">
                            <div
                              className="d-flex gap-1 justify-content-start flex-wrap overflow-hidden"
                              style={{ width: 210, height: 50 }}
                            >
                              {v.members.map((member, j) => {
                                if (member.is_host === 0) {
                                  return (
                                    <>
                                      <div
                                        key={j}
                                        className={`${styles.circle} ${styles.avatar}`}
                                      >
                                        <img
                                          src={
                                            member.user_photo &&
                                            member.user_photo.includes('http')
                                              ? `${member.user_photo}`
                                              : `http://localhost:3005/uploads/${member.user_photo}`
                                          }
                                          alt=""
                                        />
                                      </div>
                                    </>
                                  )
                                }
                                if (v.members.length === 1) {
                                  return (
                                    <div className="d-flex align-items-center text-secondary fw-bold">
                                      <p>- 目前無其他參與團員 -</p>
                                    </div>
                                  )
                                }
                              })}
                            </div>
                            <div className="text-end d-flex flex-column justify-content-center">
                              <h6 className="text-nowrap">
                                已揪&nbsp; / &nbsp;共需
                              </h6>
                              <h6 className="mb-0 text-nowrap">
                                <span className="">
                                  {v.members.length}人&nbsp;{' '}
                                </span>
                                / &nbsp;
                                {v.total_member}人
                              </h6>
                            </div>
                          </div>
                          {v.countDown > 0 &&
                            v.members.length < v.total_member && (
                              <h5 className="text-primary text-center mt-4">
                                剩餘 {v.countDown} 天 !
                              </h5>
                            )}
                          {v.countDown === 0 &&
                            v.members.length < v.total_member && (
                              <h5 className="text-primary text-center mt-4">
                                即將截團 !
                              </h5>
                            )}
                          {v.members.length === v.total_member && (
                            <h5 className="text-primary text-center mt-4">
                              - 已成團 -
                            </h5>
                          )}
                          {v.countDown < 0 &&
                            v.members.length < v.total_member && (
                              <h5 className="text-secondary text-center mt-4">
                                已截止 - 未成團
                              </h5>
                            )}
                        </div>
                      </Link>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </section>

      {shouldShowPagination && (
        <div className="d-flex justify-content-center my-5 ">
          <nav aria-label="Page navigation example d-flex justify-content-center">
            <ul className="mt-5 pagination d-flex justify-content-center">
              {/* 上一頁按鈕 */}
              <li
                className={`page-item ps-2 me-2 ${
                  currentPage === 1 ? 'd-none' : ''
                }`}
              >
                <a
                  className="page-link rounded-0"
                  href="#"
                  aria-label="Previous"
                  onClick={(event) => {
                    event.preventDefault()
                    handlePageChange(currentPage - 1)
                    window.scrollTo({ top: 1400, behavior: 'smooth' }) // 滾動到頁面頂部
                  }}
                >
                  <span aria-hidden="true">
                    <BiSolidLeftArrow />
                  </span>
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
                  (currentPage >= totalPages - 2 && page >= totalPages - 4) // 目前頁面在後五頁
                ) {
                  return (
                    <li
                      key={page}
                      className={`page-item mx-2 ${
                        currentPage === page ? 'active' : ''
                      }`}
                    >
                      <a
                        className={`page-link`}
                        href="#"
                        onClick={(event) => {
                          event.preventDefault()
                          handlePageChange(page)
                          window.scrollTo({ top: 1400, behavior: 'smooth' })
                        }}
                      >
                        {page}
                      </a>
                    </li>
                  )
                } else if (
                  (currentPage > 3 && page === 2) || // 省略號前面的頁碼
                  (currentPage < totalPages - 2 && page === totalPages - 1) // 省略號後面的頁碼
                ) {
                  return (
                    <li key={page} className={`page-item disabled`}>
                      <a
                        className={`page-link`}
                        href="#"
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
                  currentPage === totalPages ? 'disabled' : ''
                }`}
              >
                <a
                  className="page-link rounded-0"
                  href="#"
                  aria-label="Next"
                  onClick={(event) => {
                    event.preventDefault()
                    handlePageChange(currentPage + 1)
                    window.scrollTo({ top: 1400, behavior: 'smooth' })
                  }}
                >
                  <span aria-hidden="true">
                    <BiSolidRightArrow />
                  </span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </>
  )
}
