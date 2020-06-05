import { useDispatch, useSelector } from 'react-redux'
import { fetchWord as _fetchWord, fetchWords as _fetchWords } from 'providers/redux/reducers/fvWord'

function useWord() {
  const dispatch = useDispatch()
  const fetchWord = () => {
    const dispatchObj = _fetchWord()
    dispatch(dispatchObj)
  }
  const fetchWords = (searchObj) => {
    const dispatchObj = _fetchWords(searchObj)
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
