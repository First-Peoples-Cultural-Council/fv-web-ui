import { useDispatch, useSelector } from 'react-redux'
import { fetchCategories as _fetchCategories } from 'providers/redux/reducers/fvCategory'
function useCategories() {
  const dispatch = useDispatch()
  const fetchCategories = (path) => {
    const dispatchObj = _fetchCategories(path)
    dispatch(dispatchObj)
  }
  return {
    computeCategories: useSelector((state) => state.fvCategory.computeCategories),
    fetchCategories,
  }
}
export default useCategories
