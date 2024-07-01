import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import { useEffect, useState } from 'react'

export default function Teacher() {
  const [teachers, setTeachers] = useState([])

  useEffect(() => {
    let isMounted = true // Track whether the component is still mounted

    fetch('http://localhost:3005/api/teacher')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => {
        if (isMounted) {
          setTeachers(data)
        }
      })
      .catch((error) => {
        console.error('Error fetching teachers:', error)
        // Optionally, inform the user about the error
      })

    // Cleanup function
    return () => {
      isMounted = false
    }
  }, [])

  const responsiveA = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  }

  return (
    <div className="teacherTop ">
      <div className="teacher-nav-img-card-sun">
        <div className="teacher-nav-img-card-text-sun">
          <h1 className="mb-5">教練陣容</h1>
          <h4 className="pt-2 pb-2">
            棒球場上沒有速成的訓練方式，只有適合自己的訓練方式
          </h4>
        </div>
      </div>
      <div className="container ">
        <div className="teacher-title-text-sun">
          <h5>教練列表</h5>
        </div>
        <div className="teacher-card-sun mb-5">
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
            itemClass={`d-flex justify-content-center gd-carousel  teacher-Carousel-sun`}
          >
            {teachers.map((teacher) => (
              <div key={teacher.id} className="teacher-card-sun">
                <div className="teacher-card-img-sun">
                  <img
                    src={`/images/teacher/${teacher.photo}`}
                    alt={teacher.name}
                  />
                </div>
                <div className="teacher-card-text-sun ps-3">
                  <h4 className="pt-5 ">{teacher.name}</h4>
                  <h5>資歷</h5>
                  <h5
                    className="teacher-card-text-description-sun"
                    dangerouslySetInnerHTML={{ __html: teacher.description }}
                  />
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  )
}
