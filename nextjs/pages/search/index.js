import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styles from '@/styles/member/search.module.css'
import stylesA from '@/styles/article/article_list.module.css'
import stylesB from '@/pages/course/course.module.css'
import stylesC from '@/pages/product/product.module.css'
import Link from 'next/link'

export default function Search() {
  const router = useRouter()
  const [articleOk, setArticleOk] = useState(true)
  const [courseOk, setCourseOk] = useState(false)
  const [productOk, setProductOk] = useState(false)
  const [rentOk, setRentOk] = useState(false)
  const { searchType, searchContent } = router.query
  const [articleData, setArticleData] = useState([])
  const [courseData, setCourseData] = useState([])
  const [productData, setProductData] = useState([])
  const [rentData, setRentData] = useState([])

  useEffect(() => {
    const getData = async () => {
      const data = await fetch(
        `http://localhost:3005/api/search?searchType=${searchType}&searchContent=${searchContent}`
      ).then((res) => res.json())
      if (data.status === 'success') {
        // setSearchResultData(data.data)
        setArticleData(data.data.article)
        setCourseData(data.data.course)
        setProductData(data.data.product)
        setRentData(data.data.rent)
      } else {
        return
      }
    }
    getData()
  }, [searchType, searchContent])

  const handleArticleOk = () => {
    setArticleOk(true)
    setCourseOk(false)
    setProductOk(false)
    setRentOk(false)
  }
  const handleCourseOk = () => {
    setArticleOk(false)
    setCourseOk(true)
    setProductOk(false)
    setRentOk(false)
  }
  const handleProductOk = () => {
    setArticleOk(false)
    setCourseOk(false)
    setProductOk(true)
    setRentOk(false)
  }
  const handleRentOk = () => {
    setArticleOk(false)
    setCourseOk(false)
    setProductOk(false)
    setRentOk(true)
  }
  return (
    <div className={styles.top}>
      <div className="container">
        <div className="top"></div>
        <div className="">
          <h3 className="text-center my-3">搜尋結果</h3>
          <div
            className={`d-flex justify-content-center mb-5 ${styles.resultSelectBox}`}
          >
            <button
              onClick={handleArticleOk}
              className={articleOk ? styles.active : ''}
            >
              <h5 className="resultSelect text-info">
                專欄{' '}
                <span className="text-primary">{`(${articleData.length})`}</span>
              </h5>
            </button>
            <button
              onClick={handleCourseOk}
              className={courseOk ? styles.active : ''}
            >
              <h5 className="resultSelect text-info">
                課程{' '}
                <span className="text-primary">{`(${courseData.length})`}</span>
              </h5>
            </button>
            <button
              onClick={handleProductOk}
              className={productOk ? styles.active : ''}
            >
              <h5 className="resultSelect text-info">
                商城{' '}
                <span className="text-primary">{`(${productData.length})`}</span>
              </h5>
            </button>
            <button
              onClick={handleRentOk}
              className={rentOk ? styles.active : ''}
            >
              <h5 className="resultSelect text-info">
                租借{' '}
                <span className="text-primary">{`(${rentData.length})`}</span>
              </h5>
            </button>
          </div>
          <div className={`${styles.searchContent}`}>
            {articleOk && (
              <>
                {articleData.length > 0 ? (
                  articleData.map((v, i) => {
                    return (
                      <Link href={`/article/${v.id}`} key={i}>
                        <div className={`article ${stylesA.mainCard2}`}>
                          <div className="articleElement row">
                            <div className={`col-md-6`}>
                              <div className={`${stylesA.mainCard2Img}`}>
                                <img src={`/images/article/${v.photo}`} />
                              </div>
                            </div>
                            <div className={`col-md-6 `}>
                              <div
                                className={`d-flex flex-column justify-content-between ${stylesA.mainCard2Text}`}
                              >
                                <h5 className="text-primary">{v.subtitle}</h5>
                                <h5>{v.title}</h5>
                                <p>{v.created_at}</p>
                                <div className={`${stylesA.articleText}`}>
                                  <h6
                                    dangerouslySetInnerHTML={{
                                      __html: v.description,
                                    }}
                                  ></h6>
                                </div>
                                <button
                                  className={`mx-auto ms-0 ${stylesA['btn-mydark']} ${stylesA['bold-text']}`}
                                  type="button"
                                >
                                  詳細文章
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })
                ) : (
                  <h4 className="text-center text-primary">無相符之搜尋結果</h4>
                )}
              </>
            )}
            {courseOk && (
              <div className="course d-flex justify-content-center flex-wrap">
                {courseData.length > 0 ? (
                  courseData.map((v, i) => {
                    return (
                      <Link
                        href={`/course/${v.id}`}
                        className={`course-card-sun d-flex ${stylesB.CourseCardSun} custom-link-color-Sun`}
                        key={i}
                      >
                        <div className={`${stylesB.CourseCardImg}`}>
                          {/* 使用 firstPhoto 作為圖片路徑 */}
                          <img src={`/images/course/${v.photo}`} />
                        </div>
                        <div
                          className={`courseCardTextSun ${stylesB.CourseCardTextSun}`}
                        >
                          <p className="fw-bold">{v.type}</p>
                          <h3
                            className={`teacherText ${stylesB.courseNameText}`}
                          >
                            {v.name}
                          </h3>
                          {/* 其他商品信息 */}
                          {/* <p>教練: 教練名稱</p> */}
                          <p>
                            時間:
                            {new Date(v.course_start).toLocaleString('zh-TW', {
                              hour12: false,
                              hour: '2-digit',
                              minute: '2-digit',
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })}
                            <br className={`${stylesB.brData}`} />~
                            {new Date(v.course_end).toLocaleString('zh-TW', {
                              hour12: false,
                              hour: '2-digit',
                              minute: '2-digit',
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })}
                          </p>
                          <div
                            className={`description ${stylesB.description}`}
                            dangerouslySetInnerHTML={{
                              __html: v.description,
                            }}
                          />
                        </div>
                      </Link>
                    )
                  })
                ) : (
                  <h4 className="text-center text-primary">無相符之搜尋結果</h4>
                )}
              </div>
            )}
            {productOk && (
              <div className="product d-flex flex-wrap justify-content-center">
                {productData.length > 0 ? (
                  productData.map((v, i) => {
                    return (
                      <div className={`box3 mx-3 my-3 ${stylesC.box3}`} key={i}>
                        <Link href={`/product/${v.id}`}>
                          <figcaption className={`avatar ${stylesC.avatar}`}>
                            <img src={`/images/product/${v.image_url}`} />
                          </figcaption>
                          <h6
                            className={`single-ellipsis1 text-black name ${stylesC.singleEllipsis1} ${stylesC.name}`}
                          >
                            {v.name}
                          </h6>
                          {/* 四舍五入 */}
                          <div className={`box4 ${stylesC.box4}`}>
                            ${Math.round(v.price * 0.8)}
                          </div>
                        </Link>
                        <div className={`bbox ${stylesC.bbox}`}>
                          <p className={`box5 ${stylesC.box5}`}>${v.price}</p>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <h4 className="text-center text-primary">無相符之搜尋結果</h4>
                )}
              </div>
            )}
            {rentOk && (
              <div className="product d-flex flex-wrap justify-content-center">
                {rentData.length > 0 ? (
                  rentData.map((v, i) => {
                    return (
                      <div className={`box3 mx-3 my-3 ${stylesC.box3}`} key={i}>
                        <Link href={``}>
                          <figcaption className={`avatar ${stylesC.avatar}`}>
                            <img src={`/images/rent/${v.img}`} />
                          </figcaption>
                          <h6
                            className={`single-ellipsis1 text-black name ${stylesC.singleEllipsis1} ${styles.name}`}
                          >
                            {v.name}
                          </h6>
                          {/* 四舍五入 */}
                          <div className={`box4 ${stylesC.box4}`}>
                            ${Math.round(v.price * 0.8)}
                          </div>
                        </Link>
                        <div className={`bbox ${stylesC.bbox}`}>
                          <p className={`box5 ${stylesC.box5}`}>${v.price}</p>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <h4 className="text-center text-primary">無相符之搜尋結果</h4>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
