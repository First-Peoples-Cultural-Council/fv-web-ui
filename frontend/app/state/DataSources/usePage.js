import { useDispatch, useSelector } from 'react-redux'
import { queryPage as _queryPage } from 'providers/redux/reducers/fvPage'
function usePage() {
  const dispatch = useDispatch()
  const queryPage = (pathOrId, queryAppend, messageStart, messageSuccess, messageError) => {
    const dispatchObj = _queryPage(pathOrId, queryAppend, messageStart, messageSuccess, messageError)
    dispatch(dispatchObj)
  }
  return {
    computePage: useSelector((state) => state.fvPage.computePage),
    queryPage,
  }
}
export default usePage
