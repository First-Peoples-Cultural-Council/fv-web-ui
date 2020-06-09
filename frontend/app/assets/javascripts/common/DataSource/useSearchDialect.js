import { useDispatch, useSelector } from 'react-redux'
import { searchDialectReset as _searchDialectReset } from 'providers/redux/reducers/searchDialect'
function usePortal() {
  const dispatch = useDispatch()
  const searchDialectReset = () => {
    const dispatchObj = _searchDialectReset()
    dispatch(dispatchObj)
  }
  return {
    computeSearchDialect: useSelector((state) => state.searchDialect.computeSearchDialect),
    searchDialectReset,
  }
}
export default usePortal
