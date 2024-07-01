import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { initUserData, useAuth } from '@/hooks/use-auth'
import Swal from 'sweetalert2'
import favorite from '@/public/images/course/Rectangle false.svg'
import favoriteLove from '@/public/images/course/Rectangle true.svg'
import Image from 'next/image'
import axios from 'axios'
import { IoMdStar, IoMdStarOutline } from "react-icons/io"; //實心星星 空心星星 wun
import { MdArrowRight } from "react-icons/md";  // wun


export default function CourseDetail() {
  const router = useRouter()
  const { id } = router.query
  const [courseDetail, setCourseDetail] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const { auth, setAuth } = useAuth() // 使用对象解构语法
  const { isAuth, useData } = auth

  const userData = auth.userData
  const [favoriteProductIds, setFavoriteProductIds] = useState([])
  const [previousUserId, setPreviousUserId] = useState(null)
  const [recommendedCourses, setRecommendedCourses] = useState([])
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [clickedIndex, setClickedIndex] = useState(0)

  // 獲取此商品評論資料 wun
  const [comment, setComment] = useState([])

  // 評論的fetch   wun
  const fetchComment = () => {
    //  使用 fetch 函數向後端發送 HTTP GET 請求
    const courseId = id
    fetch(`http://localhost:3005/api/comment/course/${courseId}`)
      .then(response => {
        // 檢查 HTTP 響應是否成功
        if (!response.ok) {
          throw new Error('無法獲取評論數據');
        }
        // 將 JSON 響應解析為 JavaScript 物件
        return response.json();
      })
      .then(data => {
        // 在這裡處理從後端獲取到的評論數據
        console.log('評論資料:', data);
        // 你可以根據需要將數據顯示在網頁上的特定位置
        setComment(data);
      })
      .catch(error => {
        // 如果發生錯誤，輸出錯誤訊息到控制台
        console.error('發生錯誤:', error);
      });
  }

  useEffect(() => {
    fetchComment();
  }, [id])
  // 評論的fetch結束   wun


  // 使用 id 获取课程详细信息
  useEffect(() => {
    if (id) {
      setIsLoading(true)
      setError(null)

      // 使用 `fetch` 获取课程详细信息
      fetch(`http://localhost:3005/api/course/${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch course detail')
          }
          return response.json()
        })
        .then((data) => {
          setCourseDetail(data)
          setIsLoading(false)
          if (data[0].photo) {
            const initialPhotoArray =
              typeof data[0].photo === 'string'
                ? data[0].photo.split(',')
                : data[0].photo
            setSelectedPhoto(initialPhotoArray[0]) // 假設照片 URL 正確存儲
          }
        })
        .catch((err) => {
          setError(err)
          setIsLoading(false)
        })
    }
    setClickedIndex(0)
  }, [id])
  useEffect(() => {
    if (courseDetail && courseDetail[0].type) {
      // 使用课程类型获取推荐课程
      const type = courseDetail[0].type

      fetch(`http://localhost:3005/api/course/by-type/${type}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch recommended courses')
          }
          return response.json()
        })
        .then((data) => {
          setRecommendedCourses(data)
        })
        .catch((error) => { })
    }
  }, [courseDetail])

  if (isLoading) {
    return <div>Loading...</div> // 数据加载中
  }

  if (error) {
    return <div>Error: {error.message}</div> // 显示错误信息
  }

  // 渲染课程详细信息
  const courseData = courseDetail[0]

  let photoArray
  if (typeof courseData.photo === 'string') {
    photoArray = courseData.photo.split(',') // 將字符串分割為陣列
  } else if (Array.isArray(courseData.photo)) {
    photoArray = courseData.photo // 已經是陣列，直接使用
  } else {
    // 處理其他類型的數據（如 null、undefined 等），這裡設置為空陣列
    photoArray = []
  }

  // 处理数量增加
  const handleIncrease = () => {
    setQuantity(quantity + 1)
  }

  // 处理数量减少
  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  // 处理加入购物车
  const handleAddToCart = () => {
    const requestData = {
      user_id: userData.id, // 请确保 initUserData.name 是正确的
      product_id: courseData.id, // 商品ID
      price: courseData.price, // 商品价格
      img: photoArray[0],
      start_time: courseData.course_start,
      end_time: courseData.course_end,
      amount: quantity, // 数量
    }

    fetch('http://localhost:3005/api/shopping-cart/course', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to add to cart')
        }
        return response.json()
      })
      .then((data) => {
        if (data.status === 'success') {
          Swal.fire({
            icon: 'success',
            title: '成功加入購物車',
            showConfirmButton: false,
            timer: 2000,
          })
        } else if (data.status === 'update') {
          Swal.fire({
            icon: 'success',
            title: '成功修改購物車數量',
            showConfirmButton: false,
            timer: 2000,
          })
        } else {
          Swal.fire({
            icon: 'error',
            title: '添加到購物車失敗',
            text: data.error || '請稍後再試',
          })
        }
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: '請先完成登入',
        })
      })
  }

  //我的收藏

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3005/api/favorite/user/${userData.id}/`
      )
      const favoriteProducts = response.data.map((item) => item.product_id)
      setFavoriteProductIds(favoriteProducts)
    } catch (error) { }
  }

  if (userData.id !== previousUserId) {
    fetchFavorites() // 如果 userData.id 改变，则调用 fetchFavorites
    setPreviousUserId(userData.id) // 更新 previousUserId
  }

  const handleToggleFav = () => {
    // 创建 POST 请求数据
    const favData = {
      user_id: userData.id,
      product_id: courseData.id,
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
          Swal.fire({
            icon: 'success',
            title: '已加入我的收藏',
          })
          console.log('已加入我的收藏')
        } else if (data.status === 'fail') {
          Swal.fire({
            icon: 'success',
            title: '已從我的收藏移除',
          })
          console.log('已從我的收藏刪除')
        }
        // 操作完成后，调用 fetchFavorites 刷新数据
        fetchFavorites()
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: '請先完成登入',
        })
      })
  }
  const handlePhotoClick = (photo, index) => {
    // 更新 selectedPhoto 為點擊的小圖片的路徑
    setClickedIndex(index)
    setSelectedPhoto(photo)
  }

  return (
    <div className="container container-nav">
      <nav className='breadcrumb-sun' aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="http://localhost:3000/course">所有課程</a>
          </li>
          <li aria-current="page" className="breadcrumb-item active">
            {courseData.type}
          </li>
        </ol>
      </nav>

      <div className="course-Product-Main1-Sun d-block d-sm-flex">
        <div className="course-Product-Image-Sun">
          <div className="course-Product-Img-Sun">
            <img
              alt=""
              src={`/images/course/${selectedPhoto !== null ? selectedPhoto : photoArray[0]
                }`}
            />
          </div>
          <div className="Course-Product-Img-Little-Card-Sun d-flex">
            {photoArray.map((photo, index) => (
              <div
                className="Course-Product-Img-Little-Sun"
                onClick={() => handlePhotoClick(photo, index)}
              >
                <img
                  key={index}
                  src={`/images/course/${photo}`}
                  alt={`${courseData.name} photo ${index + 1}`}
                  style={{
                    opacity: clickedIndex === index ? 1 : 0.5,
                    cursor: 'pointer', // 设置光标为指针形状
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 课程详细信息 */}
        <div className="description-Sun">
          <div className="Product-text-Sun Porduct-Name-Sun">
            <h5 style={{ color: '#ee3e27' }}>{courseData.name}</h5>
          </div>
          <div className="Product-text-Sun Porduct-Price-Sun">
            <h4 style={{ color: '#ee3e27' }}>${courseData.price}</h4>
          </div>
          <div className="Product-text-Sun Porduct-Description-Sun">
            <h5>
              課程簡介:{' '}
              <div
                dangerouslySetInnerHTML={{
                  __html: courseData.outline,
                }}
              />{' '}
            </h5>
          </div>
          <div className="Product-text-Sun Porduct-Name-Sun">
            <h5>開課日期: {courseData.course_start}</h5>
            <h5>結束日期: {courseData.course_end}</h5>
            <h5>開課教練: {courseData.teacher_name}</h5>
            <h5>場館地點: 帕菲克運動中心</h5>
          </div>

          <div className="Course-Quantity-Sun">
            <div className="Quantity-Number-Sun">
              <h6>人數</h6>
              <div className="d-flex text-center Quantity-button-Sun">
                <button onClick={handleDecrease}>-</button>
                <h6 className="d-flex align-items-center justify-content-center">
                  {quantity}
                </h6>
                <button onClick={handleIncrease}>+</button>
              </div>
            </div>
          </div>

          <div className="d-flex d-sm-block course-shopping-button-Sun">
            <button
              className="d-flex justify-content-center align-items-center text-center btn btn-primary"
              onClick={handleAddToCart}
            >
              <img alt="" src="/images/course/shopping car.svg" />
              <h6 className="mt-1">加入購物車</h6>
            </button>
            <button
              className="d-flex justify-content-center align-items-center text-center btn btn-dark"
              onClick={handleToggleFav}
            >
              <Image
                src={
                  favoriteProductIds.includes(courseData.id)
                    ? favoriteLove
                    : favorite
                }
                alt=""
                width={24}
                height={24}
              />
              <h6 className="mt-1">收藏商品</h6>
            </button>
          </div>
        </div>
      </div>

      <div className="course-Product-Main2-Sun d-block d-sm-flex">
        <div className="Course-Description">
          <div className="Course-Description-box">
            <div className="d-flex align-items-center Course-Description-title">
              <img alt="" src="/images/course/baseball.svg" />
              <h5>課程描述</h5>
            </div>
            <div className="Course-Description-text">
              <p>
                <div
                  dangerouslySetInnerHTML={{
                    __html: courseData.description,
                  }}
                />{' '}
              </p>
            </div>
          </div>

          <div className="d-flex align-items-center Course-Description-title">
            <img alt="" src="/images/course/baseball.svg" />
            <h5>課程評價</h5>
          </div>
          {comment.length === 0 ? (
            <h3 className="text-center my-4">暫時無相關評論</h3>
          ) : (
            comment.slice(0, 2).map(comment => (
              <div key={comment.id} className="Course-Comment-Sun">
                <div className="d-flex justify-content-between">
                  <div className="d-flex Course-Comment-User-Sun">
                    <img alt="" src={comment.photo &&
                                                            comment.photo.includes('http')
                                                            ? `${comment.photo}`
                                                            : `http://localhost:3005/uploads/${comment.photo}`} />
                    <div className="Course-Comment-User-Name-Sun">
                      <h6>{comment.account === null
                                                        ? comment.email.substring(0, 3) + '***'
                                                        : comment.account.substring(0, 3) + '***'}</h6>
                      <p>{comment.created_at}</p>
                    </div>
                  </div>
                  <div className="ms-auto  " style={{ fontSize: '1.5rem', color: 'red' }}>
                    {[...Array(comment.star)].map((_, index) => (
                      <IoMdStar key={index} />
                    ))}
                    {[...Array(5 - comment.star)].map((_, index) => (
                      <IoMdStarOutline key={index} />
                    ))}
                  </div>
                </div>
                <div className="Course-Comment-Text-Sun">
                  <p>{comment.description}</p>
                </div>
              </div>
            )
            ))}
          {comment.length === 0 ? (
            <div></div>
          ) : (
            <div className="ms-auto text-end">
              <button className="btn text-danger d-flex align-items-center ms-auto mb-2" type="button"
                data-bs-toggle="modal" data-bs-target="#ModalComment"> 查看更多評論 <MdArrowRight /> </button>
            </div>
          )}
        </div>

        <div className="course-main2-2-sun">
          <div className="course-teacher-sun">
            <div className="teacher-box-sun">
              <div className="d-flex align-items-center Course-Description-title">
                <img alt="" src="/images/course/product-box.svg" />
                <h5>教練介紹</h5>
              </div>
              <div className="course-teacher-img-sun d-block d-sm-flex">
                <img
                  alt=""
                  src={`/images/teacher/${courseData.teacher_photo}`}
                />
                <div className="course-teacher-text-sun">
                  <h4>{courseData.teacher_name}</h4>
                  <h5>資歷</h5>
                  <h5>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: courseData.teacher_description,
                      }}
                    />
                  </h5>
                </div>
              </div>
            </div>
          </div>
          {/* 評論  modal 彈窗 */}
          <div className="modal fade" id="ModalComment" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class={`modal-dialog modal-lg text-info`}>
              <div class="modal-content px-3 pt-3">
                <div class="modal-header">
                  <h5 class="modal-title fs-5" id="exampleModalLabel">所有評論</h5>
                  <button type="button" class="btn-close ms-auto" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-start px-4 modal-body-Sun">
                  {comment.map(comment => (
                    <div key={comment.id} className="Course-Comment-Sun">
                      <div className="d-flex justify-content-between">
                        <div className="d-flex Course-Comment-User-Sun">
                          <img alt="" src={comment.photo &&
                                                            comment.photo.includes('http')
                                                            ? `${comment.photo}`
                                                            : `http://localhost:3005/uploads/${comment.photo}`} />
                          <div className="Course-Comment-User-Name-Sun">
                            <h6>{comment.account === null
                                                        ? comment.email.substring(0, 3) + '***'
                                                        : comment.account.substring(0, 3) + '***'}</h6>
                            <p>{comment.created_at}</p>
                          </div>
                        </div>
                        <div className="ms-auto  " style={{ fontSize: '1.5rem', color: 'red' }}>
                          {[...Array(comment.star)].map((_, index) => (
                            <IoMdStar key={index} />
                          ))}
                          {[...Array(5 - comment.star)].map((_, index) => (
                            <IoMdStarOutline key={index} />
                          ))}
                        </div>
                      </div>
                      <div className="Course-Comment-Text-Sun">
                        <p>{comment.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
                </div>
              </div>
            </div>
          </div>


          {/* 更多推荐课程 */}
          <div className="course-recommended-Sun">
            <div className="recommended-box-Sun">
              <div className="d-flex align-items-center Course-Description-title">
                <img alt="" src="/images/course/product-box.svg" />
                <h5>更多推薦課程</h5>
              </div>

              <div className="course-recommended-card d-flex justify-content-between justify-content-sm-start mb-5">
                {recommendedCourses.map((course) => {
                  const photoArray = course.photo.split(',')

                  // 使用 photoArray[0] 作為圖片的路徑
                  const firstPhoto = photoArray[0]
                  return (
                    <Link key={course.id} href={`/course/${course.id}`}>
                      <div className="course-recommended-img-sun mb-5">
                        <img alt="" src={`/images/course/${firstPhoto}`} />
                        <div className="course-course-recommended-text-sun">
                          <h6 className="mb-3 text-truncate">{course.name}</h6>
                          <div className="recommended-price-card d-flex">
                            <h5 className="recommended-price">
                              ${course.price}
                            </h5>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}
