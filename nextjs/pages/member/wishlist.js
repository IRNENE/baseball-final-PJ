import React, { useState, useEffect } from 'react'
import styles from '@/styles/style_lai.module.css'
import styles2 from '@/pages/product/product.module.css'
import Sidebar from '@/components/sidebar/sidebar'
import { GoTriangleRight, GoTriangleLeft } from 'react-icons/go'
import favorite from '@/public/images/course/Rectangle false.svg'
import favoriteLove from '@/public/images/course/Rectangle true.svg'
import Image from 'next/image'
import { FaRegHeart } from 'react-icons/fa' // 引入 Heart 的使用者圖標(空心)
import { FaHeart } from 'react-icons/fa' // 引入 Heart 的使用者圖標(實心)
import Link from 'next/link'
import { initUserData, useAuth } from '@/hooks/use-auth'
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { BiSolidLeftArrow, BiSolidRightArrow } from 'react-icons/bi';

export default function Wishlist() {
  const { auth, setAuth } = useAuth()
  const { isAuth, useData } = auth
  const userData = auth.userData
  const [wishlist, setWishlist] = useState([])
  const [favoriteProductIds, setFavoriteProductIds] = useState([])
  const [sortOrder, setSortOrder] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage, setProductsPerPage] = useState(8)

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = wishlist.slice(indexOfFirstProduct, indexOfLastProduct);  // 對應 一頁有幾筆
    const totalPageCount = Math.ceil(wishlist.length / productsPerPage); // 總共有幾頁
    const [shouldShowPagination, setShouldShowPagination] = useState(true)
    const [isSmallScreen, setIsSmallScreen] = useState(false)

  const fetchFavorites = () => {
    // 使用 fetch 方法向後端發送 GET 請求
    fetch(`http://localhost:3005/api/member-center/wishlist/${userData.id}`)
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
        console.log('抓取此會員的收藏列表...')
        console.log('我的收藏清單編號:', data)
        setWishlist(data) //將收藏清單設置為後端獲取到的資料
      })
      .catch((error) => {
        // 處理錯誤
        console.error('There was a problem with your fetch operation:', error)
      })
  }

  useEffect(() => {
    fetchFavorites()
  }, [userData.id]) //useEffect 的依賴項(會員id切換 或 排序切換 才會重新渲染)

  // 排序相關
  const handleSortChange = (event) => {
    setSortOrder(event.target.value)
    console.log(event.target.value)

    fetchURL()
  }

  const fetchURL = async () => {
    let url = `http://localhost:3005/api/member-center/wishlist/${userData.id}?`

    const queryParams = []
    if (sortOrder) {
      queryParams.push(`sortOrder=${sortOrder}`)
    }
    // 拼上排序參數
    url += queryParams.join('&')
    // 請求獲取更新排序後的資料
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setWishlist(data)
      })
  }

  useEffect(() => {
    fetchURL()
  }, [sortOrder])
  // 排序相關結束

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
    const visibleCourses = wishlist.slice(indexOfFirstProduct, indexOfLastProduct)
    const dataToShow = isSmallScreen ? wishlist : visibleCourses

    const paginate = (pageNumber) => setCurrentPage(pageNumber); //分頁相關

  // 點擊圖標切換收藏狀態
  const handleToggleFav = (productId) => {
    // 向後端發送 POST 請求以移除收藏
    fetch(`http://localhost:3005/api/wishlist-product/${productId}`, {
      method: 'POST',
      credentials: 'include',
    })
    .then((res) => {
      if (res.ok) {
          // 如果移除收藏成功，更新收藏狀態
          setFavoriteProductIds(prevIds => prevIds.filter(id => id !== rentId))

          Swal.fire({
              title: '已從收藏清單移除',
              icon: 'success',
              zIndex: '9999999',
          })
          // 操作完成後，使用 fetchFavorites 刷新數據
          fetchFavorites();
      }
      else {
          // 如果收藏失敗，檢查錯誤訊息是否為授權失敗
          return res.json()
      }
  })
  .catch((error) => {
      console.log('收藏狀態切換失敗', error);
      // 在這裡處理錯誤
  });
};
    return (
        <>
            <div className={`${styles.containerRWD} container`}>
                <div className="row">
                    <div className={`${styles.boxMargin} col-12 col-sm-3`}>
                        <h5>
                            會員中心 /{" "}
                            <a className={styles.noBottom} href="">
                                <span className={styles.bread}>我的收藏</span>
                            </a>
                        </h5>
                    </div>
                    <div className={`${styles.tabsMargin} col-12  col-sm-9 pt-3`}>
                        <ul className={`${styles.ulBorder} list-unstyled d-flex justify-content-around text-center`}>
                            <div className={`${styles.active1}`}> <li className='pb-2'><Link className={styles.noBottom} href="./wishlist">商品收藏</Link></li> </div>
                            <div style={{ width: '352px' }}> <li className='pb-2'><Link className={styles.noBottom} href="./wishlist-rent">租借收藏</Link></li></div>
                            <div style={{ width: '352px' }}> <li className='pb-2'><Link className={styles.noBottom} href="./wishlist-course">課程收藏</Link></li></div>
                        </ul>
                    </div>
                </div>
                <div className="row">
                    <Sidebar />
                    <div className={`${styles.rwdMargin} col-12 col-sm-9 py-2`}>
                        <div className="d-flex  align-items-end pb-3">
                            <span className={`${styles.perpageColor} ms-auto`} >共收藏 {wishlist.length} 件</span>
                            <select className="ms-4" name="order" id="order" onChange={handleSortChange} >
                                <option value="">按加入順序排列</option>
                                <option value="1">從編號A到Z</option>
                                <option value="2">從編號Z到A</option>
                            </select>
                        </div>
                        {dataToShow.length === 0 ? (                         
                                <div style={{ textAlign: 'center' }}>
                                    <h3>無收藏結果</h3>
                                </div>
                            ) : (
                        dataToShow.map((product) => (
                            <div key={product.id} className={` me-2 my-2 ${styles.box3}`}>
                                <figcaption className={styles.avatar}>
                                    <a href={`/product/${product.product_id}`}>
                                        <img
                                            src={`/images/product/${product.image_url}`}
                                            alt="" />
                                    </a>
                                </figcaption>
                                <a href={`/product/${product.product_id}`}>
                                    <h6 className={`${styles2.name} ${styles2.singleEllipsis1}`}>{product.name}</h6>
                                </a>
                                <div className={`${styles2.box4} mt-4`}>${Math.round(product.price * 0.8)}</div>
                                <div className={styles2.bbox}>
                                    <p className={styles2.box5}>${product.price}</p>
                                    <div onClick={() => handleToggleFav(product.product_id)} className={`${styles2.iconContainer}`} style={{ fontSize: '1.2rem', color: 'red' }}>
                                        <FaHeart />
                                    </div>
                                </div>
                            </div>
                        ))
                        )}
                    </div>
                    <div className="col-3" />
                    {dataToShow.length === 0 ? (
                                // 如果沒有數據要顯示，這裡可以放置一些提示或其他內容，或者直接省略
                                
                                <div style={{ textAlign: 'center' }}>
                                    {/* <h3>無收藏結果</h3> */}
                                   
                                </div>
                            ) : (
                    shouldShowPagination && (
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
                                                onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}
                                            >
                                                 <span aria-hidden="true"><BiSolidLeftArrow /></span>
                                            </a>
                                        </li>

                                        {/* 頁碼按鈕 */}
                                        {Array.from({ length: totalPageCount }, (_, index) => {
                                            const page = index + 1
                                            if (
                                                page === 1 || // 第一頁
                                                page === currentPage || // 目前頁面
                                                page === totalPageCount || // 最後一頁
                                                Math.abs(currentPage - page) <= 1 || // 相鄰頁面
                                                (currentPage <= 3 && page <= 5) || // 目前頁面在前五頁
                                                (currentPage >= totalPageCount - 2 &&
                                                    page >= totalPageCount - 4) // 目前頁面在後五頁
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
                                                            onClick={() => paginate(index + 1)}
                                                        >
                                                            {page}
                                                        </a>
                                                    </li>
                                                )
                                            } else if (
                                                (currentPage > 3 && page === 2) || // 省略號前面的頁碼
                                                (currentPage < totalPageCount - 2 &&
                                                    page === totalPageCount - 1) // 省略號後面的頁碼
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
                                            className={`page-item pb-1 ps-2 ${currentPage === totalPageCount ? 'disabled' : ''
                                                }`}
                                        >
                                            <a
                                                className="page-link rounded-0"
                                                href="#"
                                                aria-label="Next"
                                                onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(wishlist.length / productsPerPage)}
                                            >
                                                <span aria-hidden="true"><BiSolidRightArrow /></span>
                                            </a>
                                        </li>
                        {/* <li className="page-item">
                            <button className="page-link" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                                <GoTriangleLeft />
                            </button>
                        </li>
                        {Array.from({ length: totalPageCount }, (_, index) => (
                            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => paginate(index + 1)}>
                                    {index + 1}
                                </button>
                            </li>
                        ))}
                        <li className="page-item">
                            <button className="page-link" onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(wishlist.length / productsPerPage)}>
                                <GoTriangleRight />
                            </button>
                        </li> */}
                    </ul>
                    )
                            )}
                </div>
            </div>
    </>
  )
}
