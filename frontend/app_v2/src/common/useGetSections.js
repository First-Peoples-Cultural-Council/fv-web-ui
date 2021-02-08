import { useContext } from 'react'
import AppStateContext from 'common/AppStateContext'

function useGetSections() {
  const { reducer } = useContext(AppStateContext)
  const { title, uid, path } = reducer.state.api.getSections

  return { title, uid, path }
}
export default useGetSections
