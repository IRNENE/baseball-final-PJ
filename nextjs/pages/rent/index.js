import React, { useState, useEffect, useRef } from 'react'
import styles from './productlist.module.css'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai' // 导入爱心图标
import favorite from '@/public/images/course/Rectangle false.svg'
import favoriteLove from '@/public/images/course/Rectangle true.svg'
import { GoTriangleLeft } from 'react-icons/go'
import { GoTriangleRight } from 'react-icons/go'
// import Modal from 'react-bootstrap/Modal'
// import Button from 'react-bootstrap/Button'
import Link from 'next/link'
import Image from 'next/image'
import Swal from 'sweetalert2'
import { initUserData, useAuth } from '@/hooks/use-auth'
import { BiSolidLeftArrow, BiSolidRightArrow } from 'react-icons/bi'

//商品分類
const classOptions = ['球', '球棒', '帽子', '手套', '球鞋', '裝備', '護具']

const classDropdownOptions = {
  球: ['硬式', '軟式'],
  球棒: ['木棒', '鋁棒'],
  帽子: ['球帽', '打擊頭盔'],
  手套: ['左手', '右手'],
  球鞋: ['釘鞋', '鋁棒'],
  裝備: ['裝備袋', '球袋'],
  護具: ['捕手護具', '打擊護具'],
}

//品牌分類
const brandOptions = [
  {
    id: 'ASICS',
  },
  {
    id: 'BRETT',
  },
  {
    id: 'EASTON',
  },
  {
    id: 'FILA',
  },
  {
    id: 'MIZUNO',
  },
  {
    id: 'SSK',
  },
  {
    id: 'Nike',
  },
  {
    id: 'OAKLEY',
  },
  {
    id: 'ZETT',
  },
  {
    id: 'New Balance',
  },
  {
    id: 'UNDER ARMOUR',
  },
]

//顏色選項
const colorOptions = ['黑', '白', '紅', '黃', '藍', '綠', '橘']

