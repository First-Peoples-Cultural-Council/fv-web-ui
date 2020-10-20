import { useDispatch, useSelector } from 'react-redux'
import {
  deletePhrase as _deletePhrase,
  fetchPhrase as _fetchPhrase,
  fetchPhrases as _fetchPhrases,
  publishPhrase as _publishPhrase,
} from 'providers/redux/reducers/fvPhrase'

function usePhrase() {
  const dispatch = useDispatch()

  const deletePhrase = (pathOrId, messageStart, messageSuccess, messageError, propertiesOverride) => {
    const dispatchObj = _deletePhrase(pathOrId, messageStart, messageSuccess, messageError, propertiesOverride)
    dispatch(dispatchObj)
  }

  const fetchPhrase = (pathOrId, messageStart, messageSuccess, messageError, propertiesOverride) => {
    const dispatchObj = _fetchPhrase(pathOrId, messageStart, messageSuccess, messageError, propertiesOverride)
    dispatch(dispatchObj)
  }

  const fetchPhrases = (pathOrId, operationParams, message, headers, properties) => {
    const dispatchObj = _fetchPhrases(pathOrId, operationParams, message, headers, properties)
    dispatch(dispatchObj)
  }

  const publishPhrase = (pathOrId, operationParams, messageStart, messageSuccess, messageError, propertiesOverride) => {
    const dispatchObj = _publishPhrase(
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
    computePhrase: useSelector((state) => state.fvPhrase.computePhrase),
    computePhrases: useSelector((state) => state.fvPhrase.computePhrases),
    deletePhrase,
    fetchPhrase,
    fetchPhrases,
    publishPhrase,
  }
}

export default usePhrase
