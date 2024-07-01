import { useRouter } from 'next/router'
import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export const initUserData = {
  id: 0,
  account: '',
  name: '',
  photo: '',
  google_uid: '',
  line_uid: '',
}

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuth: false,
    userData: initUserData,
  })

  const router = useRouter()
  const loginRoute = '/member/login'
  const forget = '/member/forget'
  const forgetP = '/member/forget-password'
  const homeRoute = '/'
  // 未登入無法訪問的路由
  const protectRoute = [
    '/member/profile',
    '/member/wishlist',
    '/member/reset-password',
    '/member/order-history',
    '/member/coupon',
    '/member/myjoin',
    '/cart',
  ]

  const handleCheck = async () => {
    const res = await fetch('http://localhost:3005/api/member/check', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      // 允許攜帶cookie
      credentials: 'include',
    })
    const data = await res.json()
    if (data.status === 'success') {
      const dbUser = data.data
      const userData = { ...initUserData }

      for (const key in userData) {
        if (Object.hasOwn(dbUser, key)) {
          userData[key] = dbUser[key] || ''
        }
      }
      setAuth({
        isAuth: true,
        userData,
      })
      // 登入成功後，無法進入登入頁面
      if (
        router.pathname === loginRoute ||
        router.pathname === forget ||
        router.pathname === forgetP
      ) {
        router.push(homeRoute)
      }
    } else {
      console.log(res.data)
      // 未登入，導向至登入頁面
      if (protectRoute.includes(router.pathname)) {
        router.push(loginRoute)
      }
    }
  }

  useEffect(() => {
    if (router.isReady && !auth.isAuth) {
      handleCheck()
    }
  }, [router.isReady, router.pathname])

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
