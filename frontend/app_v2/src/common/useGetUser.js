import { useContext } from 'react'
import AppStateContext from 'common/AppStateContext'

const useGetUser = () => {
  const { reducer } = useContext(AppStateContext)
  return reducer.state.api.user.get
}
export default useGetUser
