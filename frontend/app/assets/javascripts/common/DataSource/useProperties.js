import { useSelector } from 'react-redux'
function useProperties() {
  return {
    properties: useSelector((state) => state.navigation.properties),
  }
}
export default useProperties
