import { useDispatch, useSelector } from 'react-redux'
import {
  fetchCategories as _fetchCategories,
  fetchSharedCategories as _fetchSharedCategories,
} from 'providers/redux/reducers/fvCategory'
function useCategories() {
  const dispatch = useDispatch()

  const fetchCategories = (path) => {
    const dispatchObj = _fetchCategories(path)
    dispatch(dispatchObj)
  }
  const fetchSharedCategories = (path) => {
    const dispatchObj = _fetchSharedCategories(path)
    dispatch(dispatchObj)
  }
  return {
    computeCategories: useSelector((state) => state.fvCategory.computeCategories),
    computeSharedCategories: useSelector((state) => state.fvCategory.computeSharedCategories),
    fetchCategories,
    fetchSharedCategories,
  }
}
export default useCategories
