import React, { useState }  from 'react'
// import '@/node_modules/bootstrap/dist/css/bootstrap.min.css'
import styles from './product.module.css'
import Link from 'next/link'
import Script from 'next/script'
import { FaRegHeart } from "react-icons/fa"; // 引入 Heart 的使用者圖標(空心)
import { FaHeart } from "react-icons/fa"; // 引入 Heart 的使用者圖標(實心)
import { BiSolidLeftArrow } from "react-icons/bi";
import { BiSolidRightArrow } from "react-icons/bi";
import Pagination from '@/components/pagination/pagination'





export default function Productselection(){

    const handleClear = () => {
        // 清除品牌選項
        const brandInputs = document.getElementsByName("brand");
        brandInputs.forEach(input => {
            input.checked = false;
        });
    
        // 清除顏色選項
        const colorInputs = document.getElementsByName("color");
        colorInputs.forEach(input => {
            input.checked = false;
        });
    
        // 清除價格選項
        const priceInputs = document.getElementsByName("price");
        priceInputs.forEach(input => {
            input.checked = false;
        });
    };

    const handleSubmit = () => {
        // 在這裡添加提交選項的邏輯
        // 獲取所有已選中的品牌
    const selectedBrands = document.querySelectorAll('input[name="brand"]:checked');
    const selectedBrandValues = Array.from(selectedBrands).map(input => input.value);

    // 獲取所有已選中的顏色
    const selectedColors = document.querySelectorAll('input[name="color"]:checked');
    const selectedColorValues = Array.from(selectedColors).map(input => input.value);

    // 獲取所有已選中的價格
    const selectedPrices = document.querySelectorAll('input[name="price"]:checked');
    const selectedPriceValues = Array.from(selectedPrices).map(input => input.value);

    // 執行提交操作，這裡可以根據應用程序的需要執行相應的操作，例如將選項提交到後端處理、顯示結果等等
    console.log("已選中的品牌:", selectedBrandValues);
    console.log("已選中的顏色:", selectedColorValues);
    console.log("已選中的價格:", selectedPriceValues);
    };
   

    return (
        
        <>
            <div  className={`ch ${styles.ch}`}>
                <div className={`titlee ${styles.titlee}`}>
                    <h5>篩選</h5>
                    <button
                    type="button"
                     className={`btn2 btn-close ml-auto ${styles.btn2}`}
                     data-bs-dismiss="modal" aria-label="Close"
                    
                    />
                </div>
                <div  className={`brandb ${styles.brandb}`}>
                    <p>品牌</p>
                    <div  className={`brand-options ${styles.brandOptions}`}>
                    <div  className={`brand-option ${styles.brandOption}`}>
                        <input
                         className={`brr ${styles.brr}`}
                        type="radio"
                        id=""
                        name="brand"
                        defaultValue=""
                        />
                        <label htmlFor="">ASICS</label>
                    </div>
                    <div className={`brand-option ${styles.brandOption}`}>
                        <input
                        className={`brr ${styles.brr}`}
                        type="radio"
                        id=""
                        name="brand"
                        defaultValue=""
                        />
                        <label htmlFor="">FILA</label>
                    </div>
                    <div className={`brand-option ${styles.brandOption}`}>
                        <input
                        className={`brr ${styles.brr}`}
                        type="radio"
                        id=""
                        name="brand"
                        defaultValue=""
                        />
                        <label htmlFor="">NIKE</label>
                        <br />
                    </div>
                    </div>
                    <div className={`brand-options ${styles.brandOptions}`}>
                    <div className={`brand-option ${styles.brandOption}`}>
                        <input
                        className={`brr ${styles.brr}`}
                        type="radio"
                        id=""
                        name="brand"
                        defaultValue=""
                        />
                        <label htmlFor="">BRETT</label>
                    </div>
                    <div className={`brand-option ${styles.brandOption}`}>
                        <input
                        className={`brr ${styles.brr}`}
                        type="radio"
                        id=""
                        name="brand"
                        defaultValue=""
                        />
                        <label htmlFor="">MIZUNO</label>
                    </div>
                    <div className={`brand-option ${styles.brandOption}`}>
                        <input
                        className={`brr ${styles.brr}`}
                        type="radio"
                        id=""
                        name="brand"
                        defaultValue=""
                        />
                        <label htmlFor="">ZETT</label>
                        <br />
                    </div>
                    </div>
                    <div className={`brand-options ${styles.brandOptions}`}>
                    <div className={`brand-option ${styles.brandOption}`}>
                        <input
                        className={`brr ${styles.brr}`}
                        type="radio"
                        id=""
                        name="brand"
                        defaultValue=""
                        />
                        <label htmlFor="">EASTON</label>
                    </div>
                    <div className={`brand-option ${styles.brandOption}`}>
                        <input
                        className={`brr ${styles.brr}`}
                        type="radio"
                        id=""
                        name="brand"
                        defaultValue=""
                        />
                        <label htmlFor="">OAKLEY</label>
                    </div>
                    <div className={`brand-option ${styles.brandOption}`}>
                        <input
                        className={`brr ${styles.brr}`}
                        type="radio"
                        id=""
                        name="brand"
                        defaultValue=""
                        />
                        <label htmlFor="">SSK</label>
                        <br />
                    </div>
                    </div>
                    <div className={`brand-options ${styles.brandOptions}`}>
                    <div className={`brand-option ${styles.brandOption}`}>
                        <input
                        className={`brr ${styles.brr}`}
                        type="radio"
                        id=""
                        name="brand"
                        defaultValue=""
                        />
                        <label htmlFor="">New Balance</label>
                    </div>
                    <div className={`brand-option ${styles.brandOption}`}>
                        <input
                        className={`brr ${styles.brr}`}
                        type="radio"
                        id=""
                        name="brand"
                        defaultValue=""
                        />
                        <label htmlFor="">UNDER ARMOUR</label>
                    </div>
                    <div className={`brand-option ${styles.brandOption}`}></div>
                    </div>
                </div>
                <hr  className={`hh ${styles.hh}`} />
                <div  className={`color ${styles.color}`}>
                    <p>顏色</p>
                    <div className={`brand-options ${styles.brandOptions}`}>
                    <div className={`brand-option ${styles.brandOption}`}>
                        <input
                        className={`brr ${styles.brr}`}
                        type="radio"
                        id=""
                        name="color"
                        defaultValue=""
                        />
                        <label htmlFor="">黑</label>
                    </div>
                    <div className={`brand-option ${styles.brandOption}`}>
                        <input
                        className={`brr ${styles.brr}`}
                        type="radio"
                        id=""
                        name="color"
                        defaultValue=""
                        />
                        <label htmlFor="">白</label>
                    </div>
                    <div className={`brand-option ${styles.brandOption}`}>
                        <input
                        className={`brr ${styles.brr}`}
                        type="radio"
                        id=""
                        name="color"
                        defaultValue=""
                        />
                        <label htmlFor="">藍</label>
                    </div>
                    <div className={`brand-option ${styles.brandOption}`}>
                        <input
                        className={`brr ${styles.brr}`}
                        type="radio"
                        id=""
                        name="color"
                        defaultValue=""
                        />
                        <label htmlFor="">綠</label>
                        <br />
                    </div>
                    </div>
                    <div className={`brand-options ${styles.brandOptions}`}>
                    <div className={`brand-option ${styles.brandOption}`}>
                        <input
                        className={`brr ${styles.brr}`}
                        type="radio"
                        id=""
                        name="color"
                        defaultValue=""
                        />
                        <label htmlFor="">紅</label>
                    </div>
                    <div className={`brand-option ${styles.brandOption}`}>
                        <input
                        className={`brr ${styles.brr}`}
                        type="radio"
                        id=""
                        name="color"
                        defaultValue=""
                        />
                        <label htmlFor="">黃</label>
                    </div>
                    <div className={`brand-option ${styles.brandOption}`}>
                        <input
                        className={`brr ${styles.brr}`}
                        type="radio"
                        id=""
                        name="color"
                        defaultValue=""
                        />
                        <label htmlFor="">橘</label>
                        <br />
                    </div>
                    <div className={`brand-option ${styles.brandOption}`}></div>
                    </div>
                </div>
                <hr className={`hh ${styles.hh}`} />
                <div className={`price ${styles.price}`} >
                    <p>金額</p>
                    <div className={`brand-options ${styles.brandOptions}`}>
                    <div className={`brand-option ${styles.brandOption}`}>
                        <input
                        className={`brr ${styles.brr}`}
                        type="radio"
                        id=""
                        name="price"
                        defaultValue=""
                        />
                        <label htmlFor="">500以下</label>
                    </div>
                    <div className={`brand-option ${styles.brandOption}`}>
                        <input
                        className={`brr ${styles.brr}`}
                        type="radio"
                        id=""
                        name="price"
                        defaultValue=""
                        />
                        <label htmlFor="">500~1000</label>
                    </div>
                    </div>
                    <div className={`brand-options ${styles.brandOptions}`}>
                    <div className={`brand-option ${styles.brandOption}`}>
                        <input
                        className={`brr ${styles.brr}`}
                        type="radio"
                        id=""
                        name="price"
                        defaultValue=""
                        />
                        <label htmlFor="">1000~2000</label>
                    </div>
                    <div className={`brand-option ${styles.brandOption}`}>
                        <input
                        className={`brr ${styles.brr}`}
                        type="radio"
                        id=""
                        name="price"
                        defaultValue=""
                        />
                        <label htmlFor="">2000~3000</label>
                    </div>
                    </div>
                    <div className={`brand-options ${styles.brandOptions}`}>
                    <div className={`brand-option ${styles.brandOption}`}>
                        <input
                        className={`brr ${styles.brr}`}
                        type="radio"
                        id=""
                        name="price"
                        defaultValue=""
                        />
                        <label htmlFor="">3000以上</label>
                    </div>
                    <div className={`brand-option ${styles.brandOption}`}></div>
                    </div>
                </div>
                <hr className={`hh ${styles.hh}`} />
                <div  className={`price ${styles.price}`}>
                    <div className={`brand-options ${styles.brandOptions}`}>
                    <div className={`brand-option d-flex justify-content-between ${styles.brandOption}`}>
                        <button className={`btn btn1 btn-secondary rounded-0 ${styles.btn1}`} type="submit" onClick={handleClear}>
                        清除
                        </button>
                        <button className={`btn btn1 btn-secondary rounded-0 ${styles.btn1}`} type="submit" onClick={handleSubmit}>
                        送出
                        </button>
                    </div>
                    </div>
                </div>
                </div>
        
        </>
       
    );
}


