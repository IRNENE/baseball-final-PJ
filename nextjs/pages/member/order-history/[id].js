import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import styles from '@/styles/style_lai.module.css'
import Sidebar from '@/components/sidebar/sidebar';
import { initUserData, useAuth } from '@/hooks/use-auth'
import Star from '@/components/star/star';


export default function DetailProduct() {
    const { auth, setAuth } = useAuth()
    const { isAuth, userData } = auth
    const router = useRouter();
    const { id } = router.query;
    const [orderDetail, setOrderDetail] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    console.log(orderDetail)
    // 儲存評論數據
    const [commentData, setCommentData] = useState({
        user_id: userData.id,
        p_id: 0,
        r_id: 0,
        c_id: 0,
        star: 0,
        description: ''
    });
    // 星星
    const [rating, setRating] = useState(0);

    const truncateDescription = (description) => {
        // 檢查描述字串是否超過100個字符
        if (description.length > 100) {
            // 如果超過100個字符，則截斷字串並添加省略號
            return `${description.substring(0, 50)}...`;
        } else {
            // 如果未超過100個字符，則返回原始字串
            return description;
        }
    };

    // hold住表單
    const handleSubmit = (e) => {
        e.preventDefault()
    }

    // 函數處理表單提交事件
    const handleSubmitComment = () => {
        // 發送評論數據到後端路由
        fetch(`http://localhost:3005/api/comment/${userData.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(commentData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('評論提交失敗');
                }
                // 清空表單數據
                setCommentData({ user_id: userData.id, p_id: 0, r_id: 0, c_id: 0, star: 0, description: '' });
                // 關閉 modal 彈窗
                document.getElementById('ModalComment').classList.remove('show');
            })
            .catch(error => console.error('評論提交失敗:', error));
    };

    const handleColseComment = () => {
        // 清空表單數據
        setCommentData({ user_id: userData.id, p_id: 0, r_id: 0, c_id: 0, star: 0, description: '' });
        // 關閉 modal 彈窗
        document.getElementById('ModalComment').classList.remove('show');
    }
    useEffect(() => {
        console.log(commentData);
    }, [commentData]);

    // 用route 導入id獲取訂單詳細資料
    useEffect(() => {
        if (id) {
            fetch(`http://localhost:3005/api/member-center/order-history/detail/${id}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch order detail');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data)
                    setOrderDetail(data);
                    setIsLoading(false)
                })
                .catch(error => {
                    setError(error);
                    setIsLoading(false);
                });
        }
    }, [id]); // 確保 orderId 有更新時重新發送請求


    if (isLoading) {
        return
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }


    // 函式處理星級評分的變化
    const handleStarChange = (value) => {
        console.log("評分:", value) // 檢查星星的值是否正確接收
        setRating(value)
        setCommentData({
            ...commentData,
            star: value
        })
    };
    //  在商品彈窗中設置 r_id
    const handleAddProductComment = (productId) => {
        // 更新 commentData 中的對應 ID
        console.log("ID:", productId)
        setCommentData({
            ...commentData,
            p_id: productId
        });
    };
    // 在租賃彈窗中設置 r_id
    const handleAddRentComment = (rentId) => {
        console.log("ID:", rentId)
        setCommentData({
            ...commentData,
            r_id: rentId
        });
    };

    // 在課程彈窗中設置 c_id
    const handleAddCourseComment = (courseId) => {
        console.log("ID:", courseId)
        setCommentData({
            ...commentData,
            c_id: courseId
        });
    };


    return (
        <>
            <div className={`${styles.containerRWD} container`}>
                <div className="row">
                    <div className={`${styles.boxMargin} col-12 col-sm-3`}>
                        <h5>
                            會員中心 /{" "}
                            <a className={styles.noBottom} href="">
                                <span className={styles.bread}>訂單明細</span>
                            </a>
                        </h5>
                    </div>
                </div>
                <div className="row">
                    <Sidebar />

                    <div className="col-12 col-sm-9 py-2">
                        <div className={`${styles.titNub} d-flex align-items-center mb-4`}>
                            <h6>訂單編號: {orderDetail[0].coding}</h6>
                            <div className={`mx-3 px-1 py-1`}>
                                <h6><span className='badge bg-primary'>{orderDetail[0].type}</span></h6>
                            </div>
                        </div>
                        <div className={`${styles.memberProfile} row`}>
                            <div className="col-12 col-sm-6 mb-3">
                                <table className="">
                                    <tbody>
                                        <tr>
                                            <th className={styles.titleD}>收件人:</th>
                                            <td className={styles.titleD}>{orderDetail[0].name}</td>
                                        </tr>
                                        <tr>
                                            <th className={styles.titleD}>連絡電話:</th>
                                            <td className={styles.titleD}>{orderDetail[0].phone}</td>
                                        </tr>
                                        <tr>
                                            <th className={styles.titleD}>寄送物流:</th>
                                            <td className={styles.titleD}>
                                                <span className={styles.bread}>|{orderDetail[0].delivery}|</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className={styles.titleD}>收件地址:</th>
                                            <td className={styles.titleD}>{orderDetail[0].address}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-12 col-sm-6">
                                <table>
                                    <tbody>
                                        <tr>
                                            <th className={styles.titleD}>訂單時間:</th>
                                            <td className={styles.titleD}>{orderDetail[0].order_time}</td>
                                        </tr>
                                        <tr>
                                            <th className={styles.titleD}>訂單狀態:</th>
                                            <td className={styles.titleD}>
                                                <span className={styles.bread}>{orderDetail[0].status}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className={styles.titleD}>付款方式:</th>
                                            <td className={styles.titleD}>{orderDetail[0].payment}</td>
                                        </tr>
                                        <tr>
                                            <th className={styles.titleD}>顧客備註:</th>
                                            <td className={styles.titleD}>{orderDetail[0].note}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className={`row ${styles.tableWrapper}`} >
                            <table  className={` ${styles.n3}`}>
                                <thead>
                                    <tr className={`${styles.trColor} text-center`}>
                                        <th>圖片</th>
                                        <th>商品資訊</th>
                                        <th className={`${styles.n2} `}>單價</th>
                                        <th>數量</th>
                                        <th>總金額</th>
                                    </tr>
                                </thead>
                                {orderDetail.filter(order => order.product_id > 0).map((order) => {
                                    return (
                                        <tbody key={order.id} className={styles.proTbody}>
                                            <tr>
                                                <td>
                                                    <div className={`${styles.infoBox} d-flex`}>
                                                        <div className={`${styles.infoBoxImg}`}>
                                                            <a href={`/product/${order.product_id}`}><img
                                                                src={`/images/product/${order.img}`}
                                                                alt=""
                                                            /></a>

                                                        </div>

                                                    </div>
                                                </td>
                                                <td>
                                                    <div className={`${styles.infoBox} d-flex`}>
                                                        <div className={`${styles.describe} ps-2`}>
                                                            <p>
                                                                <span>{order.p_name}</span>
                                                            </p>
                                                            <p>
                                                                <span>規格 : {order.p_color} / {order.p_size}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className={` text-center ${styles.n2} `}>
                                                    <p>${order.p_price * 0.8}</p>
                                                </td>
                                                <td className="text-center">
                                                    <p>{order.p_amount}</p>
                                                </td>
                                                <td className="text-center">
                                                    <p>
                                                        <span className={`${styles.bread} fw-bold`}>${order.p_total}</span>
                                                    </p>
                                                    <button type="button" className={`${styles.btnColor2} ${styles.b2}`} onClick={() => handleAddProductComment(order.product_id)} data-bs-toggle="modal" data-bs-target="#ModalComment">新增評論</button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    )
                                })}
                                {orderDetail.filter(order => order.rent_id > 0).map((order) => {
                                    return (
                                        <tbody key={order.id} className={styles.proTbody}>
                                            <tr>
                                                <td>
                                                    <div className={`${styles.infoBox} d-flex`}>
                                                        <div className={`${styles.infoBoxImg}`}>
                                                            <a href={`/rent/detail?pid=${order.rent_id}`}>
                                                                <img
                                                                    src={`/images/rent/${order.img}`}
                                                                    alt=""
                                                                /></a>

                                                        </div>
                                                        
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className={`${styles.infoBox} d-flex`}>
                                                       
                                                        <div className={`${styles.describe} px-3`}>
                                                            <p>
                                                                <span>{order.r_name}</span>
                                                            </p>
                                                            <p>
                                                                <span>規格 : {order.r_color} / {order.r_size}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td   className={` text-center ${styles.n2} `}>
                                                    <p>${order.r_price * 0.8} /天</p>
                                                </td>
                                                <td className="text-center">
                                                    <p>{order.start_time}</p>
                                                    <p>{order.end_time}</p>
                                                </td>
                                                <td className="text-center">
                                                    <p>
                                                        <span className={`${styles.bread} fw-bold`}>${order.r_total}</span>
                                                    </p>
                                                    <button type="button"  className={`${styles.btnColor2} ${styles.b2}`} onClick={() => handleAddRentComment(order.rent_id)} data-bs-toggle="modal" data-bs-target="#ModalComment">新增評論</button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    )
                                })}
                                {orderDetail.filter(order => order.course_id > 0).map((order) => {
                                    return (
                                        <tbody key={order.id} className={`${styles.proTbody} align-items-center `}>
                                            <tr>
                                                <td>
                                                    <div className={styles.infoCourseImg}>
                                                        <a href={`/course/${order.course_id}`} >
                                                            <img src={`/images/course/${order.img}`} alt="" />
                                                        </a>

                                                    </div>
                                                </td>
                                                <td className={`${styles.describeTD} pt-4`} >
                                                    <div className={styles.describe}>
                                                        <span className={`${styles.bread} fw-bold `}><h6>{order.c_name}</h6></span>
                                                        <p className='mt-3'>
                                                            <span className=''>{order.star_time}~{order.end_time}</span>
                                                        </p>
                                                        <p>
                                                            <span>教練 : {order.t_name}</span>
                                                        </p>
                                                        <ul>
                                                            <li dangerouslySetInnerHTML={{
                                                                __html: truncateDescription(order.description),
                                                            }}>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </td>
                                                <td className={` text-center ${styles.n2} `}>
                                                    <p>${order.c_price}</p>
                                                </td>
                                                <td className="text-center">
                                                    <p>{order.c_amount}/人</p>
                                                </td>
                                                <td className="text-center">
                                                    <p>
                                                        <span className={`${styles.bread} fw-bold`}>${order.c_total}</span>
                                                    </p>
                                                    <button type="button" className={`${styles.btnColor2} ${styles.b2}`} onClick={() => handleAddCourseComment(order.course_id)} data-bs-toggle="modal" data-bs-target="#ModalComment">新增評論</button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    )
                                })}
                            </table>

                        </div>
                        <div  className={` row mt-3 `}>
                            <div className={`${styles.couponBox} ${styles.subBox} col-12 col-sm-4 mb-5`}>
                                使用折價卷:{" "}
                                {orderDetail[0].cp_name ? (
                                    <span className={`${styles.bread}`}>{orderDetail[0].cp_name} ({orderDetail[0].coupon_code})</span>
                                ) : (
                                    <span className={`${styles.bread}`}>無使用</span>
                                )}
                            </div>
                            <div className="col-5" />
                            <div className={`${styles.subBox} col-12 col-sm-3 mb-3`}>
                                <table className={`${styles.subtotal} w-100`}>
                                    <tbody>
                                        <tr>
                                            <th className={styles.subth}>數量:</th>
                                            <td className={`${styles.subth} text-end`}>{orderDetail[0].all_amount}</td>
                                        </tr>
                                        <tr>
                                            <th className={styles.subth}>小計:</th>
                                            <td className={`${styles.subth} text-end`}>${orderDetail[0].total_price}</td>
                                        </tr>
                                        <tr>
                                            <th className={styles.subth}>折扣:</th>
                                            <td className={`${styles.subth} text-end`}>
                                                <span className={styles.bread}>- ${orderDetail[0].discount_price}</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table className="mt-3 w-100">
                                    <tbody>
                                        <tr>
                                            <th className="fw-bold fs-6">總計:</th>
                                            <td className="text-end fw-bold fs-6">
                                                <span className={styles.bread}>${orderDetail[0].final_price}</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* 評論  modal 彈窗 */}
                        <div className="modal fade" id="ModalComment" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class={`modal-dialog modal-lg text-info`}>
                                <div class="modal-content px-3 pt-3">
                                    <div class="modal-header">
                                        <h5 class="modal-title fs-5 mx-auto" id="exampleModalLabel">評論</h5>
                                        <button type="button" class="btn-close ms-auto" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body text-start px-4">
                                        <form onSubmit={handleSubmit}>
                                            <div class="mb-3">
                                                <label htmlFor="recipient-name" className="col-form-label" >星級:</label>
                                                {/* 將星級評分的點擊事件直接綁定到 setCommentData 函式 */}
                                                <Star value={rating} onChange={handleStarChange} />
                                            </div>
                                            <div class="mb-3">
                                                <label htmlFor="message-text" className="col-form-label">內容:</label>
                                                {/* 將 textarea 的 value 和 onChange 事件綁定到 commentData 狀態中的 description 屬性 */}
                                                <textarea className="form-control" id="message-text"
                                                    value={commentData.description}
                                                    onChange={(e) => setCommentData({ ...commentData, description: e.target.value })}></textarea>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleColseComment}>關閉</button>
                                        <button type="button" className="btn btn-primary text-light" onClick={handleSubmitComment}>送出評論</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* )
                    })} */}

                </div>
            </div>
        </>
    )
}
