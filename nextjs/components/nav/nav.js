import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import useFirebase from '@/hooks/use-firebase'
import { GoPerson } from 'react-icons/go'
import { PiShoppingCart } from 'react-icons/pi'
import { FaBars } from 'react-icons/fa'
import { CiSearch } from 'react-icons/ci'
import { IoClose } from 'react-icons/io5'
import styles from './nav.module.css'
import Link from 'next/link'
import NavM from './navM'
import Swal from 'sweetalert2'
import { initUserData, useAuth } from '@/hooks/use-auth'

export default function Nav() {
  // 手機板nav用
  const [navM, setNavM] = useState(false)
  const [bar, setBar] = useState(<FaBars />)
  // nav下的hover子類別用
  const [activeSub, setActiveSub] = useState(null)
  // 頭像點擊用
  const [accountOpen, setAccountOpen] = useState(false)
  // 搜索點擊用
  const [searchOpen, setSearchOpen] = useState(false)

  // 判斷當nav是否active用
  const router = useRouter()
  const [isActiveHome, setIsActiveHome] = useState(false)
  const [isActiveArticle, setIsActiveArticle] = useState(false)
  const [isActiveCourse, setIsActiveCourse] = useState(false)
  const [isActiveProduct, setIsActiveProduct] = useState(false)
  const [isActiveRent, setIsActiveRent] = useState(false)
  const [isActiveJoin, setIsActiveJoin] = useState(false)
  const [isActivePlace, setIsActivePlace] = useState(false)
  const [shoppingCartLength, setShoppingCartLength] = useState(0)
  const [isActiveTeacher, setIsActiveTeacher] = useState(false)
  // 登入用(全域與google)
  const { auth, setAuth } = useAuth()
  const { isAuth, userData } = auth
  const { logoutFirebase } = useFirebase()

  // 判斷當路徑含有特定名稱，將nav設active
  useEffect(() => {
    setIsActiveHome(router.pathname === '/')
    setIsActiveArticle(router.pathname.includes('article'))
    setIsActiveCourse(router.pathname.includes('course'))
    setIsActiveProduct(router.pathname.includes('product'))
    setIsActiveRent(router.pathname.includes('rent'))
    setIsActiveJoin(router.pathname.includes('join'))
    setIsActiveTeacher(router.pathname.includes('teacher'))
    setIsActivePlace(router.pathname.includes('place'))
  }, [router.pathname])

  // 點擊手機nav的bar icon切換
  function handleNavM() {
    setNavM(!navM)
    setBar(navM ? <FaBars /> : <IoClose />)
  }

  // nav hover用
  // function handleMouseEnter(type) {
  //   setActiveSub(type)
  // }
  // function handleMouseLeave() {
  //   setActiveSub(null)
  // }

  // 頭像用
  function handelAccountOpen() {
    setAccountOpen(!accountOpen)
  }
  function handleSearchOpen() {
    setSearchOpen(!searchOpen)
    setSearchError('')
    setSearchContent('')
  }

  // 登出用
  const handleLogout = async () => {
    logoutFirebase()
    if (userData.line_uid) {
      const res = await fetch(
        `http://localhost:3005/api/line-login/logout?line_uid=${userData.line_uid}`,
        {
          credentials: 'include',
        }
      ).then((res) => res.json())
      if (res.status === 'success') {
        setAuth({
          isAuth: false,
          userData: initUserData,
        })
        Swal.fire({
          // position: "top-end",
          icon: 'success',
          title: '登出成功',
          showConfirmButton: false,
          timer: 2000,
        })
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }
      return
    }
    const res = await fetch(`http://localhost:3005/api/member/logout`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
    const data = await res.json()
    if (data.status === 'success') {
      setAuth({
        isAuth: false,
        userData: initUserData,
      })
      Swal.fire({
        // position: "top-end",
        icon: 'success',
        title: '登出成功',
        showConfirmButton: false,
        timer: 2000,
      })
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }
  }

  // 下滑隱藏nav用
  const [scrollDirection, setScrollDirection] = useState('down')
  const [prevScrollPos, setPrevScrollPos] = useState(0)
  const handleScroll = () => {
    const currentScrollPos = window.scrollY
    if (currentScrollPos > prevScrollPos) {
      setScrollDirection('down')
    } else {
      setScrollDirection('up')
    }
    setPrevScrollPos(currentScrollPos)
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 576) {
        window.addEventListener('scroll', handleScroll)
      } else {
        window.removeEventListener('scroll', handleScroll)
      }
    }

    handleResize()

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [prevScrollPos])

  const shouldHideNav = scrollDirection === 'down' && prevScrollPos > 150
  useEffect(() => {
    const userId = userData.id
    if (userId) {
      fetch(`http://localhost:3005/api/shopping-cart/${userId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch course detail')
          }
          return response.json()
        })
        .then((data) => {
          setShoppingCartLength(data.length)
        })
        .catch(() => {
          console.log(`error`)
        })
    }
  }, [auth])

  const [searchType, setSearchType] = useState('所有')
  const [searchContent, setSearchContent] = useState('')
  const [searchError, setSearchError] = useState('')
  const handleSeachSubmit = async (e) => {
    e.preventDefault()
    // const searchData = {
    //   searchType,
    //   searchContent,
    // }
    if (searchContent === '') {
      setSearchError('搜尋內容不得為空')
      return
    }
    if (!verify(searchContent)) {
      setSearchError('搜尋內容不得包含特殊字元')
      return
    }
    const queryParams = {
      searchType,
      searchContent,
    }
    const queryString = new URLSearchParams(queryParams).toString()
    router.push(`/search?${queryString}`)
  }

  // 驗證搜尋字串不包含特殊字符
  const verify = (str) => {
    return /^[a-zA-Z\u4e00-\u9fa50-9]*$/.test(str)
  }
  const handleSearchChange = (e) => {
    setSearchType(e.target.value)
  }
  const handleSearchFieldChange = (e) => {
    setSearchContent(e.target.value)
    setSearchError('')
  }
  return (
    <>
      <header
        className={`container-fluid d-flex bg-dark justify-content-center align-items-center ${
          shouldHideNav ? '' : styles.header
        }`}
      >
        <nav
          className={`container d-flex justify-content-between ${styles.container}`}
        >
          <div className="d-flex align-items-center">
            <h4 className="d-sm-none" onClick={handleNavM}>
              {bar}
            </h4>
            <Link
              href="/"
              className="logo-con d-flex align-items-center gap-1 text-white ms-3"
            >
              <div className="logo-box">
                <img src="/images/logo.png" alt="" className="img" />
              </div>
              <h4>棒球好玩家</h4>
            </Link>
          </div>
          <div className="d-flex align-items-center">
            <ul
              className={`list-unstyled d-sm-flex d-none gap-2 text-center ${styles.mainUl}`}
            >
              <Link href="/" className="text-light">
                <li
                  className={`${styles.main} ${
                    isActiveHome ? styles.active : ''
                  }`}
                >
                  首頁
                </li>
              </Link>
              <Link href="/article" className="text-light">
                <li
                  className={`${styles.main} ${
                    isActiveArticle ? styles.active : ''
                  }`}
                  // onMouseEnter={() => handleMouseEnter('article')}
                  // onMouseLeave={handleMouseLeave}
                >
                  專欄
                  {activeSub === 'article' && (
                    <ul className="list-unstyled">
                      <li>棒球-規則</li>
                      <li>棒球-術語</li>
                      <li>棒球-用語</li>
                    </ul>
                  )}
                </li>
              </Link>
              <Link href="/course" className="text-light">
                <li
                  className={`${styles.main} ${
                    isActiveCourse ? styles.active : ''
                  }`}
                  // onMouseEnter={() => handleMouseEnter('course')}
                  // onMouseLeave={handleMouseLeave}
                >
                  課程
                  {activeSub === 'course' && (
                    <ul className="list-unstyled">
                      <li>投球</li>
                      <li>打擊</li>
                      <li>守備</li>
                      <li>體能</li>
                      <li>知識</li>
                    </ul>
                  )}
                </li>
              </Link>
              <Link href="/teacher" className="text-light">
                <li
                  className={`${styles.main} ${
                    isActiveTeacher ? styles.active : ''
                  }`}
                >
                  教練
                </li>
              </Link>
              <Link href="/product" className="text-light">
                <li
                  className={`${styles.main} ${
                    isActiveProduct ? styles.active : ''
                  }`}
                  // onMouseEnter={() => handleMouseEnter('product')}
                  // onMouseLeave={handleMouseLeave}
                >
                  商城
                  {activeSub === 'product' && (
                    <ul className="list-unstyled">
                      <li>球棒</li>
                      <li>球</li>
                      <li>帽子</li>
                      <li>球衣</li>
                      <li>球褲</li>
                      <li>手套</li>
                      <li>襪子</li>
                      <li>球鞋</li>
                      <li>裝備</li>
                      <li>護具</li>
                    </ul>
                  )}
                </li>
              </Link>
              <Link href="/rent" className="text-light">
                <li
                  className={`${styles.main} ${
                    isActiveRent ? styles.active : ''
                  }`}
                  // onMouseEnter={() => handleMouseEnter('rent')}
                  // onMouseLeave={handleMouseLeave}
                >
                  租借
                  {activeSub === 'rent' && (
                    <ul className="list-unstyled">
                      <li>球棒</li>
                      <li>球</li>
                      <li>帽子</li>
                      <li>球衣</li>
                      <li>球褲</li>
                      <li>手套</li>
                      <li>襪子</li>
                      <li>球鞋</li>
                      <li>裝備</li>
                      <li>護具</li>
                    </ul>
                  )}
                </li>
              </Link>
              <Link href="/place" className="text-light">
                <li
                  className={`${styles.main} ${
                    isActivePlace ? styles.active : ''
                  }`}
                >
                  場域地圖
                </li>
              </Link>
              <Link href="/join" className="text-light">
                <li
                  className={`${styles.main} ${
                    isActiveJoin ? styles.active : ''
                  }`}
                  // onMouseEnter={() => handleMouseEnter('join')}
                  // onMouseLeave={handleMouseLeave}
                >
                  揪團
                  {activeSub === 'join' && (
                    <ul className="list-unstyled">
                      <li>正在揪團</li>
                      <li>已成團</li>
                    </ul>
                  )}
                </li>
              </Link>
            </ul>
            <ul
              className={`list-unstyled d-flex gap-2 ul align-items-center text-center ${styles.members}`}
            >
              <li className="position-relative" onClick={handleSearchOpen}>
                <h4>
                  <CiSearch />
                </h4>
              </li>
              {searchOpen && (
                <>
                  <form
                    className={`position-absolute d-flex align-items-center ${styles.searchYes}`}
                    onSubmit={handleSeachSubmit}
                  >
                    <select
                      className="form-select text-light text-center"
                      disabled
                      onChange={(e) => {
                        handleSearchChange(e)
                      }}
                    >
                      <option value="所有">搜尋</option>
                      {/* <option value="專欄">專欄</option>
                      <option value="課程">課程</option>
                      <option value="商城">商城</option>
                      <option value="租借">租借</option> */}
                    </select>
                    <input
                      type="text"
                      className="form-control text-light"
                      placeholder="請輸入搜索字串"
                      onChange={(e) => {
                        handleSearchFieldChange(e)
                      }}
                      value={searchContent}
                    />
                    <button className="position-absolute text-light">
                      <CiSearch />
                    </button>
                  </form>
                  {searchError === '' ? (
                    ''
                  ) : (
                    <div className={`bg-primary ${styles.alert}`}>
                      {searchError}
                    </div>
                  )}
                </>
              )}
              <li className={`position-relative `} onClick={handelAccountOpen}>
                <h4>
                  <GoPerson />
                </h4>
                {accountOpen && (
                  <>
                    {isAuth ? (
                      <div
                        className={`position-absolute d-flex flex-column align-items-center  ${styles.accountYes}`}
                      >
                        <div className={`my-3 ${styles.circle}`}>
                          {userData.photo && userData.photo.includes('http') ? (
                            <img src={userData.photo} />
                          ) : (
                            <img
                              src={`http://localhost:3005/uploads/${userData.photo}`}
                            />
                          )}
                        </div>
                        <h6 className="mb-3">{userData.name}</h6>
                        <ul className="list-unstyled">
                          <Link href="/member/profile" className="text-light">
                            <li className="border-top">會員中心</li>
                          </Link>
                          {userData.google_uid === '112525581598621432124' ? (
                            <Link href="/support" className="text-light">
                              <li className="border-top">即時客服</li>
                            </Link>
                          ) : (
                            ''
                          )}
                          {userData.google_uid === '112525581598621432124' ? (
                            <Link
                              href="http://localhost/baseball/pages/insert_article.php"
                              className="text-light"
                            >
                              <li className="border-top">新增文章</li>
                            </Link>
                          ) : (
                            ''
                          )}
                          <li onClick={handleLogout} className="border-top">
                            登出
                          </li>
                        </ul>
                      </div>
                    ) : (
                      <div className={`position-absolute ${styles.accountNo}`}>
                        <ul className="list-unstyled">
                          <Link href="/member/login" className="text-light">
                            <li>登入</li>
                          </Link>
                          <Link href="/member/signup" className="text-light">
                            <li>註冊</li>
                          </Link>
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </li>
              <Link href="/cart" className="text-light">
                <li>
                  <div className="position-relative">
                    <h4>
                      <PiShoppingCart />
                    </h4>
                    <div
                      className={`position-absolute bg-primary d-flex justify-content-center align-items-center ${styles['cart-num']}`}
                    >
                      <div>{shoppingCartLength}</div>
                    </div>
                  </div>
                </li>
              </Link>
            </ul>
          </div>
        </nav>
      </header>
      <div
        className={`${styles.navM} ${navM ? styles.slideIn : styles.slideOut}`}
      >
        {navM && <NavM />}
      </div>
    </>
  )
}
