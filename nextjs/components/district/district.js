import React, { useState } from 'react'
import twCity from '@/data/TwCities.json'
import styles from '@/styles/member/login.module.css'

export default function District({ onChange }) {
  const [selectedCity, setSelectedCity] = useState('')
  const [district, setDistrict] = useState([])
  const handleCityChange = (e) => {
    const city = e.target.value
    setSelectedCity(city)
    twCity.find((v) => {
      if (v.name === city) {
        setDistrict(v.districts)
      }
    })
  }
  const handleDistrictChange = (e) => {
    onChange(e)
  }

  return (
    <>
      <div className="row">
        <div className="form-floating col-6">
          <select
            className="form-select"
            onChange={(e) => {
              handleCityChange(e)
              handleDistrictChange(e)
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
        <div className="form-floating col-6">
          <select
            className="form-select"
            name="address_district"
            onChange={handleDistrictChange}
          >
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
      </div>
    </>
  )
}
