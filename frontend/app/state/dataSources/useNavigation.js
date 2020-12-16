import { useDispatch } from 'react-redux'
import {
  changeTitleParams as _changeTitleParams,
  loadNavigation as _loadNavigation,
  navigateTo as _navigateTo,
  overrideBreadcrumbs as _overrideBreadcrumbs,
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

  const navigateTo = (path) => {
    const dispatchObj = _navigateTo(path)
    dispatch(dispatchObj)
  }

  const overrideBreadcrumbs = (breadcrumbs) => {
    const dispatchObj = _overrideBreadcrumbs(breadcrumbs)
    dispatch(dispatchObj)
  }

  return {
    changeTitleParams,
    loadNavigation,
    navigateTo,
    overrideBreadcrumbs,
  }
}

export default useNavigation
