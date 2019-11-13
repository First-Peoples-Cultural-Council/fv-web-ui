import { SEARCH_DIALECT_UPDATE } from './actionTypes'

export const searchDialectUpdate = (searchObj) => {
  return (dispatch) => {
    dispatch({ type: SEARCH_DIALECT_UPDATE, payload: searchObj })
  }
}
