import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
// 載入指示動畫

// 第2階段: 資料來自伺服器
// 資料來源: `https://my-json-server.typicode.com/eyesofkids/json-fake-data/products/${pid}`
// 先註解大概json的資料模型樣貌
// const product =
// {
//   id: '1',
//   picture: 'https://via.placeholder.com/150',
//   stock: 5,
//   name: 'iPhone 12 Pro',
//   price: 25000,
//   tags: '蘋果,大螢幕',
// }

// 連至不是 /product/ 且不是  /product/list 資料夾的路由
export default function Detail() {
  // 物件狀態的初始值，通常需要把每個屬性的初始值寫出
  // !!注意!! 初次render(渲染)會使用初始值
  // !!注意!! 在應用程式執行過程中，務必要保持狀態維持同樣的資料類型
  const [product, setProduct] = useState({
    id: '',

    name: '',
    price: 0,
  })

  // 宣告出router物件，在其中可以得到兩個有用值
  // router.query，是一個物件，其中有動態路由的參數值pid
  // router.isReady，是一個布林值，代表本頁面元件已完成水合作用，可以得到pid值
  const router = useRouter()

  // 與伺服器要求獲取資料的async函式
  const getProduct = async (pid) => {
    const url = `http://localhost:3005/api/renttest/${pid}`

    // 如果用了async-await，實務上要習慣使用try...catch來處理錯誤
    try {
      // fetch預設是使用GET，不需要加method設定
      const res = await fetch(url)
      // 解析json格式資料成js的資料
      const data = await res.json()
      console.log(data)

      // 為了要確保資料是物件，所以檢查後再設定
      if (data && data.length > 0 && typeof data[0] === 'object') {
        setProduct(data[0])
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
      getProduct(router.query.pid)
    }
    // eslint-disable-next-line
  }, [router.isReady])
  // eslint會作多餘的檢查，不需要加router.query在相依陣列中

  return (
    <>
      <h1>商品詳細頁</h1>
      <button
        onClick={() => {
          router.push('/rent/t')
        }}
      >
        回到列表頁
      </button>
      <p>
        <img src={`/images/rent/${product.image_url}`} alt="" />
      </p>
      <p>商品ID: {product.id}</p>
      <p>商品名稱: {product.name}</p>
      <p>商品價格: {product.price}</p>
    </>
  )
}
