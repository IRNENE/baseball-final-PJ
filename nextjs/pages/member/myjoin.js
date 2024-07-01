import React, { useState, useEffect } from 'react'
import styles from '@/styles/style_lai.module.css'
import styles4 from '@/styles/join/join_list.module.css'
import Sidebar from '@/components/sidebar/sidebar'
import { GoTriangleRight, GoTriangleLeft } from 'react-icons/go'
import { FaRegHeart } from 'react-icons/fa' // 引入 Heart 的使用者圖標(空心)
import { FaHeart } from 'react-icons/fa' // 引入 Heart 的使用者圖標(實心)
import Link from 'next/link'
import { initUserData, useAuth } from '@/hooks/use-auth'
import moment from 'moment';
import { BiSolidLeftArrow, BiSolidRightArrow } from 'react-icons/bi';

export default function Myjoin() {
  const { auth, setAuth } = useAuth()
  const { isAuth, userData } = auth
  const [myjoin, setMyjoin] = useState([])
  const [tab, setTab] = useState('open') // 新增一個 state 來記錄當前所選標籤

  const myjoinOpen = myjoin.filter(e => e.is_host === 1 && e.user_id === userData.id)
  console.log(myjoinOpen)
  const myjoinFollow = myjoin.filter(e => e.is_host === 0 && e.user_id === userData.id)
  console.log(myjoinFollow);

  const [deadline, setDeadline] = useState([])   // 取得每個團倒數天數的陣列
  const currentDateTime = moment(); // 取得當下時間
  const minDateTime = currentDateTime.add(1, 'days').format('YYYY-MM-DDTHH:mm'); // 加上一天

  const [currentPage, setCurrentPage] = useState(1); // 目前所在的頁碼
  const itemsPerPage = 6; // 每頁顯示的項目數量
  const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentMyjoinOpen = myjoinOpen.slice(indexOfFirstProduct, indexOfLastProduct);
    const currentMyjoinFollow = myjoinFollow.slice(indexOfFirstProduct, indexOfLastProduct);
  const [shouldShowPagination, setShouldShowPagination] = useState(true)
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const totalPageCount = Math.ceil( myjoinOpen.length / itemsPerPage);
  const totalPageCount2 = Math.ceil(myjoinFollow.length / itemsPerPage);


  const fetchMyjoin = () => {
    const url = `http://localhost:3005/api/member-center/myjoin-open/${userData.id}`
    // 使用 fetch 方法向後端發送 GET 請求
    fetch(url)
      .then((response) => {
        // 檢查 HTTP 狀態碼
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        // 解析 JSON 格式的回應
        return response.json()
      })
      .then((data) => {
        // 處理從後端獲取到的資料
        console.log('抓取此會員的開團列表...')
        

        if (Array.isArray(data.data.joins)) {
          const updatedJoins = data.data.joins.map((join) => {
            const deadline = moment(join.deadline_date)
            const now = moment()
            const diffInMillis = deadline.diff(now) // 取得毫秒的差值
            const days = Math.floor(diffInMillis / (1000 * 60 * 60 * 24)) // 計算天數
            return { ...join, countDown: days } // 將 countDown 加到 join 物件裡
          })
          setMyjoin(updatedJoins) //將揪團清單設置為後端獲取到的資料
        
          // // 計算倒數時間
          // const now = moment()

          // const newDeadlines = data.data.joins.map((v, i) => {
          //   const deadline = moment(v.deadline_date)
          //   const diffInMillis = deadline.diff(now) // 得到毫秒差值

          //   // 計算天、小時和分
          //   const days = Math.floor(diffInMillis / (1000 * 60 * 60 * 24))
          //   console.log(days)
          //   // 得到每個團剩餘天數
          //   return days
          // })
          // console.log(newDeadlines)
          // setDeadline(newDeadlines)
        }
      })
      .catch((error) => {
        // 處理錯誤
        console.error('There was a problem with your fetch operation:', error)
      })
  }

  useEffect(() => {
    fetchMyjoin()
  }, [userData.id, tab]) //useEffect 的依賴項(會員id切換  才會重新渲染)

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
const visibleCourses = myjoinOpen.slice(indexOfFirstProduct, indexOfLastProduct)
const dataToShow = isSmallScreen ? myjoinOpen : visibleCourses
const visibleCourses2 =  myjoinFollow.slice(indexOfFirstProduct, indexOfLastProduct)
const dataToShow2 = isSmallScreen ?  myjoinFollow : visibleCourses2

  return (
    <>
      <div className={`${styles.containerRWD} container`}>
        <div className="row">
          <div className={`${styles.boxMargin} col-12 col-sm-3`}>
            <h5 className="ms-2">
              會員中心 /{' '}
              <a className={styles.noBottom} href="">
                <span className={styles.bread}>我的揪團</span>
              </a>
            </h5>
          </div>
          <div className={`${styles.tabsMargin} col-12  col-sm-9 pt-3`}>
            <ul
              className={`${styles.ulBorder} list-unstyled d-flex justify-content-around text-center`}
            >
              <div
                className={`${tab === 'open' ? styles.active3 : ''}`}
                onClick={() => setTab('open')}
                style={{ width: '528px' }}
              >
                {' '}
                <li className="pb-2">
                  <Link className={styles.noBottom} href="">
                    我的開團
                  </Link>
                </li>{' '}
              </div>
              <div
                className={`${tab === 'follow' ? styles.active3 : ''}`}
                onClick={() => setTab('follow')}
                style={{ width: '528px' }}
              >
                {' '}
                <li className="pb-2">
                  <Link className={styles.noBottom} href="">
                    我的跟團
                  </Link>
                </li>
              </div>
            </ul>
          </div>
        </div>
        <div className="row">
          <Sidebar />
          <div className={`${styles.rwdMargin} col-12 col-sm-9 py-2`}>
            <div className="row">
              {tab === 'open' &&
                myjoinOpen
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  )
                  .map((v, i) => {
                    return (
                      <div
                        key={v.id}
                        className={`${styles4.joinCard} col-12 col-sm-4 py-2 d-flex`}
                      >
                        <a
                          href="/join"
                          className={`text-decoration-none ${styles4.aText}`}
                          // data-bs-toggle="modal"
                          // data-bs-target="#ModalTeamInfo"
                        >
                          <img
                            src={`http://localhost:3005/uploads/${v.image}`}
                            className={styles4.joinCardImgTop}
                            alt="揪團卡片封面圖"
                          />
                          <div
                            className={`text-center ${styles4.cardPosition}`}
                          >
                            <h6
                              className={`mb-1 text-white ${styles4['bold-text']}`}
                            >
                              {v.userName}
                            </h6>
                            <div
                              className={`${styles4.circle} ${styles4.avatar}`}
                            >
                              <img
                                src={v.photo &&
                                      v.photo.includes('http')
                                        ? `${v.photo}`
                                        : `http://localhost:3005/uploads/${v.photo}`}
                                alt="主揪大頭照"
                              />
                            </div>
                          </div>
                          <div className={styles4.joinCardBody}>
                            <h4 className="text-black">{v.name}</h4>
                            <h6>{v.activity_date}</h6>
                            <h6>{v.place_name}</h6>
                            <div>
                              <div className={`bg-primary text-light mx-5`}>
                                {v.countDown > 0 &&
                                  v.members.length < v.total_member && ( // 使用 v.members?.length 確保 members 屬性存在並且是陣列
                                    <h5 className="text-light text-center mt-4 py-2">
                                      剩餘 {v.countDown} 天 !
                                    </h5>
                                  )}
                                {v.countDown === 0 &&
                                  v.members.length < v.total_member && (
                                    <h5 className="text-light text-center mt-4 py-2">
                                      今日即將截團 !
                                    </h5>
                                  )}
                                {v.members.length === v.total_member && (
                                  <h5 className="text-light text-center mt-4 py-2">
                                    已成團 !
                                  </h5>
                                )}
                                {v.countDown < 0 &&
                                  v.members.length < v.total_member && (
                                    <h5 className="text-light text-center mt-4 py-2">
                                      已截止 - 未成團
                                    </h5>
                                  )}
                                {v.countDown < 0 &&
                                  v.members.length > v.total_member && (
                                    <h5 className="text-light text-center mt-4 py-2">
                                      已截止 - 已成團 !
                                    </h5>
                                  )}
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                    )
                  })}
              {tab === 'follow' &&
                myjoinFollow
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  )
                  .map((v, i) => {
                    return (
                      <div
                        key={v.id}
                        className={`${styles4.joinCard} col-12 col-sm-4 py-2 d-flex`}
                      >
                        <a
                          href="/join"
                          className={`text-decoration-none ${styles4.aText}`}
                          // data-bs-toggle="modal"
                          // data-bs-target="#ModalTeamInfo"
                        >
                          <img
                            src={`http://localhost:3005/uploads/${v.image}`}
                            className={styles4.joinCardImgTop}
                            alt="揪團卡片封面圖"
                          />
                          <div
                            className={`text-center ${styles4.cardPosition}`}
                          >
                            <h6
                              className={`mb-1 text-white ${styles4['bold-text']}`}
                            >
                              {v.members.map((member, j) => {
                                if (member.is_host === 1) {
                                  return <div key={j}>{member.user_name}</div>
                                }
                              })}
                            </h6>
                            <div
                              className={`${styles4.circle} ${styles4.avatar}`}
                            >
                              {v.members.map((member, j) => {
                                if (member.is_host === 1) {
                                  return (
                                    <img
                                      src={member.user_photo &&
                                      member.user_photo.includes('http')
                                        ? `${member.user_photo}`
                                        : `http://localhost:3005/uploads/${member.user_photo}`}
                                      alt={`主揪大頭照${member.user_photo}`}
                                      key={j}
                                    />
                                  )
                                }
                              })}
                            </div>
                          </div>
                          <div className={styles4.joinCardBody}>
                            <h4 className="text-black">{v.name}</h4>
                            <h6>{v.activity_date}</h6>
                            <h6>{v.place_name}</h6>
                            <div>
                              <div className={`bg-primary text-light mx-5`}>
                                {v.countDown > 0 &&
                                  v.members.length < v.total_member && ( // 使用 v.members?.length 確保 members 屬性存在並且是陣列
                                    <h5 className="text-light text-center mt-4 py-2">
                                      剩餘 {v.countDown} 天 !
                                    </h5>
                                  )}
                                {v.countDown === 0 &&
                                  v.members.length < v.total_member && (
                                    <h5 className="text-light text-center mt-4 py-2">
                                      今日即將截團 !
                                    </h5>
                                  )}
                                {v.members.length === v.total_member && (
                                  <h5 className="text-light text-center mt-4 py-2">
                                    已成團 !
                                  </h5>
                                )}
                                {v.countDown < 0 &&
                                  v.members.length < v.total_member && (
                                    <h5 className="text-light text-center mt-4 py-2">
                                      已截止 - 未成團
                                    </h5>
                                  )}
                                {v.countDown < 0 &&
                                  v.members.length > v.total_member && (
                                    <h5 className="text-light text-center mt-4 py-2">
                                      已截止 - 已成團 !
                                    </h5>
                                  )}
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                    )
                  })}
            </div>
          </div>
          <div className="col-3" />
          {shouldShowPagination && (
          <ul className={`${styles.noneRWD} pagination justify-content-center py-3 col-9`}>
           {/* 上一頁按鈕 */}
           <li
                                            className={`page-item ps-2 ${styles.pages1} ${currentPage === 1 ? 'd-none' : ''
                                                }`}
                                        >
                                            <a
                                                className="page-link rounded-0"
                                                href="#"
                                                aria-label="Previous"
                                                onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}
                                            >
                                                 <span aria-hidden="true"><BiSolidLeftArrow /></span>
                                            </a>
                                        </li>

                                        {/* 頁碼按鈕 */}
                                        {Array.from({ length: Math.ceil((tab === 'open' ? myjoinOpen.length : myjoinFollow.length) / itemsPerPage) }).map((_, index) => {
                                            const page = index + 1
                                            if (
                                                page === 1 || // 第一頁
                                                page === currentPage || // 目前頁面
                                                page === Math.ceil((tab === 'open' ? myjoinOpen.length : myjoinFollow.length) / itemsPerPage) || // 最後一頁
                                                Math.abs(currentPage - page) <= 1 || // 相鄰頁面
                                                (currentPage <= 3 && page <= 5) || // 目前頁面在前五頁
                                                (currentPage >= Math.ceil((tab === 'open' ? myjoinOpen.length : myjoinFollow.length) / itemsPerPage) - 2 &&
                                                    page >= Math.ceil((tab === 'open' ? myjoinOpen.length : myjoinFollow.length) / itemsPerPage) - 4) // 目前頁面在後五頁
                                            ) {
                                                return (
                                                    <li
                                                        key={page}
                                                        className={`page-item ${currentPage === page ? 'active' : ''
                                                            }`}
                                                    >
                                                        <a
                                                            className={`page-link ${styles.pages1}`}
                                                            href="#"
                                                            onClick={() => setCurrentPage(index + 1)}
                                                        >
                                                            {page}
                                                        </a>
                                                    </li>
                                                )
                                            } else if (
                                                (currentPage > 3 && page === 2) || // 省略號前面的頁碼
                                                (currentPage < Math.ceil((tab === 'open' ? myjoinOpen.length : myjoinFollow.length) / itemsPerPage) - 2 &&
                                                    page === Math.ceil((tab === 'open' ? myjoinOpen.length : myjoinFollow.length) / itemsPerPage) - 1) // 省略號後面的頁碼
                                            ) {
                                                return (
                                                    <li key={page} className={`page-item disabled`}>
                                                        <a
                                                            className={`page-link ${styles.pages1}`}
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
                                            className={`page-item pb-1 ps-2 ${currentPage === Math.ceil((tab === 'open' ? myjoinOpen.length : myjoinFollow.length) / itemsPerPage) ? 'disabled' : ''
                                                }`}
                                        >
                                            <a
                                                className="page-link rounded-0"
                                                href="#"
                                                aria-label="Next"
                                                onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === Math.ceil((tab === 'open' ? myjoinOpen.length : myjoinFollow.length) / itemsPerPage)}
                                            >
                                                <span aria-hidden="true"><BiSolidRightArrow /></span>
                                            </a>
                                        </li>
            {/* <li className="page-item">
              <span className="page-link" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                <GoTriangleLeft />
              </span>
            </li>
            {Array.from({
              length: Math.ceil(
                (tab === 'open' ? myjoinOpen.length : myjoinFollow.length) /
                  itemsPerPage
              ),
            }).map((_, index) => (
              <li
                key={index}
                className={`page-item ${
                  currentPage === index + 1 ? 'active' : ''
                }`}
              >
                <a
                  className="page-link"
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </a>
              </li>
            ))}
            <li className="page-item">
              <a
                className="page-link"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={
                  currentPage ===
                  Math.ceil(
                    (tab === 'open' ? myjoinOpen.length : myjoinFollow.length) /
                      itemsPerPage
                  )
                }
              >
                <GoTriangleRight />
              </a>
            </li> */}
          </ul>
          )}
        </div>
      </div>
    </>
  )
}
