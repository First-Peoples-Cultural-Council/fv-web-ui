import { useDispatch, useSelector } from 'react-redux'
import { fetchPhrases as _fetchPhrases } from 'providers/redux/reducers/fvPhrase'
function usePhrases() {
  const dispatch = useDispatch()
  const fetchPhrases = (pathOrId, nql) => {
    const dispatchObj = _fetchPhrases(pathOrId, nql)
    dispatch(dispatchObj)
  }
  return {
    computePhrases: useSelector((state) => state.fvPhrase.computePhrases),
    fetchPhrases,
  }
}
export default usePhrases
