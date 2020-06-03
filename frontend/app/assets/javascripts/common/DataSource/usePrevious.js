// NOTE: How to get the previous props or state?
// https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
import { useEffect, useRef } from 'react'

function usePrevious(value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}

export default usePrevious
