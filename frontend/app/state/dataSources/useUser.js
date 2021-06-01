import { useDispatch, useSelector } from 'react-redux'
import {
  fetchUserDialects as _fetchUserDialects,
  selfregisterUser as _selfregisterUser,
  requestMembership as _requestMembership,
  getMembershipStatus as _getMembershipStatus,
  getJoinRequest as _getJoinRequest,
  getJoinRequests as _getJoinRequests,
  postJoinRequest as _postJoinRequest,
} from 'reducers/fvUser'
function useUser() {
  const dispatch = useDispatch()
  return {
    computeJoinRequest: useSelector((state) => state.fvUser.computeJoinRequest),
    computeJoinRequests: useSelector((state) => state.fvUser.computeJoinRequests),
    computeMembershipFetch: useSelector((state) => state.fvUser.computeMembershipFetch),
    computeMembershipCreate: useSelector((state) => state.fvUser.computeMembershipCreate),
    computeUserDialects: useSelector((state) => state.fvUser.computeUserDialects),
    computeUserSelfregister: useSelector((state) => state.fvUser.computeUserSelfregister),
    getJoinRequest: ({ siteId, requestId }) => {
      const dispatchObj = _getJoinRequest({ siteId, requestId })
      dispatch(dispatchObj)
    },
    getJoinRequests: ({ siteId }) => {
      const dispatchObj = _getJoinRequests({ siteId })
      dispatch(dispatchObj)
    },
    postJoinRequest: ({ siteId, requestId, newStatus, messageToUser }) => {
      const dispatchObj = _postJoinRequest({ siteId, requestId, newStatus, messageToUser })
      dispatch(dispatchObj)
    },
    getMembershipStatus: ({ siteId }) => {
      const dispatchObj = _getMembershipStatus({ siteId })
      dispatch(dispatchObj)
    },
    requestMembership: ({ siteId, interestReason, communityMember, languageTeam, comment }) => {
      const dispatchObj = _requestMembership({ siteId, interestReason, communityMember, languageTeam, comment })
      dispatch(dispatchObj)
    },
    fetchUserDialects: (pathOrId, operationParams, messageStart, messageSuccess, messageError) => {
      const dispatchObj = _fetchUserDialects(pathOrId, operationParams, messageStart, messageSuccess, messageError)
      dispatch(dispatchObj)
    },
    selfregisterUser: (pathOrId, operationParams, messageStart, messageSuccess, messageError) => {
      const dispatchObj = _selfregisterUser(pathOrId, operationParams, messageStart, messageSuccess, messageError)
      dispatch(dispatchObj)
    },
  }
}

export default useUser
