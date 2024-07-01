import React, { useState ,useEffect }  from 'react'
// import '@/node_modules/bootstrap/dist/css/bootstrap.min.css'
import styles from './product.module.css'
import Link from 'next/link'
import Script from 'next/script'
import { FaRegHeart } from "react-icons/fa"; // 引入 Heart 的使用者圖標(空心)
import { FaHeart } from "react-icons/fa"; // 引入 Heart 的使用者圖標(實心)
import { BiSolidLeftArrow } from "react-icons/bi";
import { BiSolidRightArrow } from "react-icons/bi";
import Pagination from '@/components/pagination/pagination'


 export default function Productclass(){
    
    useEffect(() => {
        // 要document物件出現後才能導入 bootstrap的js函式庫
        import('@/node_modules/bootstrap/dist/js/bootstrap')
      }, [])

      useEffect(() => {
        console.log("Current sortByValue:", sortByValue); // 查看 sortByValue 更新后的值
      }, [sortByValue]);
    
     
    

// const Index = () => {

   

    return (
        
        <>

        
            <div className={`ch1 ${styles.ch1}`}>
                
  <div className="accordion" id="accordionExample">
    <div className="accordion-item">
      <h2 className="accordion-header" id="headingOne">
        <button
          className="accordion-button"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseOne"
          aria-expanded="true"
          aria-controls="collapseOne"
        >
          Accordion Item #1
        </button>
      </h2>
      <div
        id="collapseOne"
        className="accordion-collapse collapse show"
        aria-labelledby="headingOne"
        data-bs-parent="#accordionExample"
      >
        <div className="accordion-body">
          <strong>This is the first item's accordion body</strong>
        </div>
        <strong></strong>
      </div>
      <strong></strong>
    </div>
    <strong>
      <div className="accordion-item">
        <h2 className="accordion-header" id="headingTwo">
          <button
            className="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseTwo"
            aria-expanded="false"
            aria-controls="collapseTwo"
          >
            Accordion Item #2
          </button>
        </h2>
        <div
          id="collapseTwo"
          className="accordion-collapse collapse"
          aria-labelledby="headingTwo"
          data-bs-parent="#accordionExample"
        >
          <div className="accordion-body">
            <strong>This is the second item's accordion body</strong>
          </div>
          <strong></strong>
        </div>
        <strong></strong>
      </div>
      <strong>
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingThree">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseThree"
              aria-expanded="false"
              aria-controls="collapseThree"
            >
              Accordion Item #3
            </button>
          </h2>
          <div
            id="collapseThree"
            className="accordion-collapse collapse"
            aria-labelledby="headingThree"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              <strong>This is the third item's accordion body</strong>
            </div>
            <strong></strong>
          </div>
          <strong></strong>
        </div>
        <strong></strong>
      </strong>
    </strong>
  </div>
  <strong>
    <strong>
      <strong></strong>
    </strong>
  </strong>
                <select   className="form-select border-0 rounded-0  "  aria-label="Default select example"  >

                    <option selected="">球棒</option>
                    <option value={1}  >鋁棒</option>
                    <option value={2} >木棒</option>
                </select>
                <select className="form-select border-0 rounded-0" aria-label="Default select example">
                    <option selected="">球</option>
                    <option value={1}>硬式</option>
                    <option value={2}>軟式</option>
                </select>
                <select className="form-select border-0 rounded-0" aria-label="Default select example">
                    <option selected="">帽子</option>
                    <option value={1}>球帽</option>
                    <option value={2}>打擊頭盔</option>
                </select>
                <select className="form-select border-0 rounded-0" aria-label="Default select example">
                    <option selected="">球衣</option>
                    <option value={1}>長袖</option>
                    <option value={2}>短袖</option>
                </select>
                <select className="form-select border-0 rounded-0" aria-label="Default select example">
                    <option selected="">手套</option>
                    <option value={1}>左手</option>
                    <option value={2}>右手</option>
                    <option value={3}>打擊手套</option>
                </select>
                <select className="form-select border-0 rounded-0" aria-label="Default select example">
                    <option selected="">球褲</option>
                    <option value={1}>長褲</option>
                    <option value={2}>短褲</option>
                </select>
                <select className="form-select border-0 rounded-0" aria-label="Default select example">
                    <option selected="">襪子</option>
                    <option value={1}>長筒</option>
                    <option value={2}>短筒</option>
                </select>
                <select className="form-select border-0 rounded-0" aria-label="Default select example">
                    <option selected="">球鞋</option>
                    <option value={1}>跑鞋</option>
                    <option value={2}>釘鞋</option>
                </select>
                <select className="form-select border-0 rounded-0" aria-label="Default select example">
                    <option selected="">裝備</option>
                    <option value={1}>球袋</option>
                    <option value={2}>手套袋</option>
                    <option value={3}>球鞋袋</option>
                    <option value={3}>球棒袋</option>
                </select>
                <select className="form-select border-0 rounded-0" aria-label="Default select example">
                    <option selected="">護具</option>
                    <option value={1}>捕手護具</option>
                    <option value={2}>打擊護具</option>
                </select>
                <hr />
                <div className="">
                    <div className= {`row justify-content-center rrr ${styles.rrr}`}>
                    <div className="col-auto text-center">
                        <button  className={`btn btn3 btn-secondary rounded-0 ${styles.btn3}`} type="button">
                        送出
                        </button>
                    </div>
                    </div>
                </div>
                </div>
        
        </>
       
    );
}



