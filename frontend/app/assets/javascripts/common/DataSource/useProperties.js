import { useDispatch, useSelector } from 'react-redux'
import { updatePageProperties as _updatePageProperties } from 'providers/redux/reducers/navigation'

function useProperties() {
  const dispatch = useDispatch()

  const updatePageProperties = (pageProperties) => {
    const dispatchObj = _updatePageProperties(pageProperties)
    dispatch(dispatchObj)
  }
  return {
    properties: useSelector((state) => state.navigation.properties),
    updatePageProperties,
  }
}

export default useProperties
