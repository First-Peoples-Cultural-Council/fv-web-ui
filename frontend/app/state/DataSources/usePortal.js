import { useDispatch, useSelector } from 'react-redux'
import { fetchPortal as _fetchPortal } from 'reducers/fvPortal'

function usePortal() {
  const dispatch = useDispatch()

  const fetchPortal = (pathOrId, messageStart, messageSuccess, messageError, propertiesOverride) => {
    const dispatchObj = _fetchPortal(pathOrId, messageStart, messageSuccess, messageError, propertiesOverride)
    dispatch(dispatchObj)
  }

  return {
    computePortal: useSelector((state) => state.fvPortal.computePortal),
    fetchPortal,
  }
}

export default usePortal
