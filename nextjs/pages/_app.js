import { LoaderProvider } from '@/hooks/use-loader'
import { BbLoader } from '@/hooks/use-loader/component'
import Layout from '@/components/layout/layout'
import { AuthProvider } from '@/hooks/use-auth'
import { useEffect } from 'react'
import '../styles/global.css'
import '@/scss/all.css'
import '@/styles/carosel.css'
import '@/styles/loader.css'
import Nav from '@/components/nav/nav'
import Footer from '@/components/footer/footer'
import '@/pages/react-datepicker.css'
import '@/pages/course/course-Product.css'
import '@/pages/teacher/teacher.css'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // 要document物件出現後才能導入 bootstrap的js函式庫
    import('@/node_modules/bootstrap/dist/js/bootstrap')
  }, [])
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>)
  return (
    <>
      <AuthProvider>
        <LoaderProvider CustomLoader={BbLoader}>
          {getLayout(<Component {...pageProps} />)}
        </LoaderProvider>
      </AuthProvider>
    </>
  )
}

export default MyApp
