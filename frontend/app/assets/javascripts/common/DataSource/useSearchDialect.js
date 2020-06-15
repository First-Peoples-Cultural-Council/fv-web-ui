import { useDispatch, useSelector } from 'react-redux'
import {
  searchDialectReset as _searchDialectReset,
  searchDialectUpdate as _searchDialectUpdate,
} from 'providers/redux/reducers/searchDialect'

function useSearchDialect() {
  const dispatch = useDispatch()

  const searchDialectReset = () => {
    const dispatchObj = _searchDialectReset()
    dispatch(dispatchObj)
  }
  const searchDialectUpdate = (searchObj) => {
    const dispatchObj = _searchDialectUpdate(searchObj)
    dispatch(dispatchObj)
  }
  return {
    computeSearchDialect: useSelector((state) => state.searchDialect.computeSearchDialect),
    searchDialectReset,
    searchDialectUpdate,
  }
}

export default useSearchDialect
