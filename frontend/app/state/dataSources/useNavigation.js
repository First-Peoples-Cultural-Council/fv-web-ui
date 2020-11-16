import { useDispatch } from 'react-redux'
import {
  changeTitleParams as _changeTitleParams,
  loadNavigation as _loadNavigation,
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

  const overrideBreadcrumbs = (breadcrumbs) => {
    const dispatchObj = _overrideBreadcrumbs(breadcrumbs)
    dispatch(dispatchObj)
  }

  return {
    changeTitleParams,
    loadNavigation,
    overrideBreadcrumbs,
  }
}

export default useNavigation
