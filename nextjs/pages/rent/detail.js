import React, { useState, useEffect } from 'react'
import styles from './rental.module.css'
import { BsBoxSeam } from 'react-icons/bs' //box
import { PiBaseballLight } from 'react-icons/pi'
import { RiShoppingCartLine } from 'react-icons/ri'
import { FaHeart } from 'react-icons/fa'
import { FaRegUserCircle } from 'react-icons/fa'
import { IoMdStar, IoMdStarOutline } from 'react-icons/io' //實心星星 空心星星
import { GoTriangleRight } from 'react-icons/go'
import Link from 'next/link'
import { useRouter } from 'next/router'
import moment from 'moment'
import { initUserData, useAuth } from '@/hooks/use-auth'
import Swal from 'sweetalert2'
import favorite from '@/public/images/course/Rectangle false.svg'
import favoriteLove from '@/public/images/course/Rectangle true.svg'
import Image from 'next/image'

export default function Rent() {
  // 物件狀態的初始值，通常需要把每個屬性的初始值寫出
  // !!注意!! 初次render(渲染)會使用初始值
  // !!注意!! 在應用程式執行過程中，務必要保持狀態維持同樣的資料類型
  const [rent, setRent] = useState({
    id: '',
    name: '',
    price: 0,
    image_url: '',
    description: 0,
    class_id: '',
    stock: 0,
    selectedColor: '', // 新增選擇顏色的屬性
    selectedSize: '', // 新增選擇尺寸的屬性
    quantity: 1, // 添加数量的状态
  })

  const [quantity, setQuantity] = useState(1)
  const descriptionLines = rent.description ? rent.description.split('\n') : []
  // 增加数量的函数
  const handleIncrease = () => {
    setQuantity((prevQuantity) => {
      // 确保增加数量后不会小于0
      return prevQuantity >= 0 ? prevQuantity + 1 : prevQuantity
    })
  }

  // 减少数量的函数
  const handleDecrease = () => {
    setQuantity((prevQuantity) => {
      // 确保减少数量后不会小于0
      return prevQuantity > 1 ? prevQuantity - 1 : prevQuantity
    })
  }
  const [selectedColor, setSelectedColor] = useState('')
  const [image, setImage] = useState('')

  // handleColorChange 函数定义
  const handleColorChange = (color) => {
    setSelectedColor(color)
  }

  useEffect(() => {
    // 根据选定的颜色更新产品图片
    // 假设你有一个名为 rent 的对象，其中包含了各种颜色的图片链接
    // 你也可以从 rent 对象中获取图片链接

    let imageUrl = `/images/rent/${rent.img}` // 初始化图片链接变量

    // 根据选定的颜色更新图片链接
    switch (selectedColor) {
      case '熱門色':
        imageUrl = `/images/rent/${rent.img}`
        console.log(imageUrl) // 设置黑色图片链接
        break
      case '紅':
        imageUrl = `/images/rent/${rent.red}` // 设置红色图片链接
        console.log(imageUrl)
        break
      case '綠':
        imageUrl = `/images/rent/${rent.green}` // 设置绿色图片链接
        console.log(imageUrl)
        break
      case '藍':
        imageUrl = `/images/rent/${rent.blue}` // 设置绿色图片链接
        console.log(imageUrl)
        break
      case '黃':
        imageUrl = `/images/rent/${rent.yellow}` // 设置绿色图片链接
        console.log(imageUrl)
        break
      default:
        imageUrl = rent.img // 默认使用原始图片链接
        console.log(imageUrl)
        break
    }
    console.log(imageUrl)
    // 执行一些更新 rent 状态的逻辑，比如更新图片链接
    setRent((prevRent) => ({
      ...prevRent,
      image_url: imageUrl, // 更新图片链接
    }))
    setImage(imageUrl)
  }, [selectedColor])

  console.log(image)

  // handleSizeChange 函数定义
  const handleSizeChange = (event) => {
    // 從事件中獲取選擇的尺寸值
    const selectedSize = event.target.value

    // 更新狀態中的選擇尺寸屬性
    setRent((prevRent) => ({
      ...prevRent,
      selectedSize: selectedSize,
    }))
  }

  // 宣告出router物件，在其中可以得到兩個有用值
  // router.query，是一個物件，其中有動態路由的參數值pid
  // router.isReady，是一個布林值，代表本頁面元件已完成水合作用，可以得到pid值
  const router = useRouter()
  const { pid } = router.query

  const [similarProducts, setSimilarProducts] = useState([])

  // 與伺服器要求獲取資料的async函式
  const getRent = async (pid) => {
    const url = `http://localhost:3005/api/rent/${pid}`

    // 如果用了async-await，實務上要習慣使用try...catch來處理錯誤
    try {
      // fetch預設是使用GET，不需要加method設定
      const res = await fetch(url)
      // 解析json格式資料成js的資料
      const data = await res.json()
      console.log(data)

      // 為了要確保資料是陣列，所以檢查後再設定
      if (data && data.length > 0 && typeof data[0] === 'object') {
        setRent(data[0])
      } else {
        console.log('服务器回傳資料類型錯誤，無法設定到狀態中')
      }
    } catch (e) {
      console.log('Error fetching data:', e)
    }
  }

  // 樣式2: 頁面初次渲染之後伺服器要求資料
  // 需要監聽router.isReady，當它為true時，才能得到pid
  useEffect(() => {
    console.log('isReady', router.isReady, 'query', router.query)
    // 確保能得從router.query到pid後，再向伺服器要求對應資料
    if (router.isReady) {
      getRent(router.query.pid)
    }
    // eslint-disable-next-line
  }, [router.isReady])
  // eslint會作多餘的檢查，不需要加router.query在相依陣列中

  // 定义获取相似商品数据的异步函数
  const fetchSimilarProducts = async (classId) => {
    try {
      const url = `http://localhost:3005/api/rent?class_id=${classId}`
      const response = await fetch(url)
      const data = await response.json()
      setSimilarProducts(data)
      console.log('相似商品數據:', data)
      // 確保數據是一個陣列
      if (Array.isArray(data.data.products)) {
        setSimilarProducts(data.data.products)
      } else {
        console.error('从服务器获取的数据不是一个数组:', data)
      }
    } catch (error) {
      console.error('从服务器获取相似商品数据时出错:', error)
    }
  }

  useEffect(() => {
    if (router.isReady && pid) {
      getRent(pid)
    }
  }, [router.isReady, pid])

  useEffect(() => {
    if (rent.class_id) {
      fetchSimilarProducts(rent.class_id)
    }
  }, [rent.class_id])

  // 获取今天的日期
  const today = moment().format('YYYY-MM-DD')

  // 使用 useState 來保存選定的開始日期和結束日期狀態，默認為今天
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(startDate)

  // 處理開始日期變化的函數
  const handleStartDateChange = (event) => {
    // 更新選定的開始日期狀態
    setStartDate(event.target.value)
  }

  // 處理結束日期變化的函數
  const handleEndDateChange = (event) => {
    // 更新選定的結束日期狀態
    setEndDate(event.target.value)
    console.log('Selected end date:', event.target.value)
  }

  //收藏  wun
  const { auth, setAuth } = useAuth() // 使用對象解構語法
  const { isAuth, useData } = auth
  const userData = auth.userData
  const [favoriteRentIds, setFavoriteRentIds] = useState([])

  // 獲取此商品評論資料 wun
  const [comment, setComment] = useState([])

  // 評論的fetch   wun
  const fetchComment = () => {
    //  使用 fetch 函數向後端發送 HTTP GET 請求
    const rentId = rent.id
    fetch(`http://localhost:3005/api/comment/rent/${rentId}`)
      .then((response) => {
        // 檢查 HTTP 響應是否成功
        if (!response.ok) {
          throw new Error('無法獲取評論數據')
        }
        // 將 JSON 響應解析為 JavaScript 物件
        return response.json()
      })
      .then((data) => {
        // 在這裡處理從後端獲取到的評論數據
        console.log('評論資料:', data)
        // 你可以根據需要將數據顯示在網頁上的特定位置
        setComment(data)
      })
      .catch((error) => {
        // 如果發生錯誤，輸出錯誤訊息到控制台
        console.error('發生錯誤:', error)
      })
  }

  useEffect(() => {
    fetchComment()
  }, [rent.id])
  // 評論的fetch結束   wun

  // 獲取USER的收藏商品列表
  const fetchFavorites = async () => {
    console.log('抓取我的收藏資料...')
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

  // 點擊圖標切換收藏狀態
  const handleToggleFav = () => {
    // 檢查使用者是否已登入
    if (userData.name == '') {
      Swal.fire({
        icon: 'error',
        zIndex: '9999999',
        title: '請先完成登入',
      })
      return
    }
    // 取得要收藏的商品ID
    const rentId = rent.id
    // 向後端發送 POST 請求以添加收藏
    fetch(`http://localhost:3005/api/wishlist-rent/${rentId}`, {
      method: 'POST',
      credentials: 'include',
    })
      .then((res) => {
        if (res.ok) {
          // 如果收藏成功，更新收藏狀態
          setFavoriteRentIds((prevIds) => {
            if (prevIds.includes(rentId)) {
              // 如果已經收藏，則移除之
              return prevIds.filter((id) => id !== rentId)
            } else {
              // 否則將其加入到收藏夾中
              return [...prevIds, rentId]
            }
          })
          // 彈窗部分
          // console.log(favoriteProductIds)
          // console.log(productId);
          const numberId = parseInt(rentId)
          // console.log(numberId)
          if (favoriteRentIds.includes(numberId)) {
            Swal.fire({
              icon: 'success',
              zIndex: '9999999',
              title: '此收藏已成功移除',
            })
            console.log('收藏已成功移除')
          } else {
            Swal.fire({
              icon: 'success',
              zIndex: '9999999',
              title: '此商品已成功收藏',
            })
            console.log('已加入我的收藏')
          }
          // 操作完成後，使用 fetchFavorites 刷新數據
          fetchFavorites()
        } else {
          // 如果收藏失敗，檢查錯誤訊息是否為授權失敗
          return res.json()
        }
      })
      .catch((error) => {
        console.log('收藏狀態切換失敗', error)
        // 在這裡處理錯誤
      })
  }

  //購物車
  // 定义添加到购物车的函数
  const addToCart = async () => {
    // 檢查使用者是否已登入
    if (!userData || !userData.id) {
      // 如果使用者未登入，顯示提示訊息
      Swal.fire({
        icon: 'error',
        title: '請先登入才能加入購物車！',
      })
      return
    }

    // 构建要发送到后端的购物车项对象
    const cartItem = {
      user_id: userData.id, // 使用者 ID
      rent_id: rent.id, // 商品ID
      r_amount: quantity, // 数量
      r_color: selectedColor,
      r_size: rent.selectedSize, // 选择的尺寸
      start_time: startDate, // 租借开始日期
      end_time: endDate, // 租借结束日期
      r_price: rent.price, // 租賃商品的價格
      img: rent.img,
    }

    // 如果商品有颜色属性，则添加颜色属性到购物车项对象中
    if (rent.selectedColor) {
      cartItem.r_color = rent.selectedColor // 选择的颜色
    }

    // 发送 POST 请求到后端
    try {
      const response = await fetch(
        'http://localhost:3005/api/shopping-cartr/rent',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cartItem),
        }
      )

      if (response.status === 400) {
        // 如果响应状态码为400，表示请求出错
        throw new Error('加入購物車時出錯')
      }

      const data = await response.json()
      // 在这里处理后端返回的响应，比如更新购物车状态或显示提示信息
      console.log('商品已加入購物車:', data)

      // 使用 SweetAlert2 顯示成功提示訊息
      Swal.fire({
        icon: 'success',
        title: '成功',
        text: '商品已成功加入到購物車！',
      })
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      console.error('加入購物車時出錯:', error)
      // 使用 SweetAlert2 顯示錯誤提示訊息
      Swal.fire({
        icon: 'error',
        title: '錯誤',
        text: '請選擇顏色和尺寸',
      })
    }
  }

  return (
    <>
      <div className="container">
        <div className={`${styles['nav-h']}`}>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">所有商品</li>
              <li className="breadcrumb-item active" aria-current="page">
                <a href="#">{rent.class_id}</a>
              </li>
            </ol>
          </nav>
        </div>

        <div className="row">
          <div className="col-md-6 col-12">
            {/* 商品圖片 */}
            <div className={`${styles['product-image']}`}>
              <img src={image || `/images/rent/${rent.img}`} alt={rent.name} />
              {/* <Image
                src={`/images/rent/${
                  selectedColor ? rent[selectedColor] : rent.image_url
                }`}
                alt="Product Image"
                width={300}
                height={300}
              /> */}
            </div>
            {/*選擇商品顏色*/}
            <div className={styles['color-options']}>
              {rent.img && (
                <img src={`/images/rent/${rent.img}`} alt="Color Option 1" />
              )}
              {rent.red && (
                <img src={`/images/rent/${rent.red}`} alt="Color Option 1" />
              )}
              {rent.green && (
                <img src={`/images/rent/${rent.green}`} alt="Color Option 1" />
              )}
              {rent.blue && (
                <img src={`/images/rent/${rent.blue}`} alt="Color Option 1" />
              )}
              {rent.yellow && (
                <img src={`/images/rent/${rent.yellow}`} alt="Color Option 1" />
              )}

              {/* {['black', 'red', 'green', 'blue'].map((color) => (
                <div key={color} className={styles['color-option']}>
                  <input
                    type="radio"
                    id={color}
                    name="color"
                    value={color}
                    checked={selectedColor === color}
                    onChange={() => handleColorChange(color)}
                  />
                  <label htmlFor={color}>{color}</label>
                </div>
              ))} */}
            </div>
          </div>
          <div className="col-md-6">
            <div className="row">
              <div className={`col-12 md-3 ${styles['rt']}`}>
                <div className="col-1 text-center mb-3">
                  <div className="border border-danger d-inline-block">
                    <h5 className="text-danger m-0 p-2">{rent.brand_id}</h5>
                  </div>
                </div>
                <div className="">
                  <h4>{rent.name}</h4>
                </div>
                <div className="row d-flex align-items-end">
                  <div className={`col-md-3 col-5 mt-3 ${styles['save']}`}>
                    <h3>${Math.round(rent.price * 0.8)} / 1天</h3>
                  </div>
                  <div className="col d-flex justify-content-start ">
                    <h6 className="text-decoration-line-through">
                      ${rent.price} / 1天
                    </h6>
                  </div>
                </div>
                {/*商品規格*/}
                <div className="row mt-3">
                  <div className={`col-md-6 mb-2 ${styles['cr']}`}>
                    <label htmlFor="colorSelect" className="form-label">
                      <h6>顏色</h6>
                    </label>
                    <select
                      id="colorSelect"
                      className="form-select rounded-0"
                      value={selectedColor}
                      onChange={(e) => handleColorChange(e.target.value)}
                    >
                      <option value="" disabled>
                        請選擇顏色
                      </option>
                      <option value="熱門色">熱門色</option>
                      <option value="紅">紅</option>
                      <option value="綠">綠</option>
                      <option value="藍">藍</option>
                      <option value="黃">黃</option>
                      {/* 其他颜色选项 */}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="inputState" className="form-label">
                      <h6>尺寸</h6>
                    </label>
                    <select
                      id="inputState"
                      className="form-select rounded-0"
                      onChange={handleSizeChange} // 在这里调用 handleSizeChange 函数
                    >
                      <option selected disabled>
                        請選擇尺寸
                      </option>
                      {/* 根据 rent 中的尺寸属性渲染选项 */}
                      {rent.sizes &&
                        rent.sizes.split(',').map((size, index) => (
                          <option key={index} value={size}>
                            {size}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="col-md-6 mt-3">
                    <label htmlFor="inputState" className="form-label">
                      <h6>租借起始日</h6>
                    </label>
                    <div>
                      {/* 使用 input 元素渲染開始日期選擇器 */}
                      <input
                        type="date"
                        id="startDatePicker"
                        // 設置最小可選日期為今天
                        min={today}
                        // 將選定的開始日期狀態設置為輸入框的值
                        value={startDate}
                        // 當開始日期發生變化時調用 handleStartDateChange 函數
                        onChange={handleStartDateChange}
                        style={{
                          width: '100%',
                          height: '38px',
                          borderRadius: '0',
                          border: '1px solid #ced4da', // 添加 1px 边框，可以根据需要调整颜色
                          padding: '8px 12px', // 调整填充，可以根据需要调整上下左右的填充值
                        }}
                      />
                    </div>
                  </div>

                  <div className="col-md-6 mt-3">
                    <label htmlFor="inputState" className="form-label">
                      <h6>租借結束日</h6>
                    </label>
                    <div>
                      {/* 使用 input 元素渲染開始日期選擇器 */}

                      <input
                        type="date"
                        id="setEndDate"
                        // 設置最小可選日期為今天
                        min={startDate}
                        // 將選定的開始日期狀態設置為輸入框的值
                        value={endDate}
                        // 當開始日期發生變化時調用 handleStartDateChange 函數
                        onChange={handleEndDateChange}
                        style={{
                          width: '100%',
                          height: '38px',
                          borderRadius: '0',
                          border: '1px solid #ced4da', // 添加 1px 边框，可以根据需要调整颜色
                          padding: '8px 12px', // 调整填充，可以根据需要调整上下左右的填充值
                        }}
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    {/* 数量选择 */}
                    <label htmlFor="inputState" className="form-label">
                      <h6>數量</h6>
                    </label>
                    <div className={`input-group ${styles['ig']}`}>
                      <button
                        className="btn btn-outline-secondary rounded-0"
                        type="button"
                        id="minus-btn"
                        onClick={handleDecrease} // 在这里调用减少数量的函数
                      >
                        -
                      </button>
                      <input
                        type="text"
                        className={`form-control ${styles['digit']}`}
                        placeholder="1"
                        aria-label="1"
                        aria-describedby="basic-addon2"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                      />
                      <button
                        className="btn btn-outline-secondary rounded-0"
                        type="button"
                        id="plus-btn"
                        onClick={handleIncrease} // 在这里调用增加数量的函数
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/*購物按鈕*/}
                  <div
                    className="btn-group col-md-12 mt-3"
                    role="group"
                    aria-label="Basic mixed styles example"
                  >
                    <button
                      type="button"
                      className="btn btn-danger rounded-0 d-flex align-items-center justify-content-center"
                      onClick={addToCart} // 调用添加到购物车的函数
                    >
                      <RiShoppingCartLine
                        style={{ color: 'var(--gray-light)' }}
                      />
                      <span className="ms-2">加入購物車</span>
                    </button>
                  </div>
                  <div
                    className="btn-group col-md-12 mt-3 "
                    role="group"
                    aria-label="Basic mixed styles example"
                  >
                    <button
                      onClick={handleToggleFav}
                      type="button"
                      className="btn btn-dark rounded-0 d-flex align-items-center justify-content-center"
                    >
                      <Image
                        className="me-2"
                        src={
                          favoriteRentIds.includes(rent.id)
                            ? favoriteLove
                            : favorite
                        }
                        alt=""
                      />
                      <span className="ms-2">收藏商品</span>
                    </button>
                  </div>
                  {/*資訊*/}

                  <div className={`${styles['free']}`}>
                    <div className={`${styles['box']}`}>注意</div>
                    <div>
                      凡租借訂單下定成功，請在約定時間至”帕菲克運動基地”
                      跟櫃台人員領取租用裝備
                    </div>
                  </div>
                  <div className={`${styles['free']}`}>
                    <div className={`${styles['box']}`}>注意</div>
                    <div>
                      因拍照環境、光線與螢幕顯示器等因素，照片多少存在些許色差，請以實品顏色為準。
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*商品介紹跟更多類似*/}

          <div className="col-md-6 mt-3 ">
            <div className={`${styles['product-description']}`}>
              <PiBaseballLight
                style={{
                  color: 'var(--main)',
                  fontSize: '1.5rem',
                  marginRight: '10px',
                }}
              />
              <h5>商品介紹</h5>
            </div>
            <div className={`${styles['product-details']}`}>
              <p>
                {descriptionLines.map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    {/* 不是最後一行時，添加換行 */}
                    {index !== descriptionLines.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </p>
            </div>
            <div className={`introduce ${styles.introduce}`}>
              <figcaption className={`introduce1 ${styles.introduce1}`}>
                <img src={`/images/product/${rent.introduce}`} alt="" />
              </figcaption>
            </div>
            {/* <div className={`${styles['colsize-chart-table']}`}>
              <table>
                <thead>
                  <tr>
                    <th>US男</th>
                    <th>US女</th>
                    <th>UK</th>
                    <th>EU</th>
                    <th>CM</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>8</td>
                    <td>9.5</td>
                    <td>7</td>
                    <td>41</td>
                    <td>26</td>
                  </tr>
                  <tr>
                    <td>8.5</td>
                    <td>10</td>
                    <td>7</td>
                    <td>41.5</td>
                    <td>26.5</td>
                  </tr>
                  <tr>
                    <td>9</td>
                    <td>10.5</td>
                    <td>8</td>
                    <td>42</td>
                    <td>27</td>
                  </tr>
                  <tr>
                    <td>9.5</td>
                    <td>11</td>
                    <td>8.5</td>
                    <td>42.5</td>
                    <td>27.5</td>
                  </tr>
                  <tr>
                    <td>10</td>
                    <td>11.5</td>
                    <td>9</td>
                    <td>43</td>
                    <td>28</td>
                  </tr>
                  <tr>
                    <td>10.5</td>
                    <td>12</td>
                    <td>8.5</td>
                    <td>43.5</td>
                    <td>28.5</td>
                  </tr>
                  <tr>
                    <td>11</td>
                    <td>12.5</td>
                    <td>10</td>
                    <td>44</td>
                    <td>29</td>
                  </tr>
                </tbody>
              </table>
            </div> */}
            <div>
              <div className={`${styles['product-description']}`}>
                <BsBoxSeam
                  style={{
                    color: 'var(--main)',
                    fontSize: '1.5rem',
                    marginRight: '10px',
                  }}
                />
                <h5>商品評價</h5>
              </div>

              <div className={`${styles['all-commen']}`}>
                {comment.length === 0 ? (
                  <h3 className="text-center my-4">暫時無相關評論</h3>
                ) : (
                  comment.slice(0, 2).map((comment) => (
                    <div
                      key={comment.id}
                      className={`card ${styles['all-card']}`}
                    >
                      <div className="card-body">
                        <div className="d-flex">
                          <div className={`${styles['peo']}`}>
                            <img
                              src={
                                comment.photo && comment.photo.includes('http')
                                  ? `${comment.photo}`
                                  : `http://localhost:3005/uploads/${comment.photo}`
                              }
                              alt=""
                            />
                          </div>
                          <div className="nam">
                            <h6 className="card-title">
                              {comment.account === null
                                ? comment.email.substring(0, 3) + '***'
                                : comment.account.substring(0, 3) + '***'}
                            </h6>
                            <h5 className="card-title">{comment.created_at}</h5>
                          </div>
                          <div
                            className="ms-auto "
                            style={{ fontSize: '1.5rem', color: 'red' }}
                          >
                            {[...Array(comment.star)].map((_, index) => (
                              <IoMdStar key={index} />
                            ))}
                            {[...Array(5 - comment.star)].map((_, index) => (
                              <IoMdStarOutline key={index} />
                            ))}
                          </div>
                        </div>
                        <p className="card-text">{comment.description}</p>
                      </div>
                    </div>
                  ))
                )}
                {comment.length === 0 ? (
                  <div></div>
                ) : (
                  <div className={`${styles['comment']}`}>
                    <button
                      className="btn text-danger d-flex align-items-center ms-auto mb-2"
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target="#ModalComment"
                    >
                      查看更多評論
                      <GoTriangleRight />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/*更多相似商品*/}

          <div className="col-md-6 mt-3">
            <div style={{ backgroundColor: 'var(--gray-light)' }}>
              <div className={`${styles['similar-products']}`}>
                <h5>更多相似商品</h5>
              </div>
            </div>

            <div className={`row row-cols-md-4 g-4  ${styles['all-card1']}`}>
              {similarProducts.slice(0, 8).map((rent, index) => (
                <div className="col" key={index}>
                  <Link href={`/rent/detail?pid=${rent.id}`}>
                    <div className={`card ${styles['ac1']}`}>
                      <img
                        src={`/images/rent/${rent.img}`}
                        className="card-img-top"
                        alt={rent.name}
                      />
                      <div className={`card-body ${styles['ac2']}`}>
                        <p className={`${styles['cpm']}`}>
                          {rent.brand} {rent.name}
                        </p>
                        <div className={`${styles['cb']}`}>
                          <h6 className={`${styles['save1']}`}>
                            ${Math.round(rent.price * 0.8)}
                          </h6>
                          <p className={`m-0 ${styles['ps']}`}>${rent.price}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 評論  modal 彈窗 */}
      <div
        className="modal fade"
        id="ModalComment"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class={`modal-dialog modal-lg text-info`}>
          <div class="modal-content px-3 pt-3">
            <div class="modal-header">
              <h5 class="modal-title fs-5 " id="exampleModalLabel">
                所有評論
              </h5>
              <button
                type="button"
                class="btn-close ms-auto"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body text-start px-1">
              {comment.map((comment) => (
                <div
                  key={comment.id}
                  className={`card rounded-0 shadow ${styles['all-card']}`}
                >
                  <div className="card-body">
                    <div className="d-flex">
                      <div className={`${styles['peo']}`}>
                        <img
                          src={
                            comment.photo && comment.photo.includes('http')
                              ? `${comment.photo}`
                              : `http://localhost:3005/uploads/${comment.photo}`
                          }
                          alt=""
                        />
                      </div>
                      <div className={`${styles['nam']}`}>
                        <h6 className="card-title">
                          {comment.account === null
                            ? comment.email.substring(0, 3) + '***'
                            : comment.account.substring(0, 3) + '***'}
                        </h6>
                        <p className="card-title">{comment.created_at}</p>
                      </div>
                      <div
                        className="ms-auto "
                        style={{ fontSize: '1.5rem', color: 'red' }}
                      >
                        {[...Array(comment.star)].map((_, index) => (
                          <IoMdStar key={index} />
                        ))}
                        {[...Array(5 - comment.star)].map((_, index) => (
                          <IoMdStarOutline key={index} />
                        ))}
                      </div>
                    </div>
                    <p className="card-text">{comment.description}</p>
                  </div>
                </div>
              ))}
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
    </>
  )
}
