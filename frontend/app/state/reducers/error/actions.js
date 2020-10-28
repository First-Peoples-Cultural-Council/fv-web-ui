import { SET, RESET } from './actionTypes'

export const errorSet = () => {
  return async(dispatch) => {
    dispatch({
      type: SET,
    })
  }
}

export const errorReset = () => {
  return async(dispatch) => {
    dispatch({
      type: RESET,
    })
  }
}
