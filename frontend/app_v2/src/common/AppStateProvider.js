import PropTypes from 'prop-types'
import React, { useReducer } from 'react'

import AppStateContext from 'common/AppStateContext'
import AudioMachineData from 'components/AudioMachine/AudioMachineData'

function reducer(state, action) {
  if (action.type === 'api.getSections') {
    state.api.getSections = action.payload
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
