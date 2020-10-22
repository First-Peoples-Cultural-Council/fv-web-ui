import { useDispatch, useSelector } from 'react-redux'
import { setListViewMode as _setListViewMode } from 'reducers/listView'

function useListView() {
  const dispatch = useDispatch()

  const setListViewMode = (viewMode) => {
    const dispatchObj = _setListViewMode(viewMode)
    dispatch(dispatchObj)
  }

  return {
    listView: useSelector((state) => state.listView),
    setListViewMode,
  }
}

export default useListView
