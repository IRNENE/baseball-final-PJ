import { useState, useContext, createContext } from 'react'
import { BbLoader } from './component'

const LoaderContext = createContext({
  show: false,
  setShow: () => {},
})

export const LoaderProvider = ({ children, CustomLoader = BbLoader }) => {
  const [show, setShow] = useState(false)

  return (
    <LoaderContext.Provider
      value={{
        show,
        setShow,
      }}
    >
      <BbLoader show={show} />
      {children}
    </LoaderContext.Provider>
  )
}

export const useLoader = () => {
  const context = useContext(LoaderContext)

  if (!context) {
    throw new Error('useLoader must be used within LoadingProvider')
  }

  return context
}
