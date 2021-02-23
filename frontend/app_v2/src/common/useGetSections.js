import { useContext } from 'react'
import AppStateContext from 'common/AppStateContext'

const useGetSections = () => {
  const { reducer } = useContext(AppStateContext)
  return reducer.state.api.getSections
}
export default useGetSections
