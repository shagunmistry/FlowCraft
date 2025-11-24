'use client'
import { createContext, useContext, useState } from 'react'
import LoadingOverlay from './LoadingOverlay'

const LoadingContext = createContext({
  showLoading: (text: string = 'Loading', color: string = 'red') => { },
  hideLoading: () => { },
})

export const useLoading = () => useContext(LoadingContext)

export const LoadingProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [loading, setLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('Loading')
  const [loadingColor, setLoadingColor] = useState<any>('red')

  const showLoading = (text = 'Loading', color = 'red') => {
    setLoadingText(text)
    setLoadingColor(color)
    setLoading(true)
  }

  const hideLoading = () => {
    setLoading(false)
  }

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading }}>
      {children}
      <LoadingOverlay
        isLoading={loading}
        text={loadingText}
        color={loadingColor}
        fullScreen={true}
        zIndex={100}
      />
    </LoadingContext.Provider>
  )
}
