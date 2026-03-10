import { useCallback } from 'react'

const useButton = (handler?: () => void) => {
  const onClick = useCallback(() => {
    if (handler) {
      handler()
    }
  }, [handler])

  return { onClick }
}

export default useButton
