import { useDispatch, useSelector } from 'react-redux'
import { fetchDocument as _fetchDocument } from 'providers/redux/reducers/document'
import { fetch } from 'providers/redux/reducers/rest'
function useDocument() {
  const dispatch = useDispatch()

  const fetchDocument = (pathOrId, operationParams, message, headers, properties) => {
    const dispatchObj = _fetchDocument(pathOrId, operationParams, message, headers, properties)
    dispatch(dispatchObj)
  }

  const fetchDocumentSingleArg = ({ pathOrId, operationParams, message, headers, properties }) => {
    const headersDefault = { 'enrichers.document': 'ancestry,permissions,acls' }
    const customFetch = fetch('FV_DOCUMENT', 'Document', {
      headers: { ...headersDefault, ...headers },
    })
    const dispatchObj = customFetch(pathOrId, operationParams, message, headers, properties)
    dispatch(dispatchObj)
  }

  return {
    computeDocument: useSelector((state) => state.document.computeDocument),
    fetchDocument,
    fetchDocumentSingleArg,
  }
}

export default useDocument
