import { useSelector } from 'react-redux'
function useSearch() {
  return {
    searchParams: useSelector((state) => state.navigation.route.search),
  }
}
export default useSearch
