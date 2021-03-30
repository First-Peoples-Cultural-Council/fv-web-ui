import { useContext } from 'react'
import AppStateContext from 'common/AppStateContext'

const useGetSite = () => {
  const { reducer } = useContext(AppStateContext)
  return reducer.state.api.site.get
}
export default useGetSite
