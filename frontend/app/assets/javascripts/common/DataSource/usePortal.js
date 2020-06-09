import { useDispatch, useSelector } from 'react-redux'
import { fetchPortal as _fetchPortal } from 'providers/redux/reducers/fvPortal'
function usePortal() {
  const dispatch = useDispatch()
  const fetchPortal = (path) => {
    const dispatchObj = _fetchPortal(path)
    dispatch(dispatchObj)
  }
  return {
    computePortal: useSelector((state) => state.fvPortal.computePortal),
    fetchPortal,
  }
}
export default usePortal
