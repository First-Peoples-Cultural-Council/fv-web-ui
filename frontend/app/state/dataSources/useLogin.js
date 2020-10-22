import { useSelector } from 'react-redux'

function useLogin() {
  return {
    computeLogin: useSelector((state) => state.nuxeo.computeLogin),
  }
}

export default useLogin
