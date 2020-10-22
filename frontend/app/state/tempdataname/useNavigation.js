import { useDispatch, useSelector } from 'react-redux'
import {
  changeTitleParams as _changeTitleParams,
  overrideBreadcrumbs as _overrideBreadcrumbs,
} from 'reducers/navigation'

function useNavigation() {
  const dispatch = useDispatch()

  const changeTitleParams = (titleParams) => {
    const dispatchObj = _changeTitleParams(titleParams)
    dispatch(dispatchObj)
  }

  const overrideBreadcrumbs = (breadcrumbs) => {
    const dispatchObj = _overrideBreadcrumbs(breadcrumbs)
    dispatch(dispatchObj)
  }

  return {
    computeLoadNavigation: useSelector((state) => state.navigation.computeLoadNavigation),
    changeTitleParams,
    overrideBreadcrumbs,
  }
}

export default useNavigation
