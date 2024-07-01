import React, { useState } from 'react'

export default function Pagination({
  perPages,
  fetchURL,
  pageShows,
  DataSetCurrentPage,
}) {
  // 一頁顯示幾筆
  let perPage = perPages
  // fetch得到的資料
  const [test, setTest] = useState([])
  // 選到第幾頁
  const [currentPage, setCurrentPage] = useState(1)
  // 共可顯示幾頁
  const [pageShow, setPageShow] = useState(pageShows)
  let start = (currentPage - 1) * perPage
  let end = currentPage * perPage
  // 總頁數
  const totalPages = Math.ceil(test.length / perPage)

  // fetch API
  const a = fetch(fetchURL)
    .then((res) => res.json())
    .then((data) => {
      let b = data.map((v) => v)
      setTest(b)
    })
  // 點擊時，設定選到該頁
  const handlePage = (pageNumber) => {
    setCurrentPage(pageNumber)
    DataSetCurrentPage(pageNumber)
  }

  // 動態設定頁碼
  const calculatePageRange = () => {
    let startPage, endPage

    if (totalPages <= pageShow) {
      startPage = 1
      endPage = totalPages
    } else {
      const halfPagesToShow = Math.floor(pageShow / 2)
      if (currentPage <= halfPagesToShow) {
        startPage = 1
        endPage = pageShow
      } else if (currentPage + halfPagesToShow >= totalPages) {
        startPage = totalPages - pageShow + 1
        endPage = totalPages
      } else {
        startPage = currentPage - halfPagesToShow
        endPage = currentPage + halfPagesToShow
      }
    }
    return Array(endPage - startPage + 1)
      .fill()
      .map((v, i) => startPage + i)
  }

  // 點擊上一頁
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      DataSetCurrentPage(currentPage - 1)
    }
  }

  // 點擊下一頁
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
      DataSetCurrentPage(currentPage + 1)
    }
  }

  return (
    <>
      <div className="d-flex justify-content-center my-5">
        <nav aria-label="Page navigation example">
          <ul className="pagination pagination-lg">
            {/* 上一頁 */}
            <li className="page-item">
              <button className="page-link" onClick={handlePrevPage}>
                <span aria-hidden="true">«</span>
              </button>
            </li>
            {/* 頁碼 */}
            {calculatePageRange().map((pageNumber) => (
              <li
                key={pageNumber}
                className={`page-item ${
                  currentPage === pageNumber ? 'active' : ''
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePage(pageNumber)}
                >
                  {pageNumber}
                </button>
              </li>
            ))}
            {/* 下一頁 */}
            <li className="page-item">
              <button className="page-link" onClick={handleNextPage}>
                <span aria-hidden="true">»</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  )
}
