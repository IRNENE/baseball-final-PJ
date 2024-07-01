import React, { useEffect, useState } from 'react'
import styles from './test.module.css'
import path from 'path'

export default function Test3() {
  const [data, setData] = useState([])
  const [imageUrls, setImageUrls] = useState([])

  // 取得資料庫檔案
  const fetchData = async () => {
    const result = await fetch(`http://localhost:3005/api/test3/`)
    const data = await result.json()
    setData(data)
  }

  // 取得圖片檔並存成URL供陣列使用
  const fetchImage = async (filename) => {
    const response = await fetch(
      `http://localhost:3005/api/test3/img/assets/img/rent_product_img/${filename}`
    )
    const blob = await response.blob()
    const imageURL = URL.createObjectURL(blob)
    // console.log(imageURL)
    return imageURL
  }
  // 將url存入陣列，供map使用
  const fetchImages = async () => {
    const urls = []
    for (const v of data) {
      const url = await fetchImage(path.basename(v.image_url))
      urls.push(url)
    }
    setImageUrls(urls)
  }
  // 初次進入頁面，渲染
  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (data.length > 0) {
      fetchImages()
    }
  }, [data])

  return (
    <>
      <h2>產品列表測試</h2>
      {data.map((v, i) => (
        <div key={i}>
          <h4>品名:{v.name}</h4>
          <h4>圖片:</h4>
          <div className={`${styles.imgbox}`}>
            <img src={imageUrls[i]} alt={v.name} />
          </div>
        </div>
      ))}
    </>
  )
}
