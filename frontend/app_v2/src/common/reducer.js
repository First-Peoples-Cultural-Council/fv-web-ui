export const reducerInitialState = {
  api: {
    site: {
      get: {
        idLogo: undefined,
        path: undefined,
        title: undefined,
        uid: undefined,
        logoUrl: undefined,
      },
    },
    user: {
      get: {},
    },
  },
}
export const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'api.site.get': {
      state.api.site.get = payload
      return state
    }
    case 'api.user.get': {
      state.api.user.get = payload?.properties
      return state
    }
    default:
      return state
  }
}
