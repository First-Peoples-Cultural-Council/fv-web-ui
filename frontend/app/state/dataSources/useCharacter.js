import { useDispatch, useSelector } from 'react-redux'
import { fetchCharacter as _fetchCharacter, publishCharacter as _publishCharacter } from 'reducers/fvCharacter'

function useCharacter() {
  const dispatch = useDispatch()

  const fetchCharacter = (pathOrId, messageStart, messageSuccess, messageError, propertiesOverride) => {
    const dispatchObj = _fetchCharacter(pathOrId, messageStart, messageSuccess, messageError, propertiesOverride)
    dispatch(dispatchObj)
  }

  const publishCharacter = (
    pathOrId,
    operationParams,
    messageStart,
    messageSuccess,
    messageError,
    propertiesOverride
  ) => {
    const dispatchObj = _publishCharacter(
      pathOrId,
      operationParams,
      messageStart,
      messageSuccess,
      messageError,
      propertiesOverride
    )
    dispatch(dispatchObj)
  }

  return {
    computeCharacter: useSelector(({ fvCharacter }) => fvCharacter.computeCharacter),
    fetchCharacter,
    publishCharacter,
  }
}

export default useCharacter
