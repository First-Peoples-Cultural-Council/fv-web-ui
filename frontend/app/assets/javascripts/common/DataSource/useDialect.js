import { useDispatch, useSelector } from 'react-redux'
import { fetchDialect2 as _fetchDialect2 } from 'providers/redux/reducers/fvDialect'
function useDialect() {
  const dispatch = useDispatch()
  return {
    computeDialect: useSelector((state) => state.fvDialect.computeDialect),
    computeDialect2: useSelector((state) => state.fvDialect.computeDialect2),
    fetchDialect2: (pathOrId, messageStart, messageSuccess, messageError, propertiesOverride) => {
      const dispatchObj = _fetchDialect2(pathOrId, messageStart, messageSuccess, messageError, propertiesOverride)
      dispatch(dispatchObj)
    },
  }
}

export default useDialect
