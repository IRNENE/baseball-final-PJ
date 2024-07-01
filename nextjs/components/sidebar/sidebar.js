import React from 'react'
import styles from './style_lai.module.css'
import { FaAngleRight } from 'react-icons/fa'

import Link from 'next/link'

export default function Sidebar() {
  return (
    <>
      <input
        type="checkbox"
        className={styles.leftSideBtn}
        id={styles.leftSideActive}
      />
      <div className={`col-2 ${styles.leftSide}`}>
        <ul className="list-unstyled">
          <li className={styles.left11}>
            <Link className={styles.noBottom} href="/member/profile">
              <h6>會員資料</h6>
            </Link>
          </li>
          <li className={styles.left2}>
            <Link className={styles.noBottom} href="/member/order-history">
              <h6>歷史訂單</h6>
            </Link>
          </li>
          <li className={styles.left3}>
            <Link className={styles.noBottom} href="/member/coupon">
              <h6>優惠卷</h6>
            </Link>
          </li>
          <li className={styles.left4}>
            <Link className={styles.noBottom} href="/member/wishlist">
              <h6>我的收藏</h6>
            </Link>
          </li>
          <li className={styles.left5}>
            <Link className={styles.noBottom} href="/member/myjoin">
              <h6>我的揪團</h6>
            </Link>
          </li>
        </ul>
        <label className={styles.leftSideBtn} htmlFor={styles.leftSideActive}>
          <FaAngleRight />
        </label>
      </div>
      <div className="col-sm-1" />
    </>
  )
}
