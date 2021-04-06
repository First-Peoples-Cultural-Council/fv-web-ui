import { useHistory } from 'react-router-dom'

const useErrorHandler = (error) => {
  const history = useHistory()
  history.replace(history.location.pathname, {
    errorStatusCode: error?.response?.status,
  })
}
export default useErrorHandler
