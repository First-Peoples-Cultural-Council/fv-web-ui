import { useDispatch, useSelector } from 'react-redux'
import { fetchPortal as _fetchPortal, fetchPortals as _fetchPortals } from 'reducers/fvPortal'

function usePortal() {
  const dispatch = useDispatch()

  const fetchPortal = (pathOrId, messageStart, messageSuccess, messageError, propertiesOverride) => {
    const dispatchObj = _fetchPortal(pathOrId, messageStart, messageSuccess, messageError, propertiesOverride)
    dispatch(dispatchObj)
  }

  const fetchPortals = (pathOrId, messageStart, messageSuccess, messageError, propertiesOverride) => {
    const dispatchObj = _fetchPortals(pathOrId, messageStart, messageSuccess, messageError, propertiesOverride)
    dispatch(dispatchObj)
  }

  return {
    computePortal: useSelector((state) => state.fvPortal.computePortal),
    computePortals: useSelector((state) => state.fvPortal.computePortals),
    fetchPortal,
    fetchPortals,
  }
}

export default usePortal
