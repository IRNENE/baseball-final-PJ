import React from 'react'
import styles from './rental.module.css'
import { BsBox } from 'react-icons/bs'
import { PiBaseballLight } from 'react-icons/pi'
import { RiShoppingCartLine } from 'react-icons/ri'
import { FaHeart } from 'react-icons/fa'
import { FaRegUserCircle } from 'react-icons/fa'
import { AiFillStar } from 'react-icons/ai'
import { AiOutlineStar } from 'react-icons/ai'
import { GoTriangleRight } from 'react-icons/go'
import Link from 'next/link'

export default function Rental() {
  return (
    <>
      <div className="container">
        <div className={`${styles['nav-h']}`}>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">所有商品</li>
              <li className="breadcrumb-item active" aria-current="page">
                <a href="#">棒球手套</a>
              </li>
            </ol>
          </nav>
        </div>

        <div className="row">
          <div className="col-md-6 col-12">
            {/* 商品圖片 */}
            <div className={`${styles['product-image']}`}>
              <img src="/images/logo.png" className="img-fluid" alt="..." />
            </div>
            {/*選擇商品顏色*/}
            <div className={`${styles['color-options']}`}>
              <img src="/images/logo.png" alt="Color Option 1" />
              <img src="/images/logo.png" alt="Color Option 2" />
              <img src="/images/logo.png" alt="Color Option 2" />
              <img src="/images/logo.png" alt="Color Option 2" />
              {/* 可以添加更多顏色選項 */}
            </div>
          </div>
          <div className="col-md-6">
            <div className="row">
              <div className="col-12 mt-5">
                <div className="col-1 text-center mb-3">
                  <div className="border border-danger d-inline-block">
                    <h6 className="text-danger m-0 p-2">mizuno</h6>
                  </div>
                </div>
                <div className="">
                  <h4>棒壘球鞋 WAVE LIGHTREVO</h4>
                </div>
                <div className="row d-flex align-items-end">
                  <div className={`col-md-3 col-5 mt-3 ${styles['save']}`}>
                    <h3>$1880 / 1天</h3>
                  </div>
                  <div className="col d-flex justify-content-start ">
                    <h6 className="text-decoration-line-through">$1880</h6>
                  </div>
                </div>
                {/*商品規格*/}
                <div className="row mt-3">
                  <div className={`col-md-6 mb-2 ${styles['cr']}`}>
                    <label htmlFor="inputState" className="form-label ">
                      <h6>顏色</h6>
                    </label>
                    <select id="inputState" className="form-select rounded-0">
                      <option selected="">請選擇顏色</option>
                      <option>...</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="inputState" className="form-label">
                      <h6>尺寸</h6>
                    </label>
                    <select id="inputState" className="form-select rounded-0">
                      <option selected="">請選擇尺寸</option>
                      <option>...</option>
                    </select>
                  </div>
                  <div className="col-md-6 mt-3">
                    <label htmlFor="inputState" className="form-label">
                      <h6>租借時間</h6>
                    </label>
                    <select id="inputState" className="form-select rounded-0">
                      <option selected="">請選擇日期區間</option>
                      <option>...</option>
                    </select>
                  </div>
                  <div className="mt-3">
                    <label htmlFor="inputState" className="form-label">
                      <h6>數量</h6>
                    </label>
                    <div className={`input-group ${styles['ig']}`}>
                      <button
                        className="btn btn-outline-secondary rounded-0"
                        type="button"
                        id="plus-btn"
                      >
                        -
                      </button>
                      <input
                        type="text"
                        className={`form-control ${styles['digit']}`}
                        placeholder="1"
                        aria-label="1"
                        aria-describedby="basic-addon2"
                        id="quantity-input"
                      />
                      <button
                        className="btn btn-outline-secondary rounded-0"
                        type="button"
                        id="minus-btn"
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
                      className="btn btn-danger rounded-0 d-flex align-items-center justify-content-center "
                    >
                      <RiShoppingCartLine
                        style={{ color: 'var(--gray-light  )' }}
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
                      type="button"
                      className="btn btn-dark rounded-0 d-flex align-items-center justify-content-center"
                    >
                      <FaHeart style={{ color: 'var(--gray-light)' }} />
                      <span className="ms-2">收藏商品</span>
                    </button>
                  </div>
                  {/*資訊*/}
                  <div className={styles.free}>
                    <div className={`${styles['box']}`}>免運</div>
                    <div>滿 <span style={{ color: 'var(--main)'}}>5000</span> 元即享免運</div>
                  </div>
                  <div className={`${styles['free']}`}>
                    <div className={`${styles['box']}`}>物流</div>
                    <div>宅配｜7-11、全家超商取貨付款</div>
                  </div>
                  <div className={`${styles['free']}`}>
                    <div className={`${styles['box']}`}>寄送</div>
                    <div>全年無休，週末假日照常出貨</div>
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
                材質- <br />
                鞋面：人工皮革 <br />
                大底：射出成型大底 <br />
                重量- 約290g(27.0cm單腳) <br />
                產地- 柬埔寨 <br />
                上市月份- 2023年 8月 <br />
                《注意事項》
                <br />
                ※ 此商品可退換，詳情請參閱退換貨規則 <br />
                ※ 商品展示顏色依實際販售狀況為主 <br />
                ※ 商品物質特性不同，可能會有約1-2cm前後的誤差。 <br />※
                依據商品款式、版型、材質、設計等，同樣尺寸於不同商品可能會有所差異{' '}
                <br />
                購物須知 <br />
                寄送時間 : 全年無休，週末假日照常出貨 <br />
                送貨方式 : 透過宅配送達。除網頁另有特別標示外，均為常溫配送。{' '}
                <br />
                送貨範圍 :
                限台灣本島與離島地區註，部分離島地區包括連江馬祖、綠島、蘭嶼、琉球鄉…等{' '}
                <br />
              </p>
            </div>

            <div className={`${styles['colsize-chart-table']}`}>
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
            </div>
            <div>
              <div className={`${styles['product-description']}`}>
                <BsBox
                  style={{
                    color: 'var(--main)',
                    fontSize: '1.5rem',
                    marginRight: '10px',
                  }}
                />
                <h5>商品評價</h5>
              </div>

              <div className={`${styles['all-commen']}`}>
                <div className={`card ${styles['all-card']}`}>
                  <div className="card-body">
                    <div className="d-flex">
                      <div className={`${styles['peo']}`}>
                        <img src="/images/logo.png" alt="" />
                      </div>
                      <div className="nam">
                        <h5 className="card-title">abc***@***</h5>
                        <h5 className="card-title">2024/11/11</h5>
                      </div>
                      <div className="ms-auto ">
                        <AiFillStar
                          style={{
                            color: 'var(--main)',
                          }}
                        />
                        <AiFillStar
                          style={{
                            color: 'var(--main)',
                          }}
                        />
                        <AiFillStar
                          style={{
                            color: 'var(--main)',
                          }}
                        />
                        <AiFillStar
                          style={{
                            color: 'var(--main)',
                          }}
                        />
                        <AiOutlineStar
                          style={{
                            color: 'var(--main)',
                          }}
                        />
                      </div>
                    </div>
                    <p className="card-text">
                      版型不錯，但穿起來偏硬，個人較不習慣。有穿去慢跑、打網球，鞋墊的緩衝力很好。
                    </p>
                  </div>
                </div>
                <div className={`card ${styles['all-card']}`}>
                  <div className="card-body">
                    <div className="d-flex">
                      <div className={`${styles['peo']}`}>
                        <img src="/images/logo.png" alt="" />
                      </div>
                      <div className="nam">
                        <h5 className="card-title">abc***@***</h5>
                        <h5 className="card-title">2024/11/11</h5>
                      </div>
                      <div className="ms-auto ">
                        <AiFillStar
                          style={{
                            color: 'var(--main)',
                          }}
                        />
                        <AiFillStar
                          style={{
                            color: 'var(--main)',
                          }}
                        />
                        <AiFillStar
                          style={{
                            color: 'var(--main)',
                          }}
                        />
                        <AiFillStar
                          style={{
                            color: 'var(--main)',
                          }}
                        />
                        <AiOutlineStar
                          style={{
                            color: 'var(--main)',
                          }}
                        />
                      </div>
                    </div>
                    <p className="card-text">
                      版型不錯，但穿起來偏硬，個人較不習慣。有穿去慢跑、打網球，鞋墊的緩衝力很好。
                    </p>
                  </div>
                </div>
                <div className={`${styles['comment']}`}>
                  <a href="">
                    查看更多評論
                    <GoTriangleRight />
                  </a>
                </div>
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
            <div className={`row  row-cols-md-4 g-4 ${styles['all-card1']}`}
            >
              {/*更多相似卡片的樣式*/}
              <div className="col">
                <div className={`card ${styles['ac1']}`}>
                  <img
                    src="/images/logo.png"
                    className="card-img-top"
                    alt="..."
                  />
                  <div className={`card-body ${styles['ac2']}`}>
                    <p className={`${styles['cpm']}`}>
                      mizuno || 棒壘球鞋 WAVE LIGHTREVO
                    </p>
                    <div className={`${styles['cb']}`}>
                      <h6 className={`${styles['save1']}`}>
                        $1880
                      </h6>
                      <p className={`m-0 ${styles['ps']}`}>$1880</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                
                <div className={`card ${styles['ac1']}`}>
                  <img
                    src="/images/logo.png"
                    className="card-img-top"
                    alt="..."
                  />
                  <div className={`card-body ${styles['ac2']}`}>
                    <p className={`${styles['cpm']}`}>
                      mizuno || 棒壘球鞋 WAVE LIGHTREVO
                    </p>
                    <div className={`${styles['cb']}`}>
                      <h6 className={`${styles['save1']}`}>
                        $1880
                      </h6>
                      <p className={`m-0 ${styles['ps']}`}>$1880</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                
                <div className={`card ${styles['ac1']}`}>
                  <img
                    src="/images/logo.png"
                    className="card-img-top"
                    alt="..."
                  />
                  <div className={`card-body ${styles['ac2']}`}>
                    <p className={`${styles['cpm']}`}>
                      mizuno || 棒壘球鞋 WAVE LIGHTREVO
                    </p>
                    <div className={`${styles['cb']}`}>
                      <h6 className={`${styles['save1']}`}>
                        $1880
                      </h6>
                      <p className={`m-0 ${styles['ps']}`}>$1880</p>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
            <div
              className={`row row-cols-4 row-cols-md-4 g-4 ${styles['all-card2']} `}
            >
              <div className="col">
                
                <div className={`card ${styles['ac1']}`}>
                  <img
                    src="/images/logo.png"
                    className="card-img-top"
                    alt="..."
                  />
                  <div className={`card-body ${styles['ac2']}`}>
                    <p className={`${styles['cpm']}`}>
                      mizuno || 棒壘球鞋 WAVE LIGHTREVO
                    </p>
                    <div className={`${styles['cb']}`}>
                      <h6 className={`${styles['save1']}`}>
                        $1880
                      </h6>
                      <p className={`m-0 ${styles['ps']}`}>$1880</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
  

          </div>
        </div>
      </div>
    </>
  )
}
