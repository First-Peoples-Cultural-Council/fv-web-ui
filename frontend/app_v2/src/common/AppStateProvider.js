import PropTypes from 'prop-types'
import React from 'react'

import AppStateContext from 'common/AppStateContext'
import AudioMachineData from 'components/AudioMachine/AudioMachineData'

function AppStateProvider({ children }) {
  const { machine, send } = AudioMachineData()
  return <AppStateContext.Provider value={{ audio: { machine, send } }}>{children}</AppStateContext.Provider>
}
// PROPTYPES
const { node } = PropTypes
AppStateProvider.propTypes = {
  children: node,
}

export default AppStateProvider
