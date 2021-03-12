export const reducerInitialState = {
  api: {
    getSite: {
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
    case 'api.getSite': {
      state.api.getSite = payload
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
