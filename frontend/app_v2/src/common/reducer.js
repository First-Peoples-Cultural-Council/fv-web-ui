export const reducerInitialState = {
  api: {
    getSections: {
      idLogo: undefined,
      path: undefined,
      title: undefined,
      uid: undefined,
      logoUrl: undefined,
    },
    getUser: {},
  },
}
export const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'api.getSections': {
      state.api.getSections = payload
      return state
    }
    case 'api.getUser': {
      state.api.getUser = payload
      return state
    }
    default:
      return state
  }
}
