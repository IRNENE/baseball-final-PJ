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





const Index = () => {

   

    return (
        
        <>
            <div  className={`ch3 ${styles.ch3}`}>
                <div className={`titlee1 ${styles.titlee1}`}>
                    <h5>排序</h5>
                    <button
                    type="button"
                  className={`btn-close btn4 ml-auto ${styles.btn4}`}
                    aria-label="Close"
                    />
                </div>
                <div className="">
                    <div className="">
                    <div className={`order ${styles.order}`}>
                        <input
                        className={`ooder1 ${styles.ooder1}`}
                        type="radio"
                        id=""
                        name="brand"
                        defaultValue=""
                        />
                        <label htmlFor="">最熱門</label>
                    </div>
                    <div className={`order ${styles.order}`}>
                        <input
                        className={`ooder1 ${styles.ooder1}`}
                        type="radio"
                        id=""
                        name="brand"
                        defaultValue=""
                        />
                        <label htmlFor="">最新上架</label>
                    </div>
                    <div className={`order ${styles.order}`}>
                        <input
                         className={`ooder1 ${styles.ooder1}`}
                        type="radio"
                        id=""
                        name="brand"
                        defaultValue=""
                        />
                        <label htmlFor="">價格低到高</label>
                        <br />
                    </div>
                    <div className={`order ${styles.order}`}>
                        <input
                        className={`ooder1 ${styles.ooder1}`}
                        type="radio"
                        id=""
                        name="brand"
                        defaultValue=""
                        />
                        <label htmlFor="">價格高到低</label>
                        <br />
                    </div>
                    </div>
                </div>
                </div>
        
        </>
       
    );
}


export default Index;