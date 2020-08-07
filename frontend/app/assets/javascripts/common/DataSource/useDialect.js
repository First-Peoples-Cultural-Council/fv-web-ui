import { useDispatch, useSelector } from 'react-redux'
import { fetchDialect as _fetchDialect, fetchDialect2 as _fetchDialect2 } from 'providers/redux/reducers/fvDialect'

function useDialect() {
  const dispatch = useDispatch()

  const fetchDialect2 = (pathOrId, messageStart, messageSuccess, messageError, propertiesOverride) => {
    const dispatchObj = _fetchDialect2(pathOrId, messageStart, messageSuccess, messageError, propertiesOverride)
    dispatch(dispatchObj)
  }

  const fetchDialect = (pathOrId, messageStart, messageSuccess, messageError, propertiesOverride) => {
    const dispatchObj = _fetchDialect(pathOrId, messageStart, messageSuccess, messageError, propertiesOverride)
    dispatch(dispatchObj)
  }

  return {
    computeDialect: useSelector((state) => state.fvDialect.computeDialect),
    computeDialect2: useSelector((state) => state.fvDialect.computeDialect2),
    fetchDialect,
    fetchDialect2,
  }
}

export default useDialect
