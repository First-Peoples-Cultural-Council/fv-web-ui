import { useDispatch, useSelector } from 'react-redux'
import { setRouteParams as _setRouteParams } from 'reducers/navigation'

function useRoute() {
  const dispatch = useDispatch()

  const setRouteParams = (data) => {
    const dispatchObj = _setRouteParams(data)
    dispatch(dispatchObj)
  }

  return {
    routeParams: useSelector((state) => state.navigation.route.routeParams),
    navigationRouteSearch: useSelector((state) => state.navigation.route.search),
    setRouteParams,
  }
}

export default useRoute
