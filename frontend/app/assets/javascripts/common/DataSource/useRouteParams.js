import { useDispatch, useSelector } from 'react-redux'
import { setRouteParams as _setRouteParams } from 'providers/redux/reducers/navigation'

function useRouteParams() {
  const dispatch = useDispatch()
  const setRouteParams = (data) => {
    const dispatchObj = _setRouteParams(data)
    dispatch(dispatchObj)
  }
  return {
    routeParams: useSelector((state) => state.navigation.route.routeParams),
    setRouteParams,
  }
}

export default useRouteParams
