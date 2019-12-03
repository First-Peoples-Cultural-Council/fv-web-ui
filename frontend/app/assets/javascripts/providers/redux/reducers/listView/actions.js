import { LISTVIEW_UPDATE } from './actionTypes'

export const setListViewMode = (viewMode) => {
  return (dispatch) => {
    dispatch({ type: LISTVIEW_UPDATE, payload: viewMode })
  }
}
