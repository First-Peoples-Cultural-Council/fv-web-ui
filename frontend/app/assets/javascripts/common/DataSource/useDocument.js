import { useDispatch, useSelector } from 'react-redux'
import { fetchDocument as _fetchDocument } from 'providers/redux/reducers/document'

function useDocument() {
  const dispatch = useDispatch()

  const fetchDocument = () => {
    const dispatchObj = _fetchDocument()
    dispatch(dispatchObj)
  }

  return {
    computeDocument: useSelector((state) => state.document.computeDocument),
    fetchDocument,
  }
}

export default useDocument
