import { useDispatch, useSelector } from 'react-redux'
import { pushWindowPath as _pushWindowPath } from 'providers/redux/reducers/windowPath'

function useWindowPath() {
  const dispatch = useDispatch()
  const pushWindowPath = (windowPath) => {
    const dispatchObj = _pushWindowPath(windowPath)
    dispatch(dispatchObj)
  }
  return {
    windowPath: useSelector((state) => state.windowPath._windowPath),
    pushWindowPath,
    splitWindowPath: useSelector((state) => state.windowPath.splitWindowPath),
  }
}

export default useWindowPath
