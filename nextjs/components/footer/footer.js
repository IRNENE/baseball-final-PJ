import React from 'react'
import Link from 'next/link'
import styles from './footer.module.css'
import { MdOutlinePhoneInTalk } from 'react-icons/md'
import { CiCalendar, CiMail, CiInstagram } from 'react-icons/ci'
import { FaFacebookSquare, FaLine } from 'react-icons/fa'

export default function Footer() {
  return (
    <>
      <footer
        className={`footer container-fluid bg-dark d-flex justify-content-center ${styles.footer}`}
      >
        <nav className="container text-center text-sm-start">
          <div className="topbox d-flex align-items-start justify-content-sm-between justify-content-center mb-3">
            <Link
              href="http://localhost:3000/"
              className="logo-con d-flex align-items-center gap-1 text-white"
            >
              <div className="logo-box">
                <img src="/images/logo.png" alt="" className="img" />
              </div>
              <h4>棒球好玩家</h4>
            </Link>
            <div
              className={`navbox d-sm-flex d-none justify-content-between ${styles.navbox}`}
            >
              <ul className="list-unstyled">
                <li>
                  <h5>導覽</h5>
                </li>
                <Link href="/article">
                  <li className="text-light">專欄</li>
                </Link>
                <Link href="/course">
                  <li className="text-light">課程</li>
                </Link>
                <Link href="/product">
                  <li className="text-light">商城</li>
                </Link>
                <Link href="/rent">
                  <li className="text-light">租借</li>
                </Link>
                <Link href="/join">
                  <li className="text-light">揪團</li>
                </Link>
              </ul>
              <ul className="list-unstyled">
                <li>
                  <h5>資訊</h5>
                </li>
                <Link href="/">
                  <li className="text-light">首頁</li>
                </Link>
                <Link href="#">
                  <li className="text-light">關於我們</li>
                </Link>
                <Link href="#">
                  <li className="text-light">聯絡我們</li>
                </Link>
              </ul>
              <ul className="list-unstyled">
                <li>
                  <h5>會員</h5>
                </li>
                <Link href="/member/profile">
                  <li className="text-light">會員中心</li>
                </Link>
                <Link href="/cart">
                  <li className="text-light">購物車</li>
                </Link>
              </ul>
              <ul className="list-unstyled">
                <li>
                  <h5>追蹤我們</h5>
                </li>
                <Link href="#">
                  <li>
                    <CiInstagram className={`me-1 text-light ${styles.icon}`} />
                    <FaFacebookSquare
                      className={`mx-1 text-light ${styles.icon}`}
                    />
                    <FaLine className={`mx-1 text-light ${styles.icon}`} />
                  </li>
                </Link>
                <li />
              </ul>
              <ul className="list-unstyled">
                <li>
                  <h5>聯絡資訊</h5>
                </li>
                <li>
                  <MdOutlinePhoneInTalk /> 02-2233-4455
                </li>
                <li>
                  <CiCalendar /> 08:30-17:30
                </li>
                <li>
                  <CiMail /> twbaseballteam@gmail.com
                </li>
              </ul>
            </div>
          </div>
          <h6>© 2024 Baseball. All Rights Reserved.</h6>
        </nav>
      </footer>
    </>
  )
}
