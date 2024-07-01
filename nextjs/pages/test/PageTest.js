import React, { useState } from 'react'
import Pagination from '@/components/pagination/pagination'

export default function test() {
  const [test, setTest] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const a = fetch('https://api.sampleapis.com/wines/reds')
    .then((res) => res.json())
    .then((data) => {
      let arr = data.map((v, i) => v.winery)
      setTest(arr)
    })
  return (
    <>
      {/* 這邊是要動態顯示的資料 */}
      <ul>
        {/* 下面這個50要跟傳給Pagination元件的perPage相同 */}
        {test.slice((currentPage - 1) * 50, currentPage * 50).map((v, i) => {
          return (
            <li key={i}>
              {(currentPage - 1) * 50 + i + 1}. {v}
            </li>
          )
        })}
      </ul>
      {/* 使用的話共要傳入以下四個參數，{}內數值自行修改 */}
      <Pagination
        perPages={50}
        fetchURL={'https://api.sampleapis.com/wines/reds'}
        pageShows={5}
        DataSetCurrentPage={setCurrentPage}
      />
    </>
  )
}
