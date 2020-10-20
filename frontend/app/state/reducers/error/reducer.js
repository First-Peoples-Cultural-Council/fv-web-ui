import { SET, RESET } from './actionTypes'

const initialState = {
  error: null,
}

export const errorReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET:
      return {
        ...state,
        error: action.error,
      }

    case RESET:
      return initialState

    default:
      return state
  }
}
