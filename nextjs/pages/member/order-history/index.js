import React, { useState, useEffect } from 'react'
import styles from '@/styles/style_lai.module.css'
import Sidebar from '@/components/sidebar/sidebar'
import { GoTriangleRight, GoTriangleLeft } from 'react-icons/go'
import Link from 'next/link'
import { initUserData, useAuth } from '@/hooks/use-auth'
import { BiSolidLeftArrow, BiSolidRightArrow } from 'react-icons/bi';

export default function OrderHistory() {
    const { auth, setAuth } = useAuth()
    const { isAuth, userData } = auth

    const [tab, setTab] = useState('綜合'); // 目前所選擇的頁籤
    const [orders, setOrders] = useState([]); // 歷史訂單的狀態
    const [totalItems, setTotalItems] = useState()
    const [sortOrder, setSortOrder] = useState('')

    const ordersA = orders.filter(e => e.type === '綜合')
    const ordersP = orders.filter(e => e.type === '商品')
    const ordersR = orders.filter(e => e.type === '租借')
    const ordersC = orders.filter(e => e.type === '課程')

    const [currentPage, setCurrentPage] = useState(1); // 目前所在的頁碼
    const itemsPerPage = 5; // 每頁顯示的項目數量


    // 發送HTTP請求獲取訂單數據
    const fetchOrder = () => {
        const url = `http://localhost:3005/api/member-center/order-history/${userData.id}`
        // 使用 fetch 方法向後端發送 GET 請求
        fetch(url)
            .then((response) => {
                // 檢查 HTTP 狀態碼
                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }
                // 解析 JSON 格式的回應
                return response.json()
            })

            .then(data => {
                console.log("抓取我的歷史訂單")
                console.log("我的歷史訂單:", data)
                // 計算總筆數
                const totalItems = orders.filter(order => order.type === tab).length;
                setTotalItems(totalItems);
                setOrders(data);
                
            })
            .catch(error => {
                console.error('發生錯誤：', error);
            });
    }
    useEffect(() => {
        fetchOrder();
    }, [userData.id, tab]);

    // 排序相關
    const handleSortChange = (event) => {
        setSortOrder(event.target.value)
        console.log(event.target.value)

        fetchURL()
    }

    const fetchURL = async () => {
        let url = `http://localhost:3005/api/member-center/order-history/${userData.id}?`;

        const queryParams = [];
        if (sortOrder) {
            queryParams.push(`sortOrder=${sortOrder}`);
        }
        // 拼上排序參數
        url += queryParams.join('&');
        // 請求獲取更新排序後的資料
        await fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setOrders(data);
            });
    };
    useEffect(() => {
        fetchURL();
    }, [sortOrder]);
    // 排序相關結束

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className={`${styles.boxMargin} col-12 col-sm-3 `}>
                        <h5>
                            會員中心 /{" "}
                            <a className={styles.noBottom} href="">
                                <span className={styles.bread}>歷史訂單</span>
                            </a>
                        </h5>
                    </div>
                    <div className={`${styles.tabsMargin} col-12 col-sm-9 pt-3`}>
                        <ul className={`${styles.ulBorder} list-unstyled d-flex justify-content-around text-center`}>
                            <div className={`${tab === '綜合' ? styles.active3 : ''}`} onClick={() => setTab('綜合')} style={{ width: '264px' }}><li className='pb-2'><Link className={styles.noBottom} href="">綜合訂單</Link></li></div>
                            <div className={`${tab === '商品' ? styles.active3 : ''}`} onClick={() => setTab('商品')} style={{ width: '264px' }}><li className='pb-2'><Link className={styles.noBottom} href="">商品訂單</Link></li></div>
                            <div className={`${tab === '租借' ? styles.active3 : ''}`} onClick={() => setTab('租借')} style={{ width: '264px' }}><li className='pb-2'><Link className={styles.noBottom} href="">租借訂單</Link></li></div>
                            <div className={`${tab === '課程' ? styles.active3 : ''}`} onClick={() => setTab('課程')} style={{ width: '264px' }}><li className='pb-2'><Link className={styles.noBottom} href="">課程訂單</Link></li></div>
                        </ul>
                    </div>
                </div>
                <div className="row">
                    <Sidebar />
                    <div className={`${styles.rwdMargin} col-12 col-sm-9 py-2`}>
                        <div className="d-flex  align-items-end pb-3">
                            <span className={`${styles.perpageColor} ms-auto`} >共 {totalItems} 筆</span>
                            <select className="ms-4" name="" id="" onChange={handleSortChange}>
                                <option value="">排序</option>
                                <option value="2">從新到舊</option>
                                <option value="1">從舊到新</option>
                            </select>
                        </div>
                        <div>
                            <table className={`${styles.noneRWD} my-2`}>
                                <tbody >
                                    <tr className={`${styles.trColor} text-center`} >
                                        <th className="col-1 py-3">
                                            <h6>項目</h6>
                                        </th>
                                        <th className="col-2">
                                            <h6>訂單編號</h6>
                                        </th>
                                        <th className="col-1">
                                            <h6>訂單日期</h6>
                                        </th>
                                        <th className="col-2">
                                            <h6>訂單總額</h6>
                                        </th>
                                        <th className="col-1">
                                            <h6>訂單狀態</h6>
                                        </th>
                                        <th className="col-2" />
                                    </tr>
                                    {/* 使用 map 函數將每個訂單渲染到表格中 */}
                                    {tab === '綜合' && ordersA.length === 0 && (
                                        <tr className="text-center border">
                                            <td colSpan="6"><h4 className={`${styles.n1} `}>暫時沒有歷史訂單</h4></td>
                                        </tr>
                                    )}
                                    {tab === '綜合' && ordersA
                                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                        .map((order, i) => {
                                            return (
                                                <tr key={order.id} className="text-center border ">
                                                    <td className="py-3">{order.type}</td>
                                                    <td className='fw-bold'>{order.coding}</td>
                                                    <td>{order.order_time.split(' ')[0]}</td>
                                                    <td>
                                                        <span className={`${styles.bread} fw-bold`}>${order.final_price}</span>
                                                    </td>
                                                    <td>{order.status}</td>
                                                    <td>
                                                        <a className={`${styles.btnColor2} py-1 px-2`} href={`/member/order-history/${order.id}`}>查看明細</a>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                        )}
                                    {tab === '商品' && ordersP.length === 0 && (
                                        <tr className="text-center border">
                                            <td colSpan="6"><h4  className={`${styles.n1} `}>暫時沒有歷史訂單</h4></td>
                                        </tr>
                                    )}
                                    {tab === '商品' && ordersP.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((order, i) => {
                                        return (
                                            <tr key={order.id} className="text-center border ">
                                                <td className="py-3">{order.type}</td>
                                                <td className='fw-bold'>{order.coding}</td>
                                                <td>{order.order_time.split(' ')[0]}</td>
                                                <td>
                                                    <span className={`${styles.bread} fw-bold`}>${order.final_price}</span>
                                                </td>
                                                <td>{order.status}</td>
                                                <td>
                                                    <a className={`${styles.btnColor2} py-1 px-2`} href={`/member/order-history/${order.id}`}>查看明細</a>
                                                </td>
                                            </tr>
                                        )
                                    }
                                    )}
                                    {tab === '租借' && ordersR.length === 0 && (
                                        <tr className="text-center border">
                                            <td colSpan="6"><h4  className={`${styles.n1} `}>暫時沒有歷史訂單</h4></td>
                                        </tr>
                                    )}
                                    {tab === '租借' && ordersR.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((order, i) => {
                                        return (
                                            <tr key={order.id} className="text-center border ">
                                                <td className="py-3">{order.type}</td>
                                                <td className='fw-bold'>{order.coding}</td>
                                                <td>{order.order_time.split(' ')[0]}</td>
                                                <td>
                                                    <span className={`${styles.bread} fw-bold`}>${order.final_price}</span>
                                                </td>
                                                <td>{order.status}</td>
                                                <td>
                                                    <a className={`${styles.btnColor2} py-1 px-2`} href={`/member/order-history/${order.id}`}>查看明細</a>
                                                </td>
                                            </tr>
                                        )
                                    }
                                    )}
                                    {tab === '課程' && ordersC.length === 0 && (
                                        <tr className="text-center border">
                                            <td colSpan="6"><h4  className={`${styles.n1} `}>暫時沒有歷史訂單</h4></td>
                                        </tr>
                                    )}
                                    {tab === '課程' && ordersC.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((order, i) => {
                                        return (
                                            <tr key={order.id} className="text-center border ">
                                                <td className="py-3">{order.type}</td>
                                                <td className='fw-bold'>{order.coding}</td>
                                                <td>{order.order_time.split(' ')[0]}</td>
                                                <td>
                                                    <span className={`${styles.bread} fw-bold`}>${order.final_price}</span>
                                                </td>
                                                <td>{order.status}</td>
                                                <td>
                                                    <a className={`${styles.btnColor2} py-1 px-2`} href={`/member/order-history/${order.id}`}>查看明細</a>
                                                </td>
                                            </tr>
                                        )
                                    }
                                    )}


                                </tbody>
                            </table>
                        </div>


                        {/* RWD 手機板限定區域   開始 */}
                        <div className={`${styles.orderBox}`}>
                            <table className={`${styles.rwdBox} my-3`}>
                                {orders
                                    .filter(order => order.type === tab) // 過濾符合當前選擇的 tab 的訂單
                                    .length === 0 && (
                                        <tbody>
                                            <tr>
                                                <td className="text-center"><h4>暫時沒有歷史訂單</h4></td>
                                            </tr>
                                        </tbody>
                                    )}
                                {orders
                                    .filter(order => order.type === tab) // 過濾符合當前選擇的 tab 的訂單
                                    .map(order => (
                                        <tbody key={order.id} className={`${styles.borderTop}`}>
                                            <tr>
                                                <th className={styles.thRWD1}>項目:</th>
                                                <td>{order.type}</td>
                                            </tr>
                                            <tr >
                                                <th className={styles.thRWD1}>訂單編號:</th>
                                                <td><span className={`${styles.bread} fw-bold`}>{order.coding}</span></td>
                                            </tr>
                                            <tr >
                                                <th className={styles.thRWD1}>訂單日期:</th>
                                                <td>{order.order_time.split(' ')[0]}</td>
                                            </tr>
                                            <tr >
                                                <th className={styles.thRWD1}>訂單總額:</th>
                                                <td><span className={`${styles.bread} fw-bold`}>${order.final_price}</span></td>
                                            </tr>
                                            <tr >
                                                <th className={styles.thRWD1}>訂單狀態:</th>
                                                <td>{order.status}</td>
                                                <td colSpan="2" className="text-center"><Link href={`/member/order-history/${order.id}`}><botton className={`btn btn-primary  text-white ${styles.btnColor2} ${styles.btnRWD1}`}>查看明細</botton></Link></td>
                                            </tr>
                                        </tbody>
                                    ))}
                            </table>
                        </div>
                        {/* RWD  手機板限定區域  結束 */}

                        <ul className={`${styles.noneRWD} pagination justify-content-center py-3`}>
                            <li
                                className={`page-item ps-2  ${currentPage === 1 ? 'd-none' : ''
                                    }`}
                            >
                                <a
                                    className="page-link rounded-0"
                                    href="#"
                                    aria-label="Previous"
                                    onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}
                                >
                                    <span aria-hidden="true"><BiSolidLeftArrow /></span>
                                </a>
                            </li>
                            {/* <li className="page-item">
                                <span className="page-link" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                                    <GoTriangleLeft />
                                </span>
                            </li> */}
                            {tab === '綜合' && Array.from({ length: Math.ceil(ordersA.length / itemsPerPage) }, (_, index) => (
                                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                    <a className="page-link" onClick={() => setCurrentPage(index + 1)}>
                                        {index + 1}
                                    </a>
                                </li>
                            ))}
                            {tab === '商品' && Array.from({ length: Math.ceil(ordersP.length / itemsPerPage) }, (_, index) => (
                                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                    <a className="page-link" href="#" onClick={() => setCurrentPage(index + 1)}>
                                        {index + 1}
                                    </a>
                                </li>
                            ))}
                            {tab === '租借' && Array.from({ length: Math.ceil(ordersR.length / itemsPerPage) }, (_, index) => (
                                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                    <a className="page-link" href="#" onClick={() => setCurrentPage(index + 1)}>
                                        {index + 1}
                                    </a>
                                </li>
                            ))}
                            {tab === '課程' && Array.from({ length: Math.ceil(ordersC.length / itemsPerPage) }, (_, index) => (
                                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                    <a className="page-link" href="#" onClick={() => setCurrentPage(index + 1)}>
                                        {index + 1}
                                    </a>
                                </li>
                            ))}
                            {/* <li className="page-item">
                                <a className="page-link" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === Math.ceil(ordersA.length / itemsPerPage)}>
                                    <GoTriangleRight />
                                </a>
                            </li> */}
                            <li
                                className="page-item pb-1 ps-2"
                            >
                                <a
                                    className="page-link rounded-0"
                                    href="#"
                                    aria-label="Next"
                                    onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === Math.ceil(ordersA.length / itemsPerPage)}
                                >
                                    <span aria-hidden="true"><BiSolidRightArrow /></span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}
