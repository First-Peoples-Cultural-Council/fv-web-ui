import { useDispatch, useSelector } from 'react-redux'
import { updateVisibility as _updateVisibility } from 'providers/redux/reducers/visibility'

function useVisibility() {
  const dispatch = useDispatch()

  const updateVisibilityToTeam = (
    pathOrId,
    operationParams = { visibility: 'team' },
    messageStart,
    messageSuccess,
    messageError
  ) => {
    const dispatchObj = _updateVisibility(pathOrId, operationParams, messageStart, messageSuccess, messageError)
    dispatch(dispatchObj)
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
  }

  return {
    computeUpdateVisibility: useSelector((state) => state.visibility.computeUpdateVisibility),
    updateVisibilityToTeam,
    updateVisibilityToMembers,
    updateVisibilityToPublic,
  }
}

export default useVisibility
