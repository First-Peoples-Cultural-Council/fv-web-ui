import { useContext } from 'react'
import AppStateContext from 'common/AppStateContext'

const useUserGet = () => {
  const { reducer } = useContext(AppStateContext)
  return reducer.state.api.getUser
}
export default useUserGet
