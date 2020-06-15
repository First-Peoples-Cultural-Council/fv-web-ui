import { useDispatch, useSelector } from 'react-redux'
import { fetchDocument as _fetchDocument } from 'providers/redux/reducers/document'

function useDocument() {
  const dispatch = useDispatch()

  const fetchDocument = (pathOrId, operationParams, message, headers, properties) => {
    const dispatchObj = _fetchDocument(pathOrId, operationParams, message, headers, properties)
    dispatch(dispatchObj)
  }

  return {
    computeDocument: useSelector((state) => state.document.computeDocument),
    fetchDocument,
  }
}

export default useDocument
