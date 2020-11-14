import { useDispatch, useSelector } from 'react-redux'
import {
  changeTitleParams as _changeTitleParams,
  loadNavigation as _loadNavigation,
  overrideBreadcrumbs as _overrideBreadcrumbs,
  toggleMenuAction as _toggleMenuAction,
} from 'reducers/navigation'

function useNavigation() {
  const dispatch = useDispatch()

  const changeTitleParams = (titleParams) => {
    const dispatchObj = _changeTitleParams(titleParams)
    dispatch(dispatchObj)
  }

  const loadNavigation = (breadcrumbs) => {
    const dispatchObj = _loadNavigation(breadcrumbs)
    dispatch(dispatchObj)
  }

  const overrideBreadcrumbs = (breadcrumbs) => {
    const dispatchObj = _overrideBreadcrumbs(breadcrumbs)
    dispatch(dispatchObj)
  }
  const toggleMenuAction = (breadcrumbs) => {
    const dispatchObj = _toggleMenuAction(breadcrumbs)
    dispatch(dispatchObj)
  }

  return {
    computeLoadNavigation: useSelector((state) => state.navigation.computeLoadNavigation),
    changeTitleParams,
    loadNavigation,
    overrideBreadcrumbs,
    toggleMenuAction,
  }
}

export default useNavigation
