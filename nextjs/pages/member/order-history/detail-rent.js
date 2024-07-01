import React from 'react'
import styles from '@/styles/style_lai.module.css'
import Sidebar from '@/components/sidebar/sidebar';
import Link from 'next/link';
import { initUserData, useAuth } from '@/hooks/use-auth'
import Star from '@/components/star/star';


export default function DetailProduct() {
    const { auth, setAuth } = useAuth()
    const { isAuth, userData } = auth

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
                            <h6>訂單編號:164837191212</h6>
                            <div className={` mx-3 px-1 py-1`}>
                                <h6><span className='badge bg-primary'>租借</span></h6>
                            </div>
                        </div>
                        <div className={`${styles.memberProfile} row`}>
                            <div className="col-12 col-sm-6 mb-3">
                                <table className="">
                                    <tbody>
                                        <tr>
                                            <th className={styles.titleD}>收件人:</th>
                                            <td className={styles.titleD}>統一獅</td>
                                        </tr>
                                        <tr>
                                            <th className={styles.titleD}>連絡電話:</th>
                                            <td className={styles.titleD}>0912345678</td>
                                        </tr>
                                        <tr>
                                            <th className={styles.titleD}>寄送物流:</th>
                                            <td className={styles.titleD}>
                                                <span className={styles.bread}>|到店自取|</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className={styles.titleD}>收件地址:</th>
                                            <td className={styles.titleD}>320桃園市中壢區新生路二段421號</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-12 col-sm-6">
                                <table>
                                    <tbody>
                                        <tr>
                                            <th className={styles.titleD}>訂單時間:</th>
                                            <td className={styles.titleD}>2023-03-18 12:27:05</td>
                                        </tr>
                                        <tr>
                                            <th className={styles.titleD}>訂單狀態:</th>
                                            <td className={styles.titleD}>
                                                <span className={styles.bread}>已完成</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className={styles.titleD}>付款方式:</th>
                                            <td className={styles.titleD}>信用卡</td>
                                        </tr>
                                        <tr>
                                            <th className={styles.titleD}>顧客備註:</th>
                                            <td className={styles.titleD}>預計早上開店時會去取貨</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className={`row ${styles.tableWrapper}`} >
                            <table>
                                <thead>
                                    <tr className={`${styles.trColor} text-center`}>
                                        <th>商品資訊</th>
                                        <th>單價</th>
                                        <th>租借期間</th>
                                        <th>總金額</th>
                                    </tr>
                                </thead>
                                <tbody className={styles.proTbody}>
                                    <tr>
                                        <td>
                                            <div className={`${styles.infoBox} d-flex`}>
                                                <div className={`${styles.infoBoxImg}`}>
                                                    <img
                                                        src="/images/product/baseball_glove001.jpg"
                                                        alt=""
                                                    />
                                                </div>
                                                <div className={`${styles.describe} px-3`}>
                                                    <p>
                                                        <span>WING FIELD 棒壘手套 黑X萊姆黃 外野 左投</span>
                                                    </p>
                                                    <p>
                                                        <span>規格 : 藍 / 27</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <p>$800/天</p>
                                        </td>
                                        <td className="text-center">
                                            <p>2024-03-12</p>
                                            <p>2024-03-14</p>
                                        </td>
                                        <td className="text-center">
                                            <p>
                                                <span className={`${styles.bread} fw-bold`}>$1600</span>
                                            </p>
                                            <button type="button" className={styles.btnColor2} data-bs-toggle="modal" data-bs-target="#ModalComment">新增評論</button>
                                        </td>
                                    </tr>
                                </tbody>
                                <tbody className={styles.proTbody}>
                                    <tr>
                                        <td>
                                            <div className={`${styles.infoBox} d-flex`}>
                                                <div className={`${styles.infoBoxImg}`}>
                                                    <img
                                                        src="/images/product/baseball_glove001.jpg"
                                                        alt=""
                                                    />
                                                </div>
                                                <div className={`${styles.describe} px-3`}>
                                                    <p>
                                                        <span>
                                                            KUBOTA KSG-TA6 廣島東洋鯉魚 安部友裕 硬式 內野
                                                        </span>
                                                    </p>
                                                    <p>
                                                        <span>規格 : 藍 / 27</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <p>$800/天</p>
                                        </td>
                                        <td className="text-center">
                                            <p>2024-03-12</p>
                                            <p>2024-03-14</p>
                                        </td>
                                        <td className="text-center">
                                            <p>
                                                <span className={`${styles.bread} fw-bold`}>$1600</span>
                                            </p>
                                            <button type="button" className={styles.btnColor2} data-bs-toggle="modal" data-bs-target="#ModalComment">新增評論</button>
                                        </td>
                                    </tr>
                                </tbody>
                                <tbody className={styles.proTbody}>
                                    <tr>
                                        <td>
                                            <div className={`${styles.infoBox} d-flex`}>
                                                <div className={`${styles.infoBoxImg}`}>
                                                    <img
                                                        src="/images/product/baseball_glove001.jpg"
                                                        alt=""
                                                    />
                                                </div>
                                                <div className={`${styles.describe} px-3`}>
                                                    <p>
                                                        <span>壘球手套 FRIENDSHIP</span>
                                                    </p>
                                                    <p>
                                                        <span>規格 : 藍 / 27</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <p>$800/天</p>
                                        </td>
                                        <td className="text-center">
                                            <p>2024-03-12</p>
                                            <p>2024-03-13</p>
                                        </td>
                                        <td className="text-center">
                                            <p>
                                                <span className={`${styles.bread} fw-bold`}>$800</span>
                                            </p>
                                            <button type="button" className={styles.btnColor2} data-bs-toggle="modal" data-bs-target="#ModalComment">新增評論</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="row mt-3">
                            <div className={`${styles.couponBox} col-12 col-sm-4 mb-5`}>
                                使用折價卷: {" "}
                                <span className={`${styles.bread}`}>週年慶滿千送百(RFHUUKVXU3)</span>
                            </div>
                            <div className="col-5" />
                            <div className={`${styles.subBox} col-12 col-sm-3 mb-3`}>
                                <table className={`${styles.subtotal} w-100`}>
                                    <tbody>
                                        <tr>
                                            <th className={styles.subth}>數量:</th>
                                            <td className={`${styles.subth} text-end`}>3</td>
                                        </tr>
                                        <tr>
                                            <th className={styles.subth}>小計:</th>
                                            <td className={`${styles.subth} text-end`}>$4000</td>
                                        </tr>
                                        <tr>
                                            <th className={styles.subth}>運費:</th>
                                            <td className={`${styles.subth} text-end`}>$70</td>
                                        </tr>
                                        <tr>
                                            <th className={styles.subth}>折扣:</th>
                                            <td className={`${styles.subth} text-end`}>
                                                <span className={styles.bread}>- $100</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table className="mt-3 w-100">
                                    <tbody>
                                        <tr>
                                            <th className="fw-bold fs-6">總計:</th>
                                            <td className="text-end fw-bold fs-6">
                                                <span className={styles.bread}>$3970</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
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
                            <form>
                                <div class="mb-3">
                                    <label for="recipient-name" className="col-form-label">星級:</label>
                                    <Star />
                                </div>
                                <div class="mb-3">
                                    <label for="message-text" className="col-form-label">內容:</label>
                                    <textarea className="form-control" id="message-text"></textarea>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary text-light">送出評論</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
