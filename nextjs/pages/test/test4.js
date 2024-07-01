import React, { useState } from 'react'
import twCity from '@/data/TwCities.json'
import styles from '@/styles/member/login.module.css'
import { useLoader } from '@/hooks/use-loader'

export default function District() {
  const [selectedCity, setSelectedCity] = useState('')
  const [district, setDistrict] = useState([])
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [gymType, setGymType] = useState('')
  // 當切換縣市時，讓區鎮切換為預設選項用
  const [select, setSelect] = useState(true)
  // 當切換區鎮時，讓場地類型切換為預設選項用
  const [select2, setSelect2] = useState(true)
  // 取得fetch API後得到的資料用
  const [getData, setGetData] = useState([])
  const [place, setPlace] = useState('')
  // fetch API時，顯示等待動畫用
  const { show, setShow } = useLoader()

  // 縣市onchange用
  const handleCityChange = (e) => {
    const city = e.target.value
    setSelectedCity(city)
    twCity.find((v) => {
      if (v.name === city) {
        setDistrict(v.districts)
        setSelectedDistrict('')
        setSelect(true)
      }
    })
  }
  // 區鎮onchange用
  const handleDistrictChange = (e) => {
    const district = e.target.value
    setSelectedDistrict(district)
    setSelect(false)
    setSelect2(true)
  }
  // 場地類型onchange用
  const handleGymTypeChange = async (e) => {
    const gymType = e.target.value
    setGymType(gymType)
    setSelect2(false)
    // 選擇後動畫開始
    setShow(true)
    const data = await fetch(
      `https://iplay.sa.gov.tw/api/GymSearchAllList?City=${selectedCity}&Country=${selectedDistrict}&GymType=${gymType}`
    ).then((res) => res.json())
    setGetData(data)
    // 得到資料後動畫結束
    setShow(false)
  }
  // 場地onchange用
  const handelPlaceChange = (e) => {
    const place = e.target.value
    setPlace(place)
  }

  // console.log(selectedCity, selectedDistrict, gymType)
  // console.log(getData)
  return (
    <>
      <div className="row">
        <div className="form-floating  col-sm-3 col-10">
          <select
            className="form-select"
            onChange={(e) => {
              handleCityChange(e)
            }}
            name="address_city"
          >
            <option defaultValue value="">
              請選擇縣市
            </option>
            {twCity.map((v, i) => {
              return (
                <option key={i} value={v.name}>
                  {v.name}
                </option>
              )
            })}
          </select>
          <label htmlFor="floatingSelect" className={`ps-3 ${styles.left}`}>
            請選擇縣市
          </label>
        </div>
        <div className="form-floating  col-sm-3 col-10">
          <select
            className="form-select"
            name="address_district"
            onChange={handleDistrictChange}
          >
            {/* select為true時才顯示 */}
            {select && (
              <option selected value="">
                請選擇縣市
              </option>
            )}
            {district.map((v, i) => {
              return (
                <option key={i} value={v.name}>
                  {v.name}
                </option>
              )
            })}
          </select>
          <label htmlFor="floatingSelect" className={`ps-3 ${styles.left}`}>
            請選擇區/鎮
          </label>
        </div>
        <div className="form-floating col-sm-3 col-10">
          <select
            className="form-select"
            name="GymType"
            onChange={handleGymTypeChange}
          >
            {/* select2為true時才顯示 */}
            {select2 && (
              <option selected value="">
                請選擇場地類型
              </option>
            )}
            <option value="棒球場">棒球場</option>
            <option value="壘球場">壘球場</option>
            <option value="棒、壘球打擊練習場">棒、壘球打擊練習場</option>
          </select>
          <label htmlFor="floatingSelect" className={`ps-3 ${styles.left}`}>
            請選擇場地類型
          </label>
        </div>
        <div className="form-floating col-sm-3 col-10">
          <select
            className="form-select"
            name="GymType"
            onChange={handelPlaceChange}
          >
            <option selected value="">
              請選擇場地
            </option>
            {getData.map((v, i) => {
              return (
                <option key={i} value={v.Name}>
                  {v.Name}
                </option>
              )
            })}
          </select>
          <label htmlFor="floatingSelect" className={`ps-3 ${styles.left}`}>
            請選擇場地
          </label>
        </div>
      </div>
    </>
  )
}
