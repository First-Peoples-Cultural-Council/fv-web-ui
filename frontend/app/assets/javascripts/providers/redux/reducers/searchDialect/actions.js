import { SEARCH_DIALECT_UPDATE, SEARCH_DIALECT_RESET } from './actionTypes'

export const searchDialectUpdate = (searchObj) => {
  return (dispatch) => {
    dispatch({ type: SEARCH_DIALECT_UPDATE, payload: searchObj })
  }
}

export const searchDialectReset = () => {
  return (dispatch) => {
    dispatch({ type: SEARCH_DIALECT_RESET })
  }
}
