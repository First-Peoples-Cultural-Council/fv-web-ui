import { useDispatch, useSelector } from 'react-redux'
import { setListViewMode as _setListViewMode } from 'providers/redux/reducers/listView'

function useListView() {
  const dispatch = useDispatch()

  const setListViewMode = (viewMode) => {
    const dispatchObj = _setListViewMode(viewMode)
    dispatch(dispatchObj)
  }

  return {
    listViewReducer: useSelector((state) => state.listView.listViewReducer),
    setListViewMode,
  }
}

export default useListView
