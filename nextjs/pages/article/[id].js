import { useState, useEffect } from 'react'
import styles from '@/styles/article/article.module.css'
import { useRouter } from 'next/router'
import { useLoader } from '@/hooks/use-loader'
import Link from 'next/link'

export default function Article() {
  const router = useRouter()
  const { id } = router.query
  // console.log(id)
  const [articleData, setArticleData] = useState('')
  const [articleImg, setArticleImg] = useState([])
  // fetch API時，顯示等待動畫用
  const { show, setShow } = useLoader()

  const handeleFetch = async () => {
    const data = await fetch(
      `http://localhost:3005/api/article/detail/${id}`
    ).then((res) => res.json())
    if (data.status === 'success') {
      setArticleData(data.data)
    }
  }
  // console.log(articleData)
  useEffect(() => {
    setShow(true)
    setTimeout(() => {
      setShow(false)
    }, 1000)
    if (router.isReady) {
      handeleFetch(id)
    }
  }, [router.isReady, id])

  // 存放詳細文章頁下方隨機4筆資料
  const [otherArticle, setOtherArticle] = useState([])
  const getOtherArticle = async () => {
    const res = await fetch(`http://localhost:3005/api/article/otherArticle`)
    const data = await res.json()
    if (data.status === 'success') {
      const articlesWithImg = await Promise.all(
        data.data.map(async (article) => {
          const url = await handleArticleImg(article.photo)
          return { ...article, photoUrl: url }
        })
      )
      setOtherArticle(articlesWithImg)
    }
  }
  // console.log(otherArticle)

  const [otherArticleImg, setOtherArticleImg] = useState([])

  // 獲取圖片用
  const handleArticleImg = async (img) => {
    const data = await fetch(
      `http://localhost:3005/api/baseball/articleImg/${img}`
    )
    const blob = await data.blob()
    const imageURL = URL.createObjectURL(blob)
    return imageURL
  }
  const fetchArticleImg = async () => {
    const url = await handleArticleImg(articleData.photo)
    setArticleImg(url)
  }
  useEffect(() => {
    getOtherArticle()
    fetchArticleImg()
  }, [articleData])

  return (
    <>
      <div className={`container ${styles.bodyMT}`}>
        <div className={`row text-center`}>
          <h4 className="text-primary mb-3">
            {articleData ? articleData.subtitle : ''}
          </h4>
          <h3 className="mb-4">{articleData ? articleData.title : ''}</h3>
          <p className="mb-4 text-info">
            {articleData ? articleData.created_at : ''}
          </p>
          <div className={`mb-4 ${styles.articleImg}`}>
            <img src={articleImg} alt="" />
          </div>
          {/* 以下設定渲染html標籤 */}
          <div
            className={`${styles.articleText}`}
            dangerouslySetInnerHTML={{
              __html: articleData ? articleData.description : '',
            }}
          />
        </div>

        <h2 className="text-center my-4 text-info">相關文章</h2>

        <div className={`row`}>
          {otherArticle.map((v, i) => {
            return (
              <>
                <div className={`col-6 col-md-3 ${styles.otherArticle}`}>
                  <Link key={v.id} href={`/article/${v.id}`}>
                    <div className="m-100 mb-2">
                      <img src={v.photoUrl} alt="" />
                    </div>

                    <h6 className="text-primary mb-2">{v.subtitle}</h6>
                    <h6 className={styles.title}>{v.title}</h6>
                  </Link>
                </div>
              </>
            )
          })}
        </div>
      </div>
    </>
  )
}
