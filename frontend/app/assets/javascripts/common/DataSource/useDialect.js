import { useSelector } from 'react-redux'

function useDialect() {
  return {
    computeDialect2: useSelector((state) => state.fvDialect.computeDialect2),
  }
}

export default useDialect
