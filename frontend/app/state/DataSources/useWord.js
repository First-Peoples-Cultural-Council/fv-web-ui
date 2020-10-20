import { useDispatch, useSelector } from 'react-redux'
import {
  deleteWord as _deleteWord,
  fetchWord as _fetchWord,
  fetchWords as _fetchWords,
  publishWord as _publishWord,
} from 'reducers/fvWord'

function useWord() {
  const dispatch = useDispatch()

  const deleteWord = (pathOrId, messageStart, messageSuccess, messageError, propertiesOverride) => {
    const dispatchObj = _deleteWord(pathOrId, messageStart, messageSuccess, messageError, propertiesOverride)
    dispatch(dispatchObj)
  }

  const fetchWord = (pathOrId, messageStart, messageSuccess, messageError, propertiesOverride) => {
    const dispatchObj = _fetchWord(pathOrId, messageStart, messageSuccess, messageError, propertiesOverride)
    dispatch(dispatchObj)
  }

  const fetchWords = (pathOrId, operationParams, message, headers, properties) => {
    const dispatchObj = _fetchWords(pathOrId, operationParams, message, headers, properties)
    dispatch(dispatchObj)
  }

  const publishWord = (pathOrId, operationParams, messageStart, messageSuccess, messageError, propertiesOverride) => {
    const dispatchObj = _publishWord(
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
    computeWord: useSelector((state) => state.fvWord.computeWord),
    computeWords: useSelector((state) => state.fvWord.computeWords),
    deleteWord,
    fetchWord,
    fetchWords,
    publishWord,
  }
}

export default useWord
