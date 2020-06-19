import { useDispatch, useSelector } from 'react-redux'
import { fetchDialect2 as _fetchDialect2 } from 'providers/redux/reducers/fvDialect'

function useDialect() {
  const dispatch = useDispatch()

  const fetchDialect2 = (pathOrId, operationParams, message, headers, properties) => {
    const dispatchObj = _fetchDialect2(pathOrId, operationParams, message, headers, properties)
    dispatch(dispatchObj)
  }
  return {
    computeDialect2: useSelector((state) => state.fvDialect.computeDialect2),
    fetchDialect2,
  }
}

export default useDialect
