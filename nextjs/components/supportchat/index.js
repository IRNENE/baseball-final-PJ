import React, { useEffect, useState } from 'react'
import styles from './support.module.css'
import { useAuth, initUserData } from '@/hooks/use-auth'
import axios from 'axios'
import ChatEngine from './chatengine'

export default function SupportChat() {
  const { auth, setAuth } = useAuth()
  const { isAuth, userData } = auth
  // const [uid, setUid] = useState('')
  const [user, setUser] = useState(null)
  const [chat, setChat] = useState(null)
  const [visi, setVisi] = useState(false)
  const [support, setSupport] = useState(false)
  // useEffect(() => {
  //   if (isAuth) {
  //     if (userData.google_uid) {
  //       const id = userData.google_uid.toString()
  //       setUid(id)
  //     } else {
  //       const id = userData.id.toString()
  //       setUid(id)
  //     }
  //   }
  // }, [isAuth, userData])
  const [chatBox, setChatBox] = useState(false)

  const getOrCreatUser = async (uid, callback) => {
    await axios
      .put(
        'https://api.chatengine.io/users/',
        {
          username: uid,
          secret: uid,
        },
        { headers: { 'PRIVATE-KEY': '5220bea3-7125-4b2d-88a5-5bd066adada5' } }
      )
      .then((r) => callback(r.data))
  }
  const getOrCreatChat = async (uid, callback) => {
    const chatRoomName = `${uid}-baseball`
    await axios
      .put(
        'https://api.chatengine.io/chats/',
        {
          usernames: ['Baseball_Support', uid],
          is_direct_chat: true,
          title: chatRoomName,
        },
        { headers: { 'Private-Key': '5220bea3-7125-4b2d-88a5-5bd066adada5' } }
      )
      .then((r) => callback(r.data))
  }
  const handleClick = () => {
    const uid = userData.google_uid
      ? userData.google_uid.toString()
      : userData.id.toString()
    setChatBox(!chatBox)
    if (!chatBox) {
      getOrCreatUser(uid, (user) => {
        setUser(user)
        getOrCreatChat(uid, (chat) => {
          setChat(chat)
          setVisi(!visi)
        })
      })
    }
  }
  const handleSupport = () => {
    setSupport(true)
  }
  const handleSupportNo = () => {
    setSupport(false)
  }
  // console.log(user)
  // console.log(chat)
  return (
    <>
      <button
        className={`${styles.btNone}`}
        onClick={handleClick}
        onMouseEnter={handleSupport}
        onMouseLeave={handleSupportNo}
      >
        <div className={`${styles.avatar}`}>
          <img src="/images/logo.png" />
        </div>
      </button>
      {support && <h6 className={`${styles.support}`}>線上客服</h6>}
      {chatBox && (
        <div className={`${styles.chatbox}`}>
          {/* <h4 className="text-center mt-1">歡迎使用線上客服</h4> */}
          {chat ? <ChatEngine chat={chat} user={user} /> : ''}
        </div>
      )}
    </>
  )
}