export default function Productlist() {
  // 顯示在排序的文字 (根據選擇的input)
  const inputRef = useRef()
  const handleTextChange = (e) => {
    // console.log(e.target.value)
    inputRef.current.innerText = e.target.value
    // if(e.target.value === "asc"){
    //   inputRef.current.innerText = '價格由低到高'

    // }
  }
  // 注意1: 初始值至少要空陣列，因為資料是物件陣列，且初次render是使用初始值
  // 注意2: 應用執行過程中，需要保持狀態一定的資料類型
  const [currentPage, setCurrentPage] = useState(1)
  // 條件用
  const [nameLike, setNameLike] = useState('')
  const [brandId, setBrandId] = useState([])
  const [priceGte, setPriceGte] = useState(0)
  const [priceLte, setPricelte] = useState(10000)
  // 用於存儲選中的顏色
  const [selectedColors, setSelectedColors] = useState([])
  console.log(selectedColors) // 确认前端接收到的颜色选择值
  // 商品種類
  const [class_id, setclass_id] = useState([])
  // 商品材質的篩選
  const [otherId, setOtherId] = useState([])
  // 排序(前面為排序欄位，後面參數asc為從小到大，desc為從大到小排序)
  const [orderby, setOrderby] = useState({ sort: 'id', order: 'asc' })

  const handleSortByNewest = () => {
    setOrderby({ sort: 'id', order: 'asc' })
    // handleSearch()
  }

  const handleSortByPriceDesc = () => {
    setOrderby({ sort: 'price', order: 'desc' })
    // handleSearch()
  }

  const handleSortByPriceAsc = () => {
    console.log('handleSortByPriceAsc called')
    setOrderby({ sort: 'price', order: 'asc' })
    // handleSearch()
  }

  // handleSearch() 當我點擊setOrderby({ sort: 'price', order: 'asc' })會先
  // 因異步執行原因，導致setOrderby執行的同時也執行了handleSearch()，而handleSearch()使用的orderby的前一個state
  useEffect(() => {
    handleSearch()
  }, [orderby, class_id, brandId, selectedColors])

  //選的值
  const [selectedClass, setSelectedClass] = useState('全部')

  //手機板
  const [filterText, setFilterText] = useState('')
  const [showFilter, setShowFilter] = useState(false) // 新增狀態來控制篩選內容的顯示與隱藏

  // 新的状态和效果钩子用于记录筛选条件数量
  const [filterCount, setFilterCount] = useState(0)

  const calculateFilterCount = () => {
    const brandCount = brandId.length // 品牌选择的数量
    const colorCount = selectedColors.length // 颜色选择的数量

    // 计算总的筛选条件数量
    const totalCount = brandCount + colorCount

    // 更新状态
    setFilterCount(totalCount)
  }

  useEffect(() => {
    calculateFilterCount()
  }, [brandId, selectedColors])

  // 當點擊篩選時更新狀態並顯示相關內容
  const handleFilterClick = (filter) => {
    setFilterText(filter)
    setShowFilter(true) // 點擊篩選時設置為顯示篩選內容
  }
  // const handleSortChange = () => {
  //   setOrderby((prevOrderby) => {
  //     const newOrderby = {
  //       ...prevOrderby,
  //       sort: 'price',
  //       order: 'desc',
  //     }
  //     console.log('orderby before update:', prevOrderby)
  //     console.log('new orderby:', newOrderby)
  //     return newOrderby
  //   })
  // }

  // 分頁設定
  const [page, setPage] = useState(1)
  const [perpage, setPerpage] = useState(20)

  //  最後得到的資料
  const [total, setTotal] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [products, setProducts] = useState([])

  //收藏用的 wun
  const { auth, setAuth } = useAuth() // 使用對象解構語法
  const { isAuth, useData } = auth
  const userData = auth.userData
  const [favoriteRentIds, setFavoriteRentIds] = useState([]) // 租借收藏清單
  const [favoriteStatus, setFavoriteStatus] = useState({}) // 使用物件來存儲每個商品的收藏狀態

  //若有更換使用者更新我的收藏愛心判斷wun
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch(
          `http://localhost:3005/api/wishlist-rent/user/${userData.id}/`,
          {
            method: 'GET',
            credentials: 'include',
          }
        )
        const favoriteRents = await response.json()
        const favorite = response.data.map((item) => item.product_id)
        setFavoriteRentIds(favorite)
        console.log('favoriteRentIds:', favorite)
      } catch (error) {
        console.error('Error fetching favorite data:', error)
      }
    }
    fetchFavorites()
  }, [userData.id])

  // 獲取USER的收藏商品列表
  const fetchFavorites = async () => {
    console.log('抓取此會員的收藏列表...')
    try {
      const response = await fetch(
        `http://localhost:3005/api/wishlist-rent/user/${userData.id}/`,
        {
          method: 'GET',
          credentials: 'include',
        }
      )
      const favoriteRents = await response.json()
      // 將收藏商品列表中的商品ID提取出來，存儲在favoriteProducts變數中
      // console.log(favoriteProducts);
      const favorite = favoriteRents.map((item) => item.product_id)

      // 將提取出來的商品ID存儲在favoriteProductIds狀態中，以便後續使用
      setFavoriteRentIds(favorite)
      console.log('我的收藏清單編號:', favorite)
    } catch (error) {
      console.error('Error fetching favorite data:', error)
    }
  }
  // 使用useEffect鉤子來確保在userData.id發生變化時調用fetchFavorites函數
  useEffect(() => {
    fetchFavorites()
  }, [userData.id])

  // // 點擊圖標切換收藏狀態
  // const handleToggleFav = (productId) => {
  //   // 檢查使用者是否已登入
  //   if (userData.name == "") {
  //     Swal.fire({
  //       icon: 'error',
  //       zIndex: '9999999',
  //       title: '請先完成登入',
  //     });
  //     return;
  //   }

  //   // 向後端發送 POST 請求以添加收藏
  //   fetch(`http://localhost:3005/api/wishlist-rent/${productId}`,
  //     {
  //       method: 'POST',
  //       credentials: 'include'
  //     })
  //     .then((res) => {
  //       if (res.ok) {
  //         // 如果收藏成功，更新收藏狀態
  //         setProducts(prevProducts => {
  //           return prevProducts.map(product => {
  //             if (product.id === productId) {
  //               // 切换收藏狀態
  //               return { ...product, fav: !product.fav };
  //             }
  //             return product;
  //           });
  //         });
  //         // 操作完成後，使用 fetchFavorites 刷新數據
  //         fetchFavorites();
  //       }

  //       else {
  //         // 如果收藏失敗，檢查錯誤訊息是否為授權失敗
  //         return res.json()
  //       }
  //     })
  //     .catch((error) => {
  //       console.log('收藏狀態切換失敗', error);
  //       // 在這裡處理錯誤
  //     });
  // };

  // 更新 handleLikeProduct 函数
  const handleLikeProduct = (productId) => {
    // 檢查使用者是否已登入
    if (userData.name == '') {
      Swal.fire({
        icon: 'error',
        zIndex: '9999999',
        title: '請先完成登入',
      })
      return
    }

    const likedProducts =
      JSON.parse(localStorage.getItem('likedProducts')) || []
    let updatedLikedProducts

    if (likedProducts.includes(productId)) {
      // 如果商品已被喜歡，則將其從喜歡列表中移除
      updatedLikedProducts = likedProducts.filter((id) => id !== productId)
    } else {
      updatedLikedProducts = [...likedProducts, productId]
    }
    localStorage.setItem('likedProducts', JSON.stringify(updatedLikedProducts))

    // 更新組件狀態以觸發重新渲染
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, liked: !product.liked }
          : product
      )
    )
    // 向後端發送 POST 請求以更新收藏狀態
    fetch(`http://localhost:3005/api/wishlist-rent/${productId}`, {
      method: 'POST',
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) {
          // 如果操作失敗，處理錯誤訊息
          return res.json()
        }
        // 操作完成後，使用 fetchFavorites 刷新數據
        fetchFavorites()
      })
      .catch((error) => {
        console.log('操作狀態切換失敗', error)
        // 在這裡處理錯誤
      })
  }

  const getProducts = async (params = {}) => {
    // 用URLSearchParams產生查詢字串
    const searchParams = new URLSearchParams(params)

    const url = `http://localhost:3005/api/rent?${searchParams.toString()}`

    try {
      const res = await fetch(url)
      const data = await res.json()
      console.log(data)

      // 設定到狀態中 ===> 進入update階段，觸發重新渲染(re-render) ===> 顯示資料
      if (data.status === 'success') {
        setTotal(data.data.total)
        setPageCount(data.data.pageCount)
        setProducts(data.data.products)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const handleSearch = () => {
    const params = {
      page: 1, // 每次搜尋會返回第一頁
      perpage,
      brand_id: brandId,
      name: nameLike,
      price_gte: priceGte,
      price_lte: priceLte,
      sort: orderby.sort,
      order: orderby.order,
      colors: selectedColors.join(','), // 將選中的顏色轉換為字串，以逗號分隔
      class_id: class_id,
      other_id: otherId, // 添加 other_id 参数
    }
    // 每次搜尋會返回第一頁
    setPage(1)
    // 输出 params 对象，确认参数是否正确设置
    console.log('Params:', params)

    getProducts(params)
  }

  // 樣式2: 元件初次渲染之後(after)執行一次，之後不會再執行
  // 近似於componentDidMount執行時間點
  useEffect(() => {
    getProducts()
  }, [])

  useEffect(() => {
    const params = {
      page,
      perpage,
      brand_id: brandId,
      name: nameLike,
      price_gte: priceGte,
      price_lte: priceLte,
      sort: orderby.sort,
      order: orderby.order,
      colors: selectedColors.join(','), // 將選中的顏色轉換為字串，以逗號分隔
      class_id: class_id,
      other_id: otherId, // 添加 other_id 参数
    }

    getProducts(params)
  }, [page])

  //手機版篩選
  // 將 isDropdownOpen 狀態改為物件

  const [isDropdownOpen, setIsDropdownOpen] = useState(
    Array(classOptions.length).fill(false)
  )

  const toggleDropdown = (index) => {
    const newDropdownState = [...isDropdownOpen]
    newDropdownState[index] = !newDropdownState[index]
    setIsDropdownOpen(newDropdownState)
  }

  //手機版
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement
    if (
      scrollHeight - scrollTop === clientHeight &&
      products.length < total &&
      !isLoadingMore
    ) {
      // 页面已经滚动到底部，并且还有更多商品未加载完毕，并且当前不在加载状态
      loadMoreProducts()
    }
  }
  const loadMoreProducts = async () => {
    if (!isLoadingMore && products.length < total) {
      setIsLoadingMore(true)

      // 模拟异步加载数据
      try {
        const nextPage = page + 1 // 获取下一页的页码
        const params = {
          page: nextPage,
          perpage,
          brand_id: brandId,
          name: nameLike,
          price_gte: priceGte,
          price_lte: priceLte,
          sort: orderby.sort,
          order: orderby.order,
          colors: selectedColors.join(','),
          class_id: class_id,
          other_id: otherId,
        }
        const newProducts = await getProducts(params) // 获取下一页的产品数据

        setPage(nextPage) // 更新页码
        setProducts([...products, ...newProducts])
        // 平滑滚动页面
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth',
        })
      } catch (error) {
        console.error('Failed to load more products:', error)
      }

      setIsLoadingMore(false)
    }
  }

  useEffect(() => {
    // 当屏幕宽度小于 576px 时，监听滚动事件
    if (window.innerWidth < 576) {
      window.addEventListener('scroll', handleScroll)
    }

    return () => {
      // 组件卸载时移除滚动事件监听器
      window.removeEventListener('scroll', handleScroll)
    }
  }, [products, total]) // 仅在组件挂载时添加滚动事件监听器

  //手機版的

  const handleDropdownItemClick = (classItem, option) => {
    // 更新商品分类和其他选项
    updateClassAndOption(classItem, option)

    // 更新球的值
    setSelectedClass(option)

    // 关闭下拉框
    const closeDropdown = () => {
      // 获取所有下拉框元素
      const dropdowns = document.querySelectorAll('.dropdown-content')

      // 遍历所有下拉框元素，将它们的显示状态设置为关闭
      dropdowns.forEach((dropdown) => {
        dropdown.style.display = 'none'
      })

      // 设置所有下拉框的开启状态为 false
      setIsDropdownOpen(Array(classOptions.length).fill(false))
    }

    // 关闭当前下拉框
    const index = classOptions.indexOf(option)
    setIsDropdownOpen((prevState) => {
      const newState = [...prevState]
      newState[index] = false
      return newState
    })

    // 最后关闭下拉框
    closeDropdown()

    // 找到要更改文本的元素
    const textElement = document.getElementById('text-to-change')

    // 将文本内容更改为被点击选项的值
    if (textElement) {
      textElement.textContent = option
    }

    // 觸發搜尋
    const params = {
      page: 1,
      perpage,
      brand_id: brandId,
      name: nameLike,
      price_gte: priceGte,
      price_lte: priceLte,
      sort: orderby.sort,
      order: orderby.order,
      colors: selectedColors.join(','), // 將選中的顏色轉換為字串，以逗號分隔
      class_id: [classItem], // 更新商品分类
      other_id: [option], // 更新其他选项
    }
    getProducts(params)
  }

  const updateClassAndOption = (classItem, option) => {
    // 清空其他選項的狀態
    setOtherId([])

    // 更新商品分類狀態
    setclass_id([classItem])

    // 更新其他選項的狀態
    setOtherId([option])
    console.log(`Clicked on option: ${option}`)
    // 觸發搜尋
    const params = {
      page: 1,
      perpage,
      brand_id: brandId,
      name: nameLike,
      price_gte: priceGte,
      price_lte: priceLte,
      sort: orderby.sort,
      order: orderby.order,
      colors: selectedColors.join(','),
      class_id: [classItem], // 更新商品分类
      other_id: [option], // 更新其他选项
    }
    getProducts(params)
  }

  return (
    <>
      <div className={styles.bi}>
        <div className={styles.dht}>
          <h1 className={styles.bi1}>商品租借</h1>
          <h4 className={styles.bi2}>提供最專業的用品 讓您場上表現不打折</h4>
        </div>
      </div>

      <div className="container">
        <div className="row">
          {/* 篩選商品分類 */}
          <div className={`col-2 ${styles['left-half']}`}>
            <div className={styles.na}>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a>租借商品</a>
                  </li>
                  <li className="breadcrumb-item">
                    <a href="#" onClick={() => handleFilterClick('篩選')}>
                      篩選
                    </a>
                  </li>
                  {/* 顯示篩選的字 */}
                  {filterText && showFilter && (
                    <li className="breadcrumb-item active" aria-current="page">
                      {filterText}
                    </li>
                  )}
                </ol>
              </nav>
            </div>
            <h6>商品分類</h6>
            <div className="d-flex flex-column">
              {classOptions.map((classItem) => (
                <label
                  key={classItem}
                  className="mx-1 mt-2 d-flex align-items-center"
                >
                  <input
                    className={`${styles['form-check-input']}`}
                    type="checkbox"
                    value={classItem}
                    checked={class_id.includes(classItem)}
                    onChange={(e) => {
                      const targetValue = e.target.value
                      setclass_id((prev) =>
                        prev.includes(targetValue)
                          ? prev.filter((item) => item !== targetValue)
                          : [...prev, targetValue]
                      )
                    }}
                  />
                  {classItem}
                </label>
              ))}
            </div>

            {/* <div className={`${styles['form-check']}`}>
              <input
                className={`${styles['form-check-input']}`}
                type="checkbox"
                name="flexRadioDefault"
                id="flexRadioDefault2"
                defaultChecked=""
              />
              <label className="form-check-label" htmlFor="flexRadioDefault2">
                帽子
              </label>
            </div> */}
            <hr className={styles.hrr} />
            <div className="d-flex flex-column">
              <h6>品牌分類</h6>
              {brandOptions.map((brand) => {
                return (
                  <label
                    key={brand.id}
                    className="mx-1 mt-2 d-flex align-items-center"
                  >
                    <input
                      className={`${styles['form-check-input']}`}
                      type="checkbox"
                      value={brand.id}
                      checked={brandId.includes(brand.id)}
                      onChange={(e) => {
                        const targetValue = e.target.value
                        if (brandId.includes(targetValue)) {
                          setBrandId(brandId.filter((id) => id !== targetValue))
                        } else {
                          setBrandId([...brandId, targetValue])
                        }
                      }}
                    />
                    {brand.id}
                  </label>
                )
              })}
            </div>

            <hr className={styles.hrr} />
            <div className="d-flex flex-column">
              <h6>顏色</h6>
              {colorOptions.map((color) => (
                <label
                  key={color}
                  className="mx-1 mt-2 d-flex align-items-center"
                >
                  <input
                    className={`${styles['form-check-input']}`}
                    type="checkbox"
                    value={color}
                    checked={selectedColors.includes(color)}
                    onChange={(e) => {
                      const targetValue = e.target.value
                      setSelectedColors((prev) =>
                        prev.includes(targetValue)
                          ? prev.filter((color) => color !== targetValue)
                          : [...prev, targetValue]
                      )
                    }}
                  />
                  {color}
                </label>
              ))}
            </div>
            <hr className={styles.hrr} />
          </div>
          <div className="col">
            <div
              className={`d-flex justify-content-between ${styles['u-right']}`}
            >
              <h3>全部商品</h3>
              <div className="d-flex flex-column " style={{ width: '300px' }}>
                <div className="d-flex ">
                  <input
                    className={`form-control ${styles['fc']}`}
                    type="text"
                    value={nameLike}
                    placeholder="輸入關鍵字搜尋商品"
                    onChange={(e) => {
                      setNameLike(e.target.value)
                    }}
                  />
                  <button
                    className={`btn btn btn-secondary ${styles['sc']}`}
                    onClick={() => {
                      handleSearch()
                    }}
                  >
                    <span className={`${styles['bt']}`}>搜尋</span>
                  </button>
                </div>
                <div className="d-flex justify-content-end mt-4 align-items-center">
                  <div className={`${styles.hm}`}>共 {total} 件商品</div>

                  <select
                    className={`form-select  rounded-0  ppx  ${styles.ppx} `}
                    value={`${orderby.sort},${orderby.order}`}
                    onChange={(e) => {
                      const selected = e.target.value
                      setOrderby({
                        sort: selected.split(',')[0],
                        order: selected.split(',')[1],
                      })
                    }}
                  >
                    <option value="id,asc">排序</option>
                    <option value="brand_id,asc">最熱門</option>
                    <option value="id,desc">最新上架</option>
                    <option value="price,asc">價格低到高</option>
                    <option value="price,desc">價格高到低</option>
                  </select>
                </div>
              </div>
            </div>
            {/*手機板篩選*/}
            <h3 className={styles['allp']}>全部商品</h3>
            <div className={`d-flex ${styles['alls']}`}>
              <input
                className={`form-control ${styles['fc']}`}
                ype="text"
                value={nameLike}
                placeholder="輸入關鍵字搜尋商品"
                onChange={(e) => {
                  setNameLike(e.target.value)
                }}
              />
              <button
                className={`btn btn btn-secondary ${styles['sc']}`}
                onClick={() => {
                  handleSearch()
                }}
              >
                <span className={`${styles['bt']}`}>搜尋</span>
              </button>
            </div>
            <div className={`row-cols-3 d-flex ${styles['p-filter']}`}>
              <div className={`col ${styles['col1']}`}>
                {/* 點擊分類時彈出視窗 */}
                <a
                  className=""
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  <p>分類</p>
                  <h6 style={{ color: 'var(--main  )' }}>{selectedClass}</h6>
                </a>
                <div
                  className="modal fade"
                  id="exampleModal"
                  tabIndex={-1}
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div className={`modal-dialog ${styles['md1']}`}>
                    <div className="modal-content ">
                      <div className="modal-body">
                        <div className="sidebar ">
                          <div className="dropdown ">
                            {/* 在渲染時為每個下拉選單綁定獨立的狀態*/}
                          </div>
                          {classOptions.map((option, index) => (
                            <div key={index}>
                              <div className={`${styles['dropdown']}`}>
                                <button
                                  onClick={() => toggleDropdown(index)}
                                  className={`${styles['pcb']}`}
                                >
                                  {option} {/* 将被点击的选项显示在按钮中 */}
                                  {/* 添加箭頭圖標 */}
                                  {isDropdownOpen[index] ? (
                                    <span>&#9650;</span> // 向上箭頭表示打開狀態
                                  ) : (
                                    <span>&#9660;</span> // 向下箭頭表示關閉狀態
                                  )}
                                </button>

                                {isDropdownOpen[index] && (
                                  <div
                                    className={`${styles['dropdown-content']}`}
                                  >
                                    <ul className={`${styles['nl']}`}>
                                      {classDropdownOptions[option]?.map(
                                        (item, itemIndex) => (
                                          <li key={itemIndex}>
                                            {/* 在这里调用 handleDropdownItemClick 函数 */}
                                            <button
                                              onClick={() =>
                                                handleDropdownItemClick(
                                                  option,
                                                  item
                                                )
                                              }
                                              className={`${styles['pcb']}`}
                                            >
                                              {item}
                                            </button>
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        {/* 其他模態框內容 */}
                      </div>

                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          關閉
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`col ${styles['col2']}`}>
                {/* 筛选按钮 */}
                <a
                  classname=""
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal1"
                >
                  <p>篩選</p>
                  <h6 style={{ color: 'var(--main  )' }}>
                    篩選[{filterCount}]
                  </h6>
                </a>
                {/* 模态框 */}
                <div
                  className="modal fade"
                  id="exampleModal1"
                  tabIndex={-1}
                  aria-labelledby="exampleModalLabel1"
                  aria-hidden="true"
                >
                  <div className={`modal-dialog ${styles['md1']}`}>
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5
                          className="modal-title mx-auto"
                          id="exampleModalLabel1"
                        >
                          篩選
                        </h5>
                        <button
                          type="button"
                          className={`btn-close ${styles['bc']}`}
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        />
                      </div>
                      <div className="modal-body">
                        <p>品牌</p>
                        <div className="row">
                          {brandOptions.map((brand) => (
                            <div key={brand.id} className="col-4">
                              <label
                                className="mx-1"
                                style={{ whiteSpace: 'nowrap' }}
                              >
                                <input
                                  className={`${styles['form-check-input']}`}
                                  type="checkbox"
                                  value={brand.id}
                                  checked={brandId.includes(brand.id)}
                                  onChange={(e) => {
                                    const targetValue = e.target.value
                                    console.log(
                                      'Checkbox clicked:',
                                      targetValue
                                    )
                                    if (brandId.includes(targetValue)) {
                                      setBrandId(
                                        brandId.filter(
                                          (id) => id !== targetValue
                                        )
                                      )
                                    } else {
                                      setBrandId([...brandId, targetValue])
                                    }
                                    console.log('Brand ID state:', brandId)
                                  }}
                                />
                                {brand.id}
                              </label>
                            </div>
                          ))}
                        </div>

                        <hr />
                        <p>顏色</p>
                        <div
                          className="form-check"
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)', // 每行四列，每列等宽
                            gap: '10px',
                          }}
                        >
                          {colorOptions.map((color) => (
                            <label key={color} className="mx-1">
                              <input
                                className={`${styles['form-check-input']}`}
                                type="checkbox"
                                value={color}
                                checked={selectedColors.includes(color)}
                                onChange={(e) => {
                                  const targetValue = e.target.value
                                  setSelectedColors((prev) =>
                                    prev.includes(targetValue)
                                      ? prev.filter(
                                          (color) => color !== targetValue
                                        )
                                      : [...prev, targetValue]
                                  )
                                }}
                              />
                              {color}
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="modal-footer">
                        {/* 底部按钮 */}
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          關閉
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/*手機排序*/}
              <div className={`col ${styles['col1']}`}>
                <a
                  className=""
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal3"
                >
                  <p>排序</p>
                  <h6 ref={inputRef} style={{ color: 'var(--main  )' }}>
                    最新上架
                  </h6>
                </a>

                <div
                  className="modal fade"
                  id="exampleModal3"
                  tabIndex={-1}
                  aria-labelledby="exampleModalLabel3"
                  aria-hidden="true"
                >
                  <div className={`modal-dialog  ${styles['md']}`}>
                    <div className="modal-content">
                      <div className={`modal-header ${styles['mh']}`}>
                        <h5
                          className="modal-title mx-auto"
                          id="exampleModalLabel3"
                        >
                          排序
                        </h5>
                        {/*這是選的叉叉的按鈕*/}
                        <button
                          type="button"
                          className={`btn-close ${styles['bc']}`}
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="modal-body">
                        <div className="filter-popup d-flex justify-content-center">
                          <div className="form-check">
                            <input
                              type="radio"
                              name="sort"
                              value="最新上架"
                              onClick={(e) => {
                                handleSortByNewest()
                                handleTextChange(e)
                              }}
                              checked={
                                orderby.sort === 'id' && orderby.order === 'asc'
                                  ? true
                                  : false
                              }
                            />
                            <label htmlFor="sortNow">最新上架</label>
                            <br />
                            <input
                              type="radio"
                              name="sort"
                              value="價格高到低"
                              onClick={(e) => {
                                handleSortByPriceDesc()
                                handleTextChange(e)
                              }}
                            />
                            <label htmlFor="sortByDescPrice">
                              價格由高至低
                            </label>
                            <br />
                            <input
                              type="radio"
                              name="sort"
                              value="價格低到高"
                              onClick={(e) => {
                                handleSortByPriceAsc()
                                handleTextChange(e)
                              }}
                            />
                            <label htmlFor="sortByAscPrice">價格由低至高</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/*手機板共???件商品*/}
            <div className={styles.pcom}>
              <p>共{total}件商品</p>
            </div>
            {/*手機板商品*/}
            <div
              className={`row row-cols-2 row-cols-md-4 g-4 mb-4 ${styles['p-pl']}`}
            >
              {products.map((v, i) => (
                <div key={i} className="col">
                  <div className={`card ${styles['cs']}`}>
                    <Link href={`/rent/detail?pid=${v.id}`}>
                      <img
                        src={`/images/rent/${v.img}`}
                        className="card-img-top"
                        alt="..."
                      />
                      <h5 className="card-title">{v.name}</h5>
                    </Link>
                    <div>
                      <h6 className={`card-text ${styles['save']}`}>
                        ${Math.round(v.price * 0.8)} / 1天
                      </h6>
                      <div className={`${styles['ti']}`}>
                        <p className={`${styles['pt']}`}>$ {v.price} / 1天</p>
                        {favoriteRentIds.includes(v.id) ? (
                          <AiFillHeart
                            style={{ color: 'var(--main)', fontSize: '1.5rem' }}
                            onClick={() => handleLikeProduct(v.id)}
                          />
                        ) : (
                          <AiOutlineHeart
                            style={{ color: 'var(--main)', fontSize: '1.5rem' }}
                            onClick={() => handleLikeProduct(v.id)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* 只有在有搜索到商品时才显示商品 */}
            {products.length > 0 ? (
              <div
                className={`row row-cols-2 row-cols-md-4 g-4 mt-0  ${styles['nc']} `}
              >
                {products.map((v, i) => (
                  <div key={i} className={`col ${styles['pcl']} `}>
                    <div className={`card ${styles['cs']}`}>
                      <Link href={`/rent/detail?pid=${v.id}`}>
                        <img
                          src={`/images/rent/${v.img}`}
                          className={`card-img-top ${styles['cit']}`}
                          alt="..."
                        />
                        <h5 className="card-title mt-2">{v.name}</h5>
                      </Link>

                      <div>
                        <h6 className={`card-text ${styles['save']}`}>
                          ${Math.round(v.price * 0.8)} / 1天
                        </h6>
                        <div className={`${styles['ti']}`}>
                          <p className={`${styles['pt']}`}>$ {v.price} / 1天</p>

                          {/* 根据商品的 liked 状态显示不同的图标 */}
                          {favoriteRentIds.includes(v.id) ? (
                            <AiFillHeart
                              style={{
                                color: 'var(--main)',
                                fontSize: '1.5rem',
                              }}
                              onClick={() => handleLikeProduct(v.id)}
                            />
                          ) : (
                            <AiOutlineHeart
                              style={{
                                color: 'var(--main)',
                                fontSize: '1.5rem',
                              }}
                              onClick={() => handleLikeProduct(v.id)}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center mt-3">
                <h3>未找到相關商品</h3>
                <h6>請嘗試使用其他關鍵字</h6>
              </div>
            )}
            {/* 只有在有搜索到商品时才显示分页 */}
            {products.length > 0 && (
              <nav aria-label={`${styles['bp']}`}>
                <ul
                  className={`pagination justify-content-center mt-5 ${styles['bp']}`}
                >
                  {/* <li className={`page-item ${styles['p-item']}`}>
                    <a
                      className="page-link"
                      href="#"
                      onClick={() => {
                        // min is 1 (不能小於1)
                        const newPageNow = page - 1 > 1 ? page - 1 : 1
                        setPage(newPageNow)
                      }}
                      aria-label="Previous"
                    >
                      <span aria-hidden="true">
                        <GoTriangleLeft />
                      </span>
                    </a>
                  </li> */}
                  <li className={`page-item ps-2`}>
                    <a
                      className={`page-link rounded-0 ${styles.pages1}`}
                      href="#"
                      aria-label="Previous"
                      onClick={() => {
                        // min is 1 (不能小於1)
                        const newPageNow = page - 1 > 1 ? page - 1 : 1
                        setPage(newPageNow)
                        window.scrollTo({ top: 500, behavior: 'smooth' })
                      }}
                    >
                      <span aria-hidden="true">
                        <BiSolidLeftArrow />
                      </span>
                    </a>
                  </li>

                  {Array.from({ length: pageCount }, (_, index) => (
                    <li
                      key={index}
                      className={`page-item ${styles['p-item']} ${
                        index + 1 === page ? 'active' : ''
                      }`}
                    >
                      <a
                        className={`page-link rounded-0 ${styles.pages1}`}
                        href="#"
                        onClick={(e) => {
                          e.preventDefault() // 阻止默认行为
                          setPage(index + 1) // 设置当前页面
                          window.scrollTo({ top: 500, behavior: 'smooth' })
                        }}
                      >
                        {index + 1}
                      </a>
                    </li>
                  ))}
                  {/* {Array.from({ length: pageCount }, (_, index) => {
                    const page = index + 1
                    if (
                      page === 1 || // 第一頁
                      page === currentPage || // 目前頁面
                      page === pageCount || // 最後一頁
                      Math.abs(page - page) <= 1 || // 相鄰頁面
                      (currentPage <= 3 && page <= 5) || // 目前頁面在前五頁
                      (currentPage >= pageCount - 2 && page >= pageCount - 4) // 目前頁面在後五頁
                    ) {
                      return (
                        <li
                          key={page}
                          className={`page-item ${
                            currentPage === page ? 'active' : ''
                          }`}
                        >
                          <a
                            className={`page-link ${styles.pages1}`}
                            href="#"
                            onClick={(e) => {
                              e.preventDefault() // 阻止默认行为
                              setPage(index + 1) // 设置当前页面
                            }}
                          >
                            {page}
                          </a>
                        </li>
                      )
                    } else if (
                      (currentPage > 3 && page === 2) || // 省略號前面的頁碼
                      (currentPage < pageCount - 2 && page === pageCount - 1) // 省略號後面的頁碼
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
                  })} */}

                  {/* <li className={`page-item ${styles['p-item']}`}>
                    <a
                      className="page-link"
                      href="#"
                      onClick={() => {
                        // max is pageCount (不能大於總頁數)
                        const newPageNow =
                          page + 1 < pageCount ? page + 1 : pageCount
                        setPage(newPageNow)
                      }}
                      aria-label="Next"
                    >
                      <span aria-hidden="true">
                        <GoTriangleRight />
                      </span>
                    </a>
                  </li> */}
                  <li className={`page-item pb-1 ps-2 `}>
                    <a
                      className={`page-link rounded-0 ${styles.pages1}`}
                      href="#"
                      aria-label="Next"
                      onClick={() => {
                        // max is pageCount (不能大於總頁數)
                        const newPageNow =
                          page + 1 < pageCount ? page + 1 : pageCount
                        setPage(newPageNow)
                        window.scrollTo({ top: 500, behavior: 'smooth' })
                      }}
                    >
                      <span aria-hidden="true">
                        <BiSolidRightArrow />
                      </span>
                    </a>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
