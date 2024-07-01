import React, { useEffect, useState } from 'react'
import styles from '@/styles/index.module.css'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
//Swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'
import { Navigation, EffectCoverflow } from 'swiper/modules'
import Link from 'next/link'

export default function Home() {
  const [article, setArticle] = useState([])
  // const [articleImg, setArticleImg] = useState([])
  const [rent, setRent] = useState([])
  // const [rentImg, setRentImg] = useState([])
  const [product, setProduct] = useState([])
  // const [productImg, setProductImg] = useState([])


  const responsiveA = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 1, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  }
  const responsiveP = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  }
  // 文章資料用
  const handleArticle = async () => {
    const data = await fetch(`http://localhost:3005/api/baseball/article`).then(
      (res) => res.json()
    )
    if (data.status === 'success') {
      setArticle(data.data)
    }
  }
  // 抓小專文章圖片用
  // const handleArticleImg = async (img) => {
  //   const data = await fetch(
  //     `http://localhost:3005/api/baseball/articleImg/${img}`
  //   )
  //   const blob = await data.blob()
  //   const imageURL = URL.createObjectURL(blob)
  //   return imageURL
  // }
  // const fetchArticleImg = async () => {
  //   const urls = []
  //   for (const i of article) {
  //     const url = await handleArticleImg(i.photo)
  //     urls.push(url)
  //   }
  //   setArticleImg(urls)
  // }
  // 產品資料用
  const handleProduct = async () => {
    const data = await fetch(`http://localhost:3005/api/baseball/product`).then(
      (res) => res.json()
    )
    if (data.status === 'success') {
      setProduct(data.data)
    }
  }
  // 抓小專產品圖片用
  // const handleProductImg = async (img) => {
  //   const data = await fetch(
  //     `http://localhost:3005/api/baseball/productImg/${img}`
  //   )
  //   const blob = await data.blob()
  //   const imageURL = URL.createObjectURL(blob)
  //   return imageURL
  // }
  // const fetchProductImg = async () => {
  //   const urls = []
  //   for (const i of product) {
  //     const url = await handleProductImg(i.image_url)
  //     urls.push(url)
  //   }
  //   setProductImg(urls)
  // }
  // 租借資料用
  const handleRent = async () => {
    const data = await fetch(`http://localhost:3005/api/baseball/rent`).then(
      (res) => res.json()
    )
    if (data.status === 'success') {
      setRent(data.data)
    }
  }
  // 租借抓小專圖片用
  // const handleRentImg = async (filename) => {
  //   const data = await fetch(
  //     `http://localhost:3005/api/baseball/rentImg/assets/img/rent_product_img/${filename}`
  //   )
  //   const blob = await data.blob()
  //   const imageURL = URL.createObjectURL(blob)
  //   return imageURL
  // }
  // const fetchRentImg = async () => {
  //   const urls = []
  //   for (const i of rent) {
  //     const url = await handleRentImg(path.basename(i.image_url))
  //     urls.push(url)
  //   }
  //   setRentImg(urls)
  // }

  useEffect(() => {
    handleArticle(), handleRent(), handleProduct()
  }, [])
  // 抓小專圖片用
  // useEffect(() => {
  //   if (article.length > 0) {
  //     fetchArticleImg()
  //   }
  //   if (rent.length > 0) {
  //     fetchRentImg()
  //   }
  //   if (product.length > 0) {
  //     fetchProductImg()
  //   }
  // }, [article, rent, product])

  // 向下捲動用
  const handleScroll = () => {
    const scrollStep = 1000 // 每次滾動距離
    const scrollInterval = 10 // 滾動間隔時間
    const targetY = 1000 // 目標距離
    let currentY = window.screenY

    const scrollIntervalID = setInterval(() => {
      if (currentY < targetY) {
        window.scrollBy(0, scrollStep)
        currentY += scrollStep
        if (currentY >= targetY) {
          clearInterval(scrollIntervalID)
        }
      } else {
        window.scrollBy(0, -scrollStep)
        currentY -= scrollStep
        if (currentY <= targetY) {
          clearInterval(scrollIntervalID)
        }
      }
    }, scrollInterval)
  }

  return (
    <>
      <video autoPlay loop muted className="mb-5 d-sm-flex d-none">
        <source src="/video/首頁影片.mp4" type="video/mp4" />
      </video>
      <video autoPlay loop muted className="mb-5 d-sm-none">
        <source src="/video/首頁影片m.mp4" />
      </video>
      <button
        onClick={handleScroll}
        className={`${styles.scroll} d-none d-sm-block`}
      >
        <img src="/video/arrow-down.gif" />
      </button>
      <div className={`container ${styles.container}`}>
        <div
          className="article mb-5"
          data-aos="fade-right"
          data-aos-offset="200"
        >
          <h1 className="text-center mb-5">棒球專欄</h1>
          <Carousel
            swipeable={true}
            draggable={true}
            showDots={false}
            responsive={responsiveA}
            ssr={true} // means to render carousel on server-side.
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={2000}
            keyBoardControl={true}
            customTransition="transform 300ms ease-in-out"
            transitionDuration={100}
            containerClass="slide "
            removeArrowOnDeviceType={['tablet', 'mobile']}
            dotListClass="custom-dot-list-style"
            itemClass={`d-flex justify-content-center gd-carousel ${styles.slide}`}
          >
            {article.map((v, i) => {
              return (
                <div
                  key={v.id}
                  className={`text-center ${styles.articleCard} `}
                >
                  <div className={styles.articleImg}>
                    <img src={`/images/article/${v.photo}`} />
                  </div>
                  <div className={styles.articleCardText}>
                    <p className="mt-3 text-primary">{v.subtitle}</p>
                    <h4 className="mb-3">{v.title}</h4>
                    <p
                      className={styles.multilineEllipsis}
                      dangerouslySetInnerHTML={{ __html: v.description }}
                    ></p>
                    <Link href={`http://localhost:3000/article/${v.id}`}>
                      <button className={styles.bt}>閱讀文章</button>
                    </Link>
                  </div>
                </div>
              )
            })}
          </Carousel>
        </div>
        <div
          className={`mb-5 ${styles.course}`}
          data-aos="fade-right"
          data-aos-offset="350"
        >
          <h1 className="text-center mb-5">優質課程</h1>
          <div className="slide d-flex align-items-center justify-content-center flex-sm-row flex-column-reverse">
            <div className={`text-center ${styles.courseCard}`}>
              <h5 className="mb-5">
                無論是小孩還是大人，打擊、守備、投球、私人課程一應俱全。
              </h5>
              <Link href="/course">
                <button className={styles.bt}>點我報名</button>
              </Link>
            </div>
            <div className="imgBox row row-cols-sm-3 mb-5">
              <div className="col  d-flex justify-content-center">
                <div className={styles.courseImg}>
                  <img src="/images/baseball/18.jpg" alt="" />
                </div>
              </div>
              <div className="col  d-flex justify-content-center">
                <div className={styles.courseImg}>
                  <img src="/images/baseball/19.jpg" alt="" />
                </div>
              </div>
              <div className="col  d-flex justify-content-center">
                <div className={styles.courseImg}>
                  <img src="/images/baseball/20.jpg" alt="" />
                </div>
              </div>
              <div className="col  d-flex justify-content-center">
                <div className={styles.courseImg}>
                  <img src="/images/baseball/21.jpg" alt="" />
                </div>
              </div>
              <div className="col d-none d-sm-block  d-sm-flex justify-content-center">
                <div className={styles.courseImg}>
                  <img src="/images/baseball/22.jpg" alt="" />
                </div>
              </div>
              <div className="col d-none d-sm-block  d-sm-flex justify-content-center">
                <div className={styles.courseImg}>
                  <img src="/images/baseball/23.jpg" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`mb-5 ${styles.product}`}
          data-aos="fade-right"
          data-aos-offset="400"
        >
          <h1 className="text-center mb-5">推薦商品</h1>
          <Carousel
            swipeable={true}
            draggable={false}
            showDots={false}
            responsive={responsiveP}
            ssr={true}
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={2000}
            keyBoardControl={true}
            customTransition="transform 300ms ease-in-out"
            transitionDuration={100}
            containerClass="slide "
            removeArrowOnDeviceType={['tablet', 'mobile']}
            dotListClass="custom-dot-list-style"
            itemClass={`d-flex justify-content-center ${styles.slide}`}
          >
            {product.map((v, i) => {
              return (
                <Link href={`/product/${v.id}`} key={v.id}>
                  <div className={styles.productImg}>
                    {/* <img src={productImg[i]} /> */}
                    <img src={`/images/product/${v.image_url}`} />
                    <div className={styles.overlay}></div>
                    <div className={styles.magnify}>
                      <img src="/images/baseball/magnify.png" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </Carousel>
        </div>
        <div className={`mb-5`} data-aos="fade-right" data-aos-offset="500">
          <h1 className="text-center mb-5">器材租借</h1>
          <div className="slide d-flex align-items-center justify-content-center flex-sm-row flex-column">
            <div className="carosol  gap-5 mb-5">
              <Swiper
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={'auto'}
                spaceBetween={100}
                coverflowEffect={{
                  rotate: 0,
                  stretch: 50,
                  depth: 10,
                  modifier: 15,
                }}
                loop={true}
                navigation={{
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev',
                  clickable: true,
                }}
                modules={[Navigation, EffectCoverflow]}
                className="mySwiper text-center mt-5 position-relative"
              >
                {rent.map((v, i) => {
                  return (
                    <SwiperSlide
                      key={i}
                      className={`d-flex justify-content-center`}
                    >
                      <div className={styles.rent}>
                        <img
                          src={`/images/rent/${v.img}`}
                          className={styles.rentImg}
                        />
                      </div>
                    </SwiperSlide>
                  )
                })}
                <div className="slider-controler position-absolute position-relative">
                  <IoIosArrowBack className="swiper-button-prev position-absolute" />
                  <IoIosArrowForward className="swiper-button-next position-absolute" />
                </div>
              </Swiper>
            </div>
            <div className={`text-center ${styles.rentCard}`}>
              <h5>不知道手感合不合嗎?</h5>
              <br />
              <h5 className="mb-5">租借回去使用看看，喜歡在買!</h5>
              <Link href="/rent">
                <button className={styles.bt}>深入了解</button>
              </Link>
            </div>
          </div>
        </div>
        <div className={styles.brand} data-aos-offset="700">
          <h1 className="text-center mb-5">運動品牌</h1>
          <div className="imgBox row row-cols-sm-6  justify-content-center">
            <div
              className="col d-flex justify-content-center"
              data-aos="flip-left"
            >
              <div className={styles.brandImg}>
                <img src="/images/商品logo/adidas.png" alt="Adidas" />
              </div>
            </div>
            <div
              className="col d-flex justify-content-center"
              data-aos="flip-left"
            >
              <div className={styles.brandImg}>
                <img src="/images/商品logo/Asics.svg" alt="Asics" />
              </div>
            </div>
            <div
              className="col d-flex justify-content-center"
              data-aos="flip-left"
            >
              <div className={styles.brandImg}>
                <img src="/images/商品logo/brett.jpg" alt="Brette" />
              </div>
            </div>
            <div
              className="col d-flex justify-content-center"
              data-aos="flip-left"
            >
              <div className={styles.brandImg}>
                <img src="/images/商品logo/Cpbl.png" alt="Cpb" />
              </div>
            </div>
            <div
              className="col d-flex justify-content-center"
              data-aos="flip-left"
            >
              <div className={styles.brandImg}>
                <img src="/images/商品logo/Easton.svg" alt="Easton" />
              </div>
            </div>
            <div
              className="col d-flex justify-content-center"
              data-aos="flip-left"
            >
              <div className={styles.brandImg}>
                <img src="/images/商品logo/louisville.png" alt="louisville" />
              </div>
            </div>
            <div
              className="col d-flex justify-content-center"
              data-aos="flip-right"
            >
              <div className={styles.brandImg}>
                <img src="/images/商品logo/mizuno.svg" alt="mizuno" />
              </div>
            </div>
            <div
              className="col d-flex justify-content-center"
              data-aos="flip-right"
            >
              <div className={styles.brandImg}>
                <img src="/images/商品logo/MLB.png" alt="MLB" />
              </div>
            </div>
            <div
              className="col d-flex justify-content-center"
              data-aos="flip-right"
            >
              <div className={styles.brandImg}>
                <img src="/images/商品logo/slugger.png" alt="slugger" />
              </div>
            </div>
            <div
              className="col d-flex justify-content-center"
              data-aos="flip-right"
            >
              <div className={styles.brandImg}>
                <img src="/images/商品logo/nike.png" alt="nike" />
              </div>
            </div>
            <div
              className="col d-flex justify-content-center"
              data-aos="flip-right"
            >
              <div className={styles.brandImg}>
                <img src="/images/商品logo/ssk.svg" alt="ssk" />
              </div>
            </div>
            <div
              className="col d-flex justify-content-center"
              data-aos="flip-right"
            >
              <div className={styles.brandImg}>
                <img src="/images/商品logo/underarmour.png" alt="underarmour" />
              </div>
            </div>
            <div
              className="col d-flex justify-content-center"
              data-aos="flip-left"
            >
              <div className={styles.brandImg}>
                <img src="/images/商品logo/Wilson.svg" alt="Wilson" />
              </div>
            </div>
            <div
              className="col d-flex justify-content-center"
              data-aos="flip-left"
            >
              <div className={styles.brandImg}>
                <img src="/images/商品logo/zett.svg" alt="zett" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
