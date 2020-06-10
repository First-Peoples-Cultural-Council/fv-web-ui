import { useDispatch, useSelector } from 'react-redux'
import { setListViewMode as _setListViewMode } from 'providers/redux/reducers/listView'
function useListView() {
  const dispatch = useDispatch()
  const setListViewMode = (arg) => {
    const dispatchObj = _setListViewMode(arg)
    dispatch(dispatchObj)
  }
  return {
    listView: useSelector((state) => state.listView),
    setListViewMode,
  }
}
export default useListView
