import { useContext } from 'react'
import AppStateContext from 'common/AppStateContext'

const useWorkspaceToggle = () => {
  const { workspaceToggle } = useContext(AppStateContext)
  const { value, set } = workspaceToggle
  return { value, set }
}
export default useWorkspaceToggle
