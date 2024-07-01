import { useState, useEffect } from 'react'
import styles from '@/styles/article/article_list.module.css'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import Link from 'next/link'
import { BiSolidLeftArrow, BiSolidRightArrow } from 'react-icons/bi'

export default function ArticleList() {
  const [type, setType] = useState('知識')
  const [fetchData, setFetchData] = useState([])
  const [articleImg, setArticleImg] = useState([])

  // 點擊時，切換類別與fetch
  const handleType = async (type) => {
    setType(type)
    const data = await fetch(`http://localhost:3005/api/article/${type}`).then(
      (res) => res.json()
    )
    if (data.status === 'success') {
      setFetchData(data.data)
      setCurrentPage(1)
    }
  }

  // 第一次進入頁面，渲染預設的"知識"資料
  useEffect(() => {
    handleType('知識')
  }, [])

  const [articleRandom, setArticleRandom] = useState([])

  const handleRandomArticle = async () => {
    const res = await fetch(`http://localhost:3005/api/baseball/article`)
    const data = await res.json()

    if (data.status === 'success') {
      const articlesWithImg = await Promise.all(
        data.data.map(async (article) => {
          const url = await handleArticleImg(article.photo)
          return { ...article, photoUrl: url }
        })
      )

      const groupedData = articlesWithImg.reduce((acc, curr, index) => {
        const chunkIndex = Math.floor(index / 3)
        if (!acc[chunkIndex]) {
          acc[chunkIndex] = []
        }
        acc[chunkIndex].push(curr)
        return acc
      }, [])

      setArticleRandom(groupedData)
    }
  }
  useEffect(() => {
    handleRandomArticle()
  }, [])
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  }

  // 分頁相關處理
  const [currentPage, setCurrentPage] = useState(1)
  const [shouldShowPagination, setShouldShowPagination] = useState(true)
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  // 處理分頁按鈕點擊事件
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }
  const pageSize = 6 //一頁有幾篇文章
  // 計算總頁數
  const totalPages = Math.ceil(fetchData.length / pageSize)
  const totalPagesImg = Math.ceil(articleImg.length / pageSize)

  // 計算顯示的文章列表
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, fetchData.length)
  const visibleCourses = fetchData.slice(startIndex, endIndex)

  const endIndexImg = Math.min(startIndex + pageSize, articleImg.length)
  const visibleCoursesImg = articleImg.slice(startIndex, endIndexImg)

  // 根據 isSmallScreen 狀態條件渲染數據列表
  const dataToShow = isSmallScreen ? fetchData : visibleCourses
  const dataToShowImg = isSmallScreen ? articleImg : visibleCoursesImg

  //分頁手機板隱藏
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

  // 獲取圖片用
  const handleArticleImg = async (img) => {
    const data = await fetch(
      `http://localhost:3005/api/baseball/articleImg/${img}`
    )
    const blob = await data.blob()
    const imageURL = URL.createObjectURL(blob)
    return imageURL
  }
  const fetchArticleImg = async () => {
    const urls = []
    for (const i of fetchData) {
      const url = await handleArticleImg(i.photo)
      urls.push(url)
    }
    setArticleImg(urls)
  }
  useEffect(() => {
    console.log('articleImg')
    if (fetchData.length > 0) {
      fetchArticleImg()
    }
  }, [fetchData])

  return (
    <>
      <div className={`container ${styles.bodyMT}`}>
        <div className={`row`}>
          <Carousel
            swipeable={true}
            draggable={false}
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
            itemClass={`d-flex justify-content-center`}
          >
            {articleRandom.map((v, i) => {
              return (
                <>
                  <div
                    className={`col-auto col-md-6 me-sm-4 ${styles.articleMaxWidth}`}
                  >
                    <div className={`${styles.topCard}`}>
                      <Link href={`/article/${v[0].id}`}>
                        <div className="w-100 h-100">
                          <img src={v[0].photoUrl} alt="" />
                        </div>
                        <div className={`${styles.cardTitle}`}>
                          <h4 className="text-primary">{v[0].subtitle}</h4>
                          <h4>{v[0].title}</h4>
                          <p>{v[0].created_at}</p>
                        </div>
                      </Link>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div
                      className={`d-flex flex-column ${styles.cardFlex} ${styles.articleMaxWidth}`}
                    >
                      <div className={`${styles['topCard-s']}`}>
                        <Link href={`/article/${v[1].id}`}>
                          <div className="w-100 h-100">
                            <img src={v[1].photoUrl} alt="" />
                          </div>
                          <div className={`${styles.cardTitle}`}>
                            <h5 className="text-primary">{v[1].subtitle}</h5>
                            <h5>{v[1].title}</h5>
                            <p>{v[1].created_at}</p>
                          </div>
                        </Link>
                      </div>

                      <div
                        className={`${styles['topCard-s']} ${styles.articleMaxWidth}`}
                      >
                        <Link href={`/article/${v[2].id}`}>
                          <div className="w-100 h-100">
                            <img src={v[2].photoUrl} alt="" />
                          </div>
                          <div className={`${styles.cardTitle}`}>
                            <h5 className="text-primary">{v[2].subtitle}</h5>
                            <h5>{v[2].title}</h5>
                            <p>{v[2].created_at}</p>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
              )
            })}
          </Carousel>
        </div>

        {/* 條件篩選欄 */}
        <div className="d-flex justify-content-center mb-2">
          <ul className="nav nav-underline mt-2 mb-3 text-center mx-auto">
            <button
              className={`text-secondary nav-link ${
                type === '知識' ? 'active' : ''
              }`}
              onClick={() => {
                handleType('知識')
              }}
            >
              <li className={`nav-item ${styles.navItem}`}>
                <h5>知識</h5>
              </li>
            </button>
            <button
              className={`text-secondary nav-link ${
                type === '打擊' ? 'active' : ''
              }`}
              onClick={() => {
                handleType('打擊')
              }}
            >
              <li className={`nav-item ${styles.navItem}`}>
                <h5>打擊</h5>
              </li>
            </button>
            <button
              className={`text-secondary nav-link ${
                type === '守備' ? 'active' : ''
              }`}
              onClick={() => {
                handleType('守備')
              }}
            >
              <li className={`nav-item ${styles.navItem}`}>
                <h5>守備</h5>
              </li>
            </button>
            <button
              className={`text-secondary nav-link ${
                type === '投球' ? 'active' : ''
              }`}
              onClick={() => {
                handleType('投球')
              }}
            >
              <li className={`nav-item ${styles.navItem}`}>
                <h5>投球</h5>
              </li>
            </button>
            <button
              className={`text-secondary nav-link ${
                type === '體能' ? 'active' : ''
              }`}
              onClick={() => {
                handleType('體能')
              }}
            >
              <li className={`nav-item ${styles.navItem}`}>
                <h5>體能</h5>
              </li>
            </button>
          </ul>
        </div>

        {/* 文章內容卡片 */}
        <h2 className={`text-center text-info mb-4`}>{type}</h2>
        {/* i為奇數時，渲染圖在右邊;偶數時，渲染圖在左邊 */}
        {dataToShow.map((v, i) => (
          <Link href={`http://localhost:3000/article/${v.id}`} key={i}>
            <div
              className={`row ${
                i % 2 === 0 ? styles.mainCard1 : styles.mainCard2
              }`}
            >
              {i % 2 === 0 ? (
                <>
                  <div className={`col-md-6 ${styles.orderLast}`}>
                    <div
                      className={`d-flex flex-column justify-content-between ${styles.mainCard1Text}`}
                    >
                      <h5 className="text-primary">{v.subtitle}</h5>
                      <h5>{v.title}</h5>
                      <p>{v.created_at}</p>
                      <div className={`${styles.articleText}`}>
                        <h6
                          dangerouslySetInnerHTML={{ __html: v.description }}
                        ></h6>
                      </div>
                      <button
                        className={`mx-auto ms-0 ${styles['btn-mydark']} ${styles['bold-text']}`}
                        type="button"
                      >
                        詳細文章
                      </button>
                    </div>
                  </div>
                  <div className={`col-md-6 ${styles.orderFirst}`}>
                    <div className={`${styles.mainCard1Img}`}>
                      <img src={dataToShowImg[i]} alt="" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className={`col-md-6 `}>
                    <div className={`${styles.mainCard2Img}`}>
                      <img src={dataToShowImg[i]} alt="" />
                    </div>
                  </div>
                  <div className={`col-md-6 `}>
                    <div
                      className={`d-flex flex-column justify-content-between ${styles.mainCard2Text}`}
                    >
                      <h5 className="text-primary">{v.subtitle}</h5>
                      <h5>{v.title}</h5>
                      <p>{v.created_at}</p>
                      <div className={`${styles.articleText}`}>
                        <h6
                          dangerouslySetInnerHTML={{ __html: v.description }}
                        ></h6>
                      </div>
                      <button
                        className={`mx-auto ms-0 ${styles['btn-mydark']} ${styles['bold-text']}`}
                        type="button"
                      >
                        詳細文章
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Link>
        ))}

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
      </div>
    </>
  )
}
