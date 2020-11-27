import { useDispatch, useSelector } from 'react-redux'
import { fetchDirectory as _fetchDirectory } from 'reducers/directory'

function useDirectory() {
  const dispatch = useDispatch()

  const fetchDirectory = (pathOrId, messageStart, messageSuccess, messageError, propertiesOverride) => {
    const dispatchObj = _fetchDirectory(pathOrId, messageStart, messageSuccess, messageError, propertiesOverride)
    dispatch(dispatchObj)
  }

  return {
    computeDirectory: useSelector((state) => state.directory.computeDirectory),
    fetchDirectory,
  }
}

export default useDirectory
