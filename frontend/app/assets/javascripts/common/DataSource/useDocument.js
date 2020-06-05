import { useSelector } from 'react-redux'

function useDocument() {
  return {
    computeDocument: useSelector((state) => state.document.computeDocument),
  }
}

export default useDocument
