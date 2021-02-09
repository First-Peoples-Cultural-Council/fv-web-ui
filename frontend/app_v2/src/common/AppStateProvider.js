import PropTypes from 'prop-types'
import React, { useReducer } from 'react'

import AppStateContext from 'common/AppStateContext'
import AudioMachineData from 'components/AudioMachine/AudioMachineData'

function reducer(state, action) {
  if (action.type === 'api.getSections') {
    // NOTE: logoUrl is added via api.getSections.logo
    // If we don't do the following test the logoUrl will be lost
    if (state.api.getSections.uid === action.payload.uid) {
      state.api.getSections = { ...state.api.getSections, ...action.payload }
    } else {
      state.api.getSections = action.payload
    }
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
function AppStateProvider({ children }) {
  const { machine, send } = AudioMachineData()
  const [state, dispatch] = useReducer(reducer, {
    api: {
      getSections: {},
    },
  })
  return (
    <AppStateContext.Provider
      value={{
        reducer: {
          state,
          dispatch,
        },
        audio: {
          machine,
          send,
        },
      }}
    >
      {children}
    </AppStateContext.Provider>
  )
}
// PROPTYPES
const { node } = PropTypes
AppStateProvider.propTypes = {
  children: node,
}

export default AppStateProvider
