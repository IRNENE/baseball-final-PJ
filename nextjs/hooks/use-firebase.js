import { initializeApp } from 'firebase/app'
import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  
} from 'firebase/auth'
import { useEffect } from 'react'

import { firebaseConfig } from './firebase-config'

const initApp = (callback) => {
  const auth = getAuth()
  signInWithPopup(auth,new GoogleAuthProvider())
    .then((result) => {
      if (result) {
        const credential = GoogleAuthProvider.credentialFromResult(result)
        const token = credential.accessToken

        const user = result.user
        // console.log(token)
        // console.log(user)
      }
    })
    .catch((error) => {
      console.log(error)
    })

  onAuthStateChanged(auth, (user) => {
    if (user) {
      //   console.log('user', user)
      callback(user.providerData[0])
    }
  })
}

const logoutFirebase = () => {
  const auth = getAuth()

  signOut(auth)
    .then(function () {
      // Sign-out successful.
      console.log('Sign-out successful.')
      // window.location.assign('https://accounts.google.com/logout')
    })
    .catch(function (error) {
      // An error happened.
      console.log(error)
    })
}

const loginGoogle = async (callback) => {
  const provider = new GoogleAuthProvider()
  const auth = getAuth()

  signInWithPopup(auth, provider)
    .then(async (result) => {
      const user = result.user
      //   console.log(user)

      callback(user.providerData[0])
    })
    .catch((error) => {
      console.log(error)
    })
}

const loginGoogleRedirect = async (callback) => {
  const provider = new GoogleAuthProvider()
  const auth = getAuth()

  signInWithRedirect(auth, provider)
}

export default function useFirebase() {
  useEffect(() => {
    initializeApp(firebaseConfig)
  }, [])

  return {
    initApp,
    loginGoogleRedirect,
    loginGoogle,
    logoutFirebase,
  }
}
