import React, { useEffect, useState } from 'react'

export default function Test() {
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [dateStart, setDateStart] = useState('')
  const [dateEnd, setDateEnd] = useState('')
  const [cate, setCate] = useState('all')
  const [result, setResult] = useState([])

  // 若以下input欄位有改變，馬上重新渲染頁面
  useEffect(() => {
    fetchURL()
  }, [priceMin, priceMax, dateStart, dateEnd, cate])

  // 設計要fetch後端的API
  const fetchURL = async () => {
    // 後端API的路徑
    let url = 'http://localhost:3005/api/test?'
    // 最大最小金額的判斷
    if (priceMin && !priceMax) {
      url += `priceMin=${priceMin}&`
    } else if (priceMax && !priceMin) {
      url += `priceMax=${priceMax}&`
    } else if (priceMin && priceMax) {
      url += `priceMin=${priceMin}&priceMax=${priceMax}&`
    }
    // 開始結束日期判斷
    if (dateStart && !dateEnd) {
      const currentDate = new Date().toISOString().split('T')[0]
      url += `dateStart=
      ${dateStart}&dateEnd=${currentDate}&`
    } else if (dateEnd && dateStart) {
      url += `dateStart=${dateStart}&dateEnd=${dateEnd}&`
    }
    // 類別判斷
    if (cate !== 'all') {
      url += `cate=${cate}&`
    }
    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setResult(data)
      })
  }
  // 當input欄位onChange時要運行的函式
  const handleChange = (e) => {
    const { name, value } = e.target
    switch (name) {
      case 'priceMin':
        setPriceMin(value)
        break
      case 'priceMax':
        setPriceMax(value)
        break
      case 'dateStart':
        setDateStart(value)
        console.log(value);
        break
      case 'dateEnd':
        setDateEnd(value)
        console.log(value);
        break
      case 'cate':
        setCate(value)
        break
      default:
        break
    }
  }
  return (
    <>
      <div className="container">
        <form action="">
          <div>
            <label htmlFor="pricemin">Min</label>
            <input
              type="number"
              name="priceMin"
              placeholder="最小金額"
              onChange={handleChange}
            />
            <br />
            <label htmlFor="pricemin">Max</label>
            <input
              type="number"
              name="priceMax"
              placeholder="最大金額"
              onChange={handleChange}
            />
            <br />
            <label htmlFor="pricemin">dateStart</label>
            <input type="date" name="dateStart" onChange={handleChange} />
            <br />
            <label htmlFor="pricemin">dateEnd</label>
            <input type="date" name="dateEnd" onChange={handleChange} />
            <br />
            <select name="cate" onChange={handleChange}>
              <option value="all">所有</option>
              <option value="投球">投球</option>
              <option value="打擊">打擊</option>
              <option value="守備">守備</option>
              <option value="體能">體能</option>
              <option value="知識">知識</option>
            </select>
          </div>
        </form>
      </div>
      <div className="container">
        {result.map((v, i) => {
          return (
            <ul key={i}>
              <li>id:{v.id}</li>
              <li>name:{v.name}</li>
              <li>price:{v.price}</li>
              <li>開始時間:{v.course_start}</li>
              <li>結束時間:{v.course_end}</li>
              <li>類型:{v.type}</li>
            </ul>
          )
        })}
      </div>
    </>
  )
}
