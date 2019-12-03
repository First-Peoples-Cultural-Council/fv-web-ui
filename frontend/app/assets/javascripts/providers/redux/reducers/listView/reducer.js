import { LISTVIEW_UPDATE } from './actionTypes'

const initialState = {
  mode: 0,
  decoder: {
    default: 0,
    flashcard: 1,
    compact: 2,
    print: 3,
  },
}

export const listViewReducer = (state = initialState, action) => {
  switch (action.type) {
    case LISTVIEW_UPDATE: {
      // Update state
      // ------------------------------------------------------------
      return Object.assign({}, state, { mode: action.payload })
    }

    default:
      return state
  }
}
