import { useDispatch, useSelector } from 'react-redux'
import { fetchWord as _fetchWord, fetchWords as _fetchWords } from 'providers/redux/reducers/fvWord'

function useWord() {
  const dispatch = useDispatch()
  const fetchWord = (pathOrId, messageStart, messageSuccess, messageError, propertiesOverride) => {
    const dispatchObj = _fetchWord(pathOrId, messageStart, messageSuccess, messageError, propertiesOverride)
    dispatch(dispatchObj)
  }
  const fetchWords = (pathOrId, operationParams, message, headers, properties) => {
    const dispatchObj = _fetchWords(pathOrId, operationParams, message, headers, properties)
    dispatch(dispatchObj)
  }
  return {
    computeWord: useSelector((state) => state.fvWord.computeWord),
    computeWords: useSelector((state) => state.fvWord.computeWords),
    fetchWord,
    fetchWords,
  }
}

export default useWord
