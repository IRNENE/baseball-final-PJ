import React, { useEffect } from 'react'
import Nav from '@/components/nav/nav'
import Footer from '@/components/footer/footer'
import { useLoader } from '@/hooks/use-loader'
import styles from '@/components/nav/nav.module.css'
import { useRouter } from 'next/router'
import SupportChat from '../supportchat'
import { useAuth, initUserData } from '@/hooks/use-auth'

export default function Layout({ children }) {
  const { auth, setAuth } = useAuth()
  const { isAuth, userData } = auth
  const router = useRouter()
  const { show, setShow } = useLoader()
  useEffect(() => {
    const handleChangeStart = () => {
      setShow(true)
    }

    const handleChangeEnd = () => {
      setShow(false)
    }
    router.events.on('routeChangeStart', handleChangeStart)
    router.events.on('routeChangeComplete', handleChangeEnd)
    router.events.on('routeChangeError', handleChangeEnd)
    return () => {
      router.events.off('routeChangeStart', handleChangeStart)
      router.events.off('routeChangeComplete', handleChangeEnd)
      router.events.off('routeChangeError', handleChangeEnd)
    }
  }, [setShow])

  return (
    <div className="position-relative layoutAll">
      <Nav />
      <div className={`layoutWrap ${styles['layout-m']}`}>{children}</div>
      <Footer />
      {isAuth && userData.google_uid !== '112525581598621432124' ? (
        <SupportChat />
      ) : (
        ''
      )}
    </div>
  )
}
