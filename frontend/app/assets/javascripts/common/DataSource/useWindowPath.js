import { useDispatch, useSelector } from 'react-redux'
import {
  pushWindowPath as _pushWindowPath,
  replaceWindowPath as _replaceWindowPath,
} from 'providers/redux/reducers/windowPath'

function useWindowPath() {
  const dispatch = useDispatch()

  const pushWindowPath = (windowPath) => {
    const dispatchObj = _pushWindowPath(windowPath)
    dispatch(dispatchObj)
  }
  const replaceWindowPath = (windowPath) => {
    const dispatchObj = _replaceWindowPath(windowPath)
    dispatch(dispatchObj)
  }
  return {
    windowPath: useSelector((state) => state.windowPath._windowPath),
    splitWindowPath: useSelector((state) => state.windowPath.splitWindowPath),
    pushWindowPath,
    replaceWindowPath,
  }
}

export default useWindowPath
