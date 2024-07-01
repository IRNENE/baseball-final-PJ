import React, { useEffect, useState } from 'react'
import styles from './navM.module.css'
import Link from 'next/link'

export default function NavM() {
  // const [selectedMain, setSelectedMain] = useState('')
  // const [subCate, setSubCate] = useState([])

  const mainCate = [
    {
      id: 1,
      name: '專欄',
      subCate: ['棒球-規則', '棒球-術語', '棒球-用語'],
      url: '/article',
    },
    {
      id: 2,
      name: '課程',
      subCate: ['投球', '打擊', '守備', '體能', '知識'],
      url: '/course',
    },
    {
      id: 3,
      name: '教練',
      subCate: [''],
      url: '/teacher',
    },
    {
      id: 4,
      name: '商城',
      subCate: [
        '球棒',
        '球',
        '帽子',
        '球衣',
        '球褲',
        '手套',
        '襪子',
        '球鞋',
        '裝備',
        '護具',
      ],
      url: '/product',
    },
    {
      id: 5,
      name: '租借',
      subCate: [
        '球棒',
        '球',
        '帽子',
        '球衣',
        '球褲',
        '手套',
        '襪子',
        '球鞋',
        '裝備',
        '護具',
      ],
      url: '/rent',
    },
    {
      id: 6,
      name: '場域地圖',
      subCate: [''],
      url: '/place',
    },
    {
      id: 7,
      name: '揪團',
      subCate: ['正在揪團', '已成團'],
      url: '/join',
    },
  ]

  // const handleMainClick = (category) => {
  //   setSelectedMain(category.name)
  //   setSubCate(category.subCate.map((subCategory) => ({ name: subCategory })))
  // }

  // const handleSubCategoryClick = (subcategory) => {
  //   // Handle subcategory click event
  //   console.log('Clicked subcategory:', subcategory)
  // }

  // 下滑隱藏nav用
  const [scrollDirection, setScrollDirection] = useState('down')
  const [prevScrollPos, setPrevScrollPos] = useState(0)
  const handleScroll = () => {
    const currentScrollPos = window.scrollY
    if (currentScrollPos > prevScrollPos) {
      setScrollDirection('down')
    } else {
      setScrollDirection('up')
    }
    setPrevScrollPos(currentScrollPos)
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 576) {
        window.addEventListener('scroll', handleScroll)
      } else {
        window.removeEventListener('scroll', handleScroll)
      }
    }

    handleResize()

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [prevScrollPos])

  const shouldHideNav = scrollDirection === 'down' && prevScrollPos > 50

  return (
    <div className={`d-flex ${shouldHideNav ? 'd-none' : styles.navMobile}`}>
      <div className={styles.title}>
        <ul className="list-unstyled">
          {mainCate.map((category) => (
            <Link
              href={category.url}
              key={category.id}
              className={`text-light`}
            >
              <li

              // onClick={() => handleMainClick(category)}
              // className={selectedMain === category.name ? styles.active : ''}
              >
                {category.name}
              </li>
            </Link>
          ))}
        </ul>
      </div>
      {/* <div className={styles.content}>
        <ul className="list-unstyled">
          {subCate.map((subcategory, index) => (
            <li key={index} onClick={() => handleSubCategoryClick(subcategory)}>
              {subcategory.name}
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  )
}
