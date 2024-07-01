import Lottie from 'lottie-react'
import bbAnimation from '@/assets/loader.json'

export function BbLoader({ show = false }) {
  return (
    <div
      className={`bb-loader-bg ${show ? '' : 'bb-loader-hide'}`}
      show={show.toString()}
    >
      <Lottie
        className={`bb-loader ${show ? '' : 'bb=loader-hide'}`}
        animationData={bbAnimation}
      />
    </div>
  )
}
