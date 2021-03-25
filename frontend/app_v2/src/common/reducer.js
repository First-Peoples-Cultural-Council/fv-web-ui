export const reducerInitialState = {
  siteApi: {
    get: {
      idLogo: undefined,
      path: undefined,
      title: undefined,
      uid: undefined,
      logoUrl: undefined,
    },
  },
  api: {
    getUser: {},
  },
}
export const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'siteApi.get': {
      state.siteApi.get = payload
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
