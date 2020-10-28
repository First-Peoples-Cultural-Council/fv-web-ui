import { useDispatch, useSelector } from 'react-redux'
import { fetchUserDialects as _fetchUserDialects } from 'reducers/fvUser'
function useUser() {
  const dispatch = useDispatch()
  return {
    computeUserDialects: useSelector((state) => state.fvUser.computeUserDialects),
    fetchUserDialects: (pathOrId, operationParams, messageStart, messageSuccess, messageError) => {
      const dispatchObj = _fetchUserDialects(pathOrId, operationParams, messageStart, messageSuccess, messageError)
      dispatch(dispatchObj)
    },
  }
}

export default useUser
