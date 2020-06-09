import { useSelector } from 'react-redux'
function useRoute() {
  return {
    routeParams: useSelector((state) => state.navigation.route.routeParams),
  }
}
export default useRoute
