import { useDispatch, useSelector } from 'react-redux'
import {
  setRouteParams as _setRouteParams,
  updatePageProperties as _updatePageProperties,
} from 'providers/redux/reducers/navigation'

function useNavigation() {
  const dispatch = useDispatch()

  const setRouteParams = (data) => {
    const dispatchObj = _setRouteParams(data)
    dispatch(dispatchObj)
  }

  const updatePageProperties = (pageProperties) => {
    const dispatchObj = _updatePageProperties(pageProperties)
    dispatch(dispatchObj)
  }

  return {
    routeParams: useSelector((state) => state.navigation.route.routeParams),
    setRouteParams,
    updatePageProperties,
  }
}

export default useNavigation
