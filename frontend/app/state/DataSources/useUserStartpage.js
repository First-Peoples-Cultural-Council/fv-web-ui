import { useDispatch, useSelector } from 'react-redux'
import { fetchUserStartpage as _fetchUserStartpage } from 'reducers/fvUser'
function useUserStartpage() {
  const dispatch = useDispatch()
  const fetchUserStartpage = (pathOrId, operationParams, messageStart, messageSuccess, messageError) => {
    const dispatchObj = _fetchUserStartpage(pathOrId, operationParams, messageStart, messageSuccess, messageError)
    dispatch(dispatchObj)
  }
  return {
    computeUserStartpage: useSelector((state) => state.fvUser.computeUserStartpage),
    fetchUserStartpage,
  }
}
export default useUserStartpage
