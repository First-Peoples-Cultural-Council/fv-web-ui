import { useDispatch, useSelector } from 'react-redux'
import { fetchCharacters as _fetchCharacters } from 'reducers/fvCharacter'
function useCharacters() {
  const dispatch = useDispatch()

  const fetchCharacters = (pathOrId, operationParams, message, headers, properties) => {
    const dispatchObj = _fetchCharacters(pathOrId, operationParams, message, headers, properties)
    dispatch(dispatchObj)
  }

  return {
    computeCharacters: useSelector((state) => state.fvCharacter.computeCharacters),
    fetchCharacters,
  }
}

export default useCharacters
