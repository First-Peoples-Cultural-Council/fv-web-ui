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
      const oldLogoUrl = state.api.getSections.logoUrl
      state.api.getSections = payload
      state.api.getSections.logoUrl = oldLogoUrl
      return state
    }
    case 'api.getSections.logo': {
      const { logoUrl, uid } = payload
      if (state.api.getSections.uid === uid) {
        state.api.getSections = { ...state.api.getSections, logoUrl }
      }
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
