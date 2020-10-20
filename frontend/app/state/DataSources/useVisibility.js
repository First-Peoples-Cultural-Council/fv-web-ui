import { useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { updateVisibility as _updateVisibility } from 'providers/redux/reducers/visibility'
import ProviderHelpers from 'common/ProviderHelpers'

function useVisibility() {
  const dispatch = useDispatch()
  const [lastPathOrId, setLastPathOrId] = useState()

  const updateVisibilityToTeam = (
    pathOrId,
    operationParams = { visibility: 'team' },
    messageStart,
    messageSuccess,
    messageError
  ) => {
    const dispatchObj = _updateVisibility(pathOrId, operationParams, messageStart, messageSuccess, messageError)
    dispatch(dispatchObj)
    setLastPathOrId(pathOrId)
  }

  const updateVisibilityToMembers = (
    pathOrId,
    operationParams = { visibility: 'members' },
    messageStart,
    messageSuccess,
    messageError
  ) => {
    const dispatchObj = _updateVisibility(pathOrId, operationParams, messageStart, messageSuccess, messageError)
    dispatch(dispatchObj)
    setLastPathOrId(pathOrId)
  }

  const updateVisibilityToPublic = (
    pathOrId,
    operationParams = { visibility: 'public' },
    messageStart,
    messageSuccess,
    messageError
  ) => {
    const dispatchObj = _updateVisibility(pathOrId, operationParams, messageStart, messageSuccess, messageError)
    dispatch(dispatchObj)
    setLastPathOrId(pathOrId)
  }

  return {
    computeUpdateVisibility: useSelector((state) => state.visibility.computeUpdateVisibility),
    extractComputeUpdateVisibility: useSelector((state) =>
      ProviderHelpers.getEntry(state.visibility.computeUpdateVisibility, lastPathOrId)
    ),
    updateVisibilityToTeam,
    updateVisibilityToMembers,
    updateVisibilityToPublic,
  }
}

export default useVisibility
