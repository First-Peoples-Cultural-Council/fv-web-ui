import { useDispatch, useSelector } from 'react-redux'
import { updatePageProperties as _updatePageProperties } from 'providers/redux/reducers/navigation'
function useProperties() {
  const dispatch = useDispatch()
  const updatePageProperties = () => {
    const dispatchObj = _updatePageProperties()
    dispatch(dispatchObj)
  }
  return {
    updatePageProperties,
    properties: useSelector((state) => state.navigation.properties),
  }
}
export default useProperties
