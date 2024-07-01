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
import { FiSearch } from "react-icons/fi"; // 搜尋





export default function Search() { 

    

    return (
        
        <>
            <div  className={`ch4 ${styles.ch4}`}>
                <div className={`ch5 ${styles.ch5}`}>
                    <div className="row">
                    <div className="col">
                        <form action="/search" method="GET" className="d-flex">
                        <div  className={`ssear input-group ${styles.ssear}`}>
                            
                            <FiSearch className={` iii ${styles.iii}`}/>
                            <input
                            type="text"
                            id="search"
                            name="q"
                            placeholder="搜尋商品"
                             className={`inin form-control ${styles.inin}`}
                             
                            />
                        </div>
                        <button type="submit" className={`bubu  ms-2 ${styles.bubu}`}>
                            取消
                        </button>
                        </form>
                    </div>
                    </div>
                    <div className={`hhh ${styles.hhh}`}>
                    <h6 >熱門搜尋字詞</h6>
                    </div>
                    <div  className={`sear-options ${styles.searOptions}`}>
                    <div className={`sear-option ${styles.searOption}`} >
                        <a href="#" className={`www ${styles.www}`}><p  className={`seee ${styles.seee}`}>"手套"</p></a>
                       
                    </div>
                    <div className={`sear-option ${styles.searOption}`} >
                    <a href="#" className={`www ${styles.www}`}><p className={`seee ${styles.seee}`}>"球棒"</p></a>
                    </div>
                    <div className={`sear-option ${styles.searOption}`} >
                    <a href="#" className={`www ${styles.www}`}><p className={`seee ${styles.seee}`}>"球衣"</p></a>
                    </div>
                    </div>
                    <div className={`sear-options ${styles.searOptions}`}>
                    <div className={`sear-option ${styles.searOption}`} >
                    <a href="#" className={`www ${styles.www}`}><p className={`seee ${styles.seee}`}>"Fila"</p></a>
                    </div>
                    <div className={`sear-option ${styles.searOption}`} >
                    <a href="#" className={`www ${styles.www}`}><p className={`seee ${styles.seee}`}>"Nike"</p></a>
                    </div>
                    <div className={`sear-option ${styles.searOption}`} >
                    <a href="#" className={`www ${styles.www}`}><p className={`seee ${styles.seee}`}>"Adidas"</p></a>
                    </div>
                    </div>
                    <div className={`sear-options ${styles.searOptions}`}>
                    <div className={`sear-option ${styles.searOption}`} >
                    <a href="#" className={`www ${styles.www}`}><p className={`seee ${styles.seee}`}>"黑"</p></a>
                    </div>
                    <div className={`sear-option ${styles.searOption}`} >
                    <a href="#" className={`www ${styles.www}`}><p className={`seee ${styles.seee}`}>"白"</p></a>
                    </div>
                    <div className={`sear-option ${styles.searOption}`} >
                    <a href="#" className={`www ${styles.www}`}><p className={`seee ${styles.seee}`}>"紅"</p></a>
                    </div>
                    </div>
                </div>
                </div>
        
        </>
       
    );
}


