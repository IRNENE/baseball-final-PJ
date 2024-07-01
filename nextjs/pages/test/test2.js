import React, { useRef, useState } from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'
// import 'swiper/css/navigation'

// import required modules
import { Navigation, EffectCoverflow } from 'swiper/modules'

export default function App() {
  return (
    <>
      <div className="container text-center">
        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          spaceBetween={100}
          coverflowEffect={{
            rotate: 0,
            stretch: 50,
            depth: 30,
            modifier: 30,
          }}
          loop={true}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
            clickable: true,
          }}
          modules={[Navigation, EffectCoverflow]}
          className="mySwiper mt-5"
        >
          <SwiperSlide>
            <img src="/images/baseball/4.jpg" style={{}} />
          </SwiperSlide>
          <SwiperSlide>
            <img src="/images/baseball/4.jpg" style={{}} />
          </SwiperSlide>
          <SwiperSlide>
            <img src="/images/baseball/4.jpg" style={{}} />
          </SwiperSlide>
          <SwiperSlide>
            <img src="/images/baseball/4.jpg" style={{}} />
          </SwiperSlide>
          <SwiperSlide>
            <img src="/images/baseball/4.jpg" style={{}} />
          </SwiperSlide>
          <SwiperSlide>
            <img src="/images/baseball/4.jpg" style={{}} />
          </SwiperSlide>
          <SwiperSlide>
            <img src="/images/baseball/4.jpg" style={{}} />
          </SwiperSlide>
          <SwiperSlide>
            <img src="/images/baseball/4.jpg" style={{}} />
          </SwiperSlide>
          <SwiperSlide>
            <img src="/images/baseball/4.jpg" style={{}} />
          </SwiperSlide>

          <div className="slider-controler">
            <IoIosArrowBack className="swiper-button-prev" />
            <IoIosArrowForward className="swiper-button-next" />
          </div>
        </Swiper>
      </div>
    </>
  )
}
