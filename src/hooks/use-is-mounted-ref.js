import { useRef, useEffect } from "react"

export default function () {
  const isMounted = useRef(true)

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  return isMounted
}
