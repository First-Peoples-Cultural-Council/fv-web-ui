import { useDispatch, useSelector } from 'react-redux'
import { searchDocuments as _searchDocuments } from 'reducers/search'

function useSearch() {
  const dispatch = useDispatch()

  const searchDocuments = (pathOrId, operationParams, message, headers, properties) => {
    const dispatchObj = _searchDocuments(pathOrId, operationParams, message, headers, properties)
    dispatch(dispatchObj)
  }
  return {
    searchParams: useSelector((state) => state.navigation.route.search),
    computeSearchDocuments: useSelector((state) => state.search.computeSearchDocuments),
    searchDocuments,
  }
}
export default useSearch
