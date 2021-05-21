import { useDispatch, useSelector } from 'react-redux'
import {
  fetchUserDialects as _fetchUserDialects,
  selfregisterUser as _selfregisterUser,
  requestJoin as _requestJoin,
} from 'reducers/fvUser'
function useUser() {
  const dispatch = useDispatch()
  return {
    computeRequestJoin: useSelector((state) => state.fvUser.computeRequestJoin),
    requestJoin: ({ siteId, interestReason, communityMember, languageTeam, comment }) => {
      const dispatchObj = _requestJoin({ siteId, interestReason, communityMember, languageTeam, comment })
      dispatch(dispatchObj)
    },
    computeUserDialects: useSelector((state) => state.fvUser.computeUserDialects),
    fetchUserDialects: (pathOrId, operationParams, messageStart, messageSuccess, messageError) => {
      const dispatchObj = _fetchUserDialects(pathOrId, operationParams, messageStart, messageSuccess, messageError)
      dispatch(dispatchObj)
    },
    computeUserSelfregister: useSelector((state) => state.fvUser.computeUserDialects),
    selfregisterUser: (pathOrId, operationParams, messageStart, messageSuccess, messageError) => {
      const dispatchObj = _selfregisterUser(pathOrId, operationParams, messageStart, messageSuccess, messageError)
      dispatch(dispatchObj)
    },
  }
}

export default useUser
