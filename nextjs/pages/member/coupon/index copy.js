import styles from './c-layout.module.css'
import Sidebar from '@/components/sidebar/sidebar'
import { useEffect, useState } from 'react'
import { initUserData, useAuth } from '@/hooks/use-auth'
import Swal from 'sweetalert2'
import { BiSolidLeftArrow, BiSolidRightArrow } from 'react-icons/bi'
export default function CouponLayout() {
  const { auth } = useAuth()
  const userId = auth.userData.id
  const [data, setData] = useState([])
  // 數量不大於幾千條用前端
  // 假设全部数据已存于 state 中的 data
  const [filteredData, setFilteredData] = useState([])
  // 讓後端消息顯示到前端
  const [message, setMessage] = useState('')
  const [couponCode, setCouponCode] = useState('') // 管理优惠券代码的状态
  const [sortType, setSortType] = useState('')
  const [sortedData, setSortedData] = useState([])

  // 分頁
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(6) //一頁六筆
  // 頁碼
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
  // console.log(
  //   '分頁TEST',
  //   filteredData,
  //   indexOfFirstItem,
  //   indexOfLastItem,
  //   currentItems
  // )

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredData.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const fetchData = async () => {
    console.log(`Fetching data for userId: ${userId}`)
    try {
      const response = await fetch(`http://localhost:3005/api/coupon/${userId}`)
      const data = await response.json()
      setData(data) // 设置数据状态
      console.log('Received data:', data)
      // 设置默认为未使用的优惠券
      setFilteredData(
        data.filter((coupon) => {
          return coupon.is_used === 0 && new Date(coupon.c_end) >= new Date()
        })
      )
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  // 初次渲染呈現使用者未使用coupon頁面
  useEffect(() => {
    if (userId > 0) {
      fetchData()
    }
  }, [userId]) // 依赖于 userId
  // console.log(userId)

  const handleFilterChange = (isUsed) => {
    const newFilteredData = data.filter((coupon) => {
      return coupon.is_used === isUsed && new Date(coupon.c_end) >= new Date()
    })
    setFilteredData(newFilteredData) // 確保這裡的數據是正確的\
    console.log('TEST', newFilteredData)
    applySort(newFilteredData, sortType) // 在設定新的過濾數據後直接應用排序
  }

  // 领取优惠券
  const redeemCoupon = async (couponCode, userId) => {
    try {
      // 向服务器发送请求，验证优惠券
      const response = await fetch(`http://localhost:3005/api/coupon/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ couponCode, userId }),
      })
      const data = await response.json()
      // setMessage(data.message)
      if (data.success) {
        Swal.fire({
          title: '恭喜!',
          text: '成功新增優惠卷!',
          icon: 'success',
        })
        await fetchData()
        setMessage('') // 清空消息
      } else {
        // console.log(data.message)
        setMessage(data.message)
      }
    } catch (error) {
      console.error('请求失败', error)
    }
  }

  const handleSubmit = () => {
    redeemCoupon(couponCode, userId) // 调用兑换优惠券的函数
    setCouponCode('') // 清空输入框
  }

  const applySort = (dataToSort, sortType) => {
    let sortedData = [...dataToSort]
    if (sortType === 'expiry') {
      sortedData.sort((a, b) => new Date(a.c_end) - new Date(b.c_end))
    }
    setFilteredData(sortedData)
  }

  useEffect(() => {
    applySort(filteredData, sortType)
  }, [sortType]) // 當 sortType 變更時重新排序

  const sortCoupons = (newSortType) => {
    setSortType(newSortType) // 保存排序選項
    applySort(filteredData, newSortType) // 馬上應用排序
  }

  useEffect(() => {
    let sorted = [...filteredData]
    if (sortType === 'expiry') {
      sorted.sort((a, b) => new Date(a.c_end) - new Date(b.c_end))
    }
    setSortedData(sorted)
  }, [filteredData, sortType])
  // 另外一個 useEffect 負責處理 filteredData 更新
  useEffect(() => {
    const newFilteredData = data.filter((coupon) => {
      return coupon.is_used === 0 && new Date(coupon.c_end) >= new Date()
    })
    setFilteredData(newFilteredData)
  }, [data]) // 假設 'data' 是從外部來的，每當 data 更新時重新篩選

  // 渲染 sortedData 而不是 filteredData

  return (
    <>
      <div className={styles['coupon-container']}>
        <div className="row">
          <div className={styles.boxMargin}>
            <h5>
              會員中心 /
              <a className={styles.noBottom} href="">
                <span className={styles.bread}> 優惠卷</span>
              </a>
            </h5>
          </div>
        </div>
        <div className={`row w-100`} style={{ margin: '0', padding: '0' }}>
          <Sidebar />

          <div
            className={`col-12 col-sm-9`}
            style={{ margin: '0', padding: '0' }}
          >
            <div className={`row w-100`} style={{ margin: '0', padding: '0' }}>
              {/* 優惠卷狀態:已領取/未領取 */}
              <div
                className={`col-6 col-sm-6 ${styles['coupon-button-used']} `}
                style={{ margin: '0', padding: '0', paddingRight: '5px' }}
              >
                <button
                  type="button"
                  className={`w-100`}
                  onClick={() => handleFilterChange(0)}
                >
                  未使用
                </button>
              </div>
              <div
                className={` col-6 col-sm-6 ${styles['coupon-button-unused']} `}
                style={{ margin: '0', padding: '0', paddingLeft: '5px' }}
              >
                <button
                  type="button"
                  className={`w-100`}
                  onClick={() => handleFilterChange(1)}
                >
                  已使用
                </button>
              </div>
            </div>

            {/* 優惠卷輸入 & 排序 */}
            <div className={`row w-100 ${styles['coupon-space']}`}>
              <div className={`d-none d-sm-block col-sm-4`}></div>
              <div className={`col-12  col-sm-5`}>
                <div className={`${styles['coupon-input-box']}`}>
                  <form
                    onSubmit={(e) => e.preventDefault()}
                    style={{ display: 'flex' }}
                  >
                    {/* 阻止表单默认提交行为 */}
                    <div className={styles['input-space']}>
                      <label
                        htmlFor="coupon-code"
                        className={styles['coupon-code']}
                      >
                        <h6>新增優惠卷</h6>
                      </label>
                      <input
                        type="text"
                        placeholder="請輸入優惠碼"
                        id="coupon-code"
                        value={couponCode} // 绑定 state
                        onChange={(e) => setCouponCode(e.target.value)} // 更新 state
                      />

                      {message && (
                        <p
                          id="input-code-error"
                          className={`d-sm-block d-none ${styles['input-code-error']}`}
                        >
                          {message}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      className={`btn btn-primary`}
                      onClick={handleSubmit}
                    >
                      <h6>領取</h6>
                    </button>

                    {message && (
                      <p
                        id="input-code-error"
                        className={`d-sm-none d-block ${styles['input-code-error']}`}
                      >
                        {message}
                      </p>
                    )}
                  </form>
                </div>
              </div>

              <div className={`d-none d-sm-block col-sm-1`}></div>

              <div className={`d-block d-sm-none col-8`}></div>
              <div className={`col-4 col-sm-2 `}>
                {/* 優惠卷排序按鈕 */}
                <select
                  id="sort"
                  className={`w-100`}
                  onChange={(e) => sortCoupons(e.target.value)}
                >
                  <option value="">請選擇排序</option>
                  <option value="expiry">按日期近到遠</option>
                  {/* 可以添加其他排序選項 */}
                </select>
              </div>
            </div>

            {/* 優惠卷數量提示 */}
            <div
              className={`row w-100 mb-2 mt-1`}
              style={{ margin: '0', padding: '0' }}
            >
              <div className={`col-12 col-sm-5`}>
                {/* 優惠卷數量提示 */}

                <div className={styles['coupon-amount']}>
                  <h6>
                    目前共有<span>{filteredData.length}</span>
                    張優惠卷可使用，一次限用一張結帳
                  </h6>
                </div>
              </div>
              <div className={`d-none d-sm-block col-sm-7`}></div>
            </div>

            {/* 優惠卷桌機版 */}

            <div className={`row w-100 d-none d-sm-block`}>
              <div className={`col-sm-12 ${styles['coupon-group']}`}>
                {/* {filteredData.map((coupon) => ( */}
                {currentItems.map((coupon) => (
                  <div key={coupon.id}>
                    <div className={styles['coupon']}>
                      <div className={styles['coupon-item']}>
                        <h3 className={`mb-2 mt-2`}>{coupon.c_name}</h3>
                        <p>適用全站{coupon.c_desc}</p>
                        <p>時間期限{coupon.c_end}</p>
                        <p>折扣碼{coupon.c_code}</p>
                      </div>
                      <div
                        className={
                          coupon.is_used === 0
                            ? styles['coupon-unused']
                            : styles['coupon-used']
                        }
                      >
                        <h5>{coupon.is_used === 0 ? '未使用' : '已使用'}</h5>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/*  優惠卷桌機板*/}

            {/* 優惠卷手機板 */}

            <div className={`row w-100 d-block d-sm-none`}>
              <div className={`col-sm-12 ${styles['coupon-group']}`}>
                {/* {filteredData.map((coupon) => ( */}
                {currentItems.map((coupon) => (
                  <div key={coupon.id}>
                    <div className={styles['coupon']}>
                      <div className={styles['coupon-item']}>
                        <h3 className={`mb-2 mt-2`}>{coupon.c_name}</h3>
                        <p>適用全站{coupon.c_desc}</p>
                        <p>時間期限{coupon.c_end}</p>
                        <p>折扣碼{coupon.c_code}</p>
                      </div>
                      <div
                        className={
                          coupon.is_used === 0
                            ? styles['coupon-unused']
                            : styles['coupon-used']
                        }
                      >
                        <h5>{coupon.is_used === 0 ? '未使用' : '已使用'}</h5>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 分頁 */}
            <div className={`row w-100`}>
              <div className={`d-none d-sm-block col-sm-5`}></div>
              <div className={`d-none d-sm-block col-sm-2`}>
                {/* 分页位置 */}
                {/* Pagination Controls */}
                <div className="d-flex justify-content-center my-5">
                  <nav aria-label="Page navigation example">
                    <ul className="pagination pagination-lg">
                      {/* 上一頁 */}
                      <li className="page-item">
                        <button
                          className="page-link"
                          onClick={handlePrevPage}
                          disabled={currentPage === 1}
                        >
                          <span aria-hidden="true">
                            <BiSolidLeftArrow />
                          </span>
                        </button>
                      </li>
                      {/* 頁碼 */}
                      <li className={`page-item`}>
                        <button className="page-link" disabled={currentPage}>
                          {currentPage}
                        </button>
                      </li>
                      {/* 下一頁 */}
                      <li className="page-item">
                        <button
                          className="page-link"
                          onClick={handleNextPage}
                          disabled={
                            currentPage ===
                            Math.ceil(filteredData.length / itemsPerPage)
                          }
                        >
                          <span aria-hidden="true">
                            <BiSolidRightArrow />
                          </span>
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
                {/*  */}
              </div>
              <div className={`d-none d-sm-block col-sm-5`}></div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// if (isUsed === 0) {
//   // 转换 coupon.c_end 为日期对象进行比较
//   return (
//     coupon.is_used === isUsed && new Date(coupon.c_end) >= formattedToday
//   )
// }
// // 如果是已使用状态，不检查日期条件
// else {
//   return coupon.is_used === isUsed
// }

// 排序
// const applySort = (dataToSort, sortType) => {
//   let sortedData = [...dataToSort] // 創建數據的副本以進行排序

//   if (sortType === 'expiry') {
//     sortedData.sort((a, b) => new Date(a.c_end) - new Date(b.c_end))
//   }
//   setFilteredData(sortedData) // 更新狀態以反映排序後的數據
// }

// const handleFilterChange = (isUsed) => {
//   // 注意:直接在filter内部使用结果，而不是先存储到filteredCoupons变量
//   const filteredCoupons = data.filter((coupon) => {
//     return coupon.is_used === isUsed && new Date(coupon.c_end) >= new Date()
//   })
//   // 更新状态以反映筛选后的数据
//   setFilteredData(filteredCoupons)
// }
