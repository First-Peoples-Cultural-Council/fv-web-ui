export const reducerInitialState = {
  api: {
    getSections: {
      idLogo: undefined,
      path: undefined,
      title: undefined,
      uid: undefined,
      logoUrl: undefined,
    },
  },
}
export const reducer = (state, action) => {
  if (action.type === 'api.getSections') {
    const oldLogoUrl = state.api.getSections.logoUrl
    state.api.getSections = action.payload
    state.api.getSections.logoUrl = oldLogoUrl
  }
  if (action.type === 'api.getSections.logo') {
    const { logoUrl, uid } = action.payload
    if (state.api.getSections.uid === uid) {
      state.api.getSections = { ...state.api.getSections, logoUrl }
    }
  }

  return state

  // switch (action.type) {
  //   case 'api.getSections': {
  //     state.api.getSections = action.payload
  //     return state
  //   }
  //   default:
  //     return state
  // }
}
