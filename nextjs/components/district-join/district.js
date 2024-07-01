import React, { useState } from 'react'
import twCity from '@/data/TwCities.json'
import { useLoader } from '@/hooks/use-loader'

export default function District({
  onCityChange,
  onDistrictChange,
  onGymTypeChange,
  onPlaceChange,
}) {
  const [selectedCity, setSelectedCity] = useState('')
  const [district, setDistrict] = useState([])
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectGymType, setSelectGymType] = useState('')
  const [selectGym, setSelectGym] = useState('')
  // 讓 縣市 切換為預設選項用
  const [selectC, setSelectC] = useState(true)
  // 讓 鄉鎮市區 切換為預設選項用
  const [select, setSelect] = useState(true)
  // 讓 場地類型 切換為預設選項用
  const [select2, setSelect2] = useState(true)
  // 讓 場地 切換為預設選項用
  const [select3, setSelect3] = useState(true)
  // 取得fetch API後得到的資料用
  const [getData, setGetData] = useState([])
  const [place, setPlace] = useState('')
  // fetch API時，顯示等待動畫用
  const { show, setShow } = useLoader()

  const handleCityChange = (e) => {
    const city = e.target.value
    setSelectedCity(city)
    setSelectedDistrict('') // 在這裡重置區的值為空
    setSelectGymType('')
    setSelectGym('')

    twCity.find((v) => {
      if (v.name === city) {
        setDistrict(v.districts)
        setSelectedDistrict('')
        setSelectC(false)
        setSelect(true)
        setSelect2(true)
        setSelect3(true)
      }
    })
    onCityChange(city)
  }

  // 區鎮onchange用
  const handleDistrictChange = (e) => {
    const district = e.target.value
    setSelectedDistrict(district)
    setSelectGymType('')
    setSelectGym('')
    setSelect(false)
    setSelect2(true)
    setSelect3(true)
    onDistrictChange(district)
  }

  // 場地類型onchange用
  const handleGymTypeChange = async (e) => {
    const gymType = e.target.value
    setSelectGymType(gymType)
    setSelectGym('')
    setSelect2(false)
    setSelect3(true)

    // 選擇後動畫開始
    setShow(true)

    const data = await fetch(
      `https://iplay.sa.gov.tw/api/GymSearchAllList?City=${selectedCity}&Country=${selectedDistrict}&GymType=${gymType}`
    ).then((res) => res.json())

    onGymTypeChange(gymType)

    setGetData(data)

    // 得到資料後動畫結束
    setShow(false)
  }

  // 場地onchange用
  const handelPlaceChange = (e) => {
    const place = e.target.value
    setSelectGym(place)
    setSelect3(false)
    onPlaceChange(place)
  }

  return (
    <>
      <div className="row">
        <div className="col-6 pe-2">
          <select
            className="form-select"
            aria-label="Default select example"
            value={selectedCity}
            onChange={(e) => {
              handleCityChange(e)
            }}
            name="address_city"
          >
            {selectC && (
              <option defaultValue value="">
                請選擇縣市
              </option>
            )}
            {twCity.map((v, i) => {
              return (
                <option key={i} value={v.name}>
                  {v.name}
                </option>
              )
            })}
          </select>
        </div>

        <div className="col-6 ps-2">
          <select
            className="form-select"
            aria-label="Default select example"
            name="address_district"
            value={selectedDistrict}
            onChange={(e) => {
              handleDistrictChange(e)
            }}
          >
            {select && (
              <option selected value="">
                請選擇鄉鎮市區 (選填)
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
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-6 pe-2">
          <select
            value={selectGymType}
            disabled={selectC} // 如果縣市還是預設值，則設定為disabled
            className="form-select"
            aria-label="Default select example"
            onChange={(e) => {
              handleGymTypeChange(e)
            }}
            name="gymType"
          >
            {select2 && (
              <option selected value="">
                請選擇場地類型
              </option>
            )}
            <option value="棒球場">棒球場</option>
            <option value="壘球場">壘球場</option>
            <option value="棒、壘球打擊練習場">棒、壘球打擊練習場</option>
          </select>
        </div>

        <div className="col-6 ps-2">
          <select
            disabled={select2 || getData.length == 0} // 如果場地類型還是預設值，則設定為disabled
            className="form-select"
            aria-label="Default select example"
            name="place"
            value={selectGym}
            onChange={(e) => {
              handelPlaceChange(e)
            }}
          >
            {getData.length == 0 && !selectC && !select2 && !show && (
              <option selected value="">
                此地區查詢不到相關場館
              </option>
            )}

            {select3 && (
              <option selected value="">
                請選擇場地
              </option>
            )}
            {getData.length > 0 &&
              getData.map((v, i) => (
                <option key={i} value={v.Name}>
                  {v.Name}
                </option>
              ))}
          </select>
        </div>
      </div>
    </>
  )
}
