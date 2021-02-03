import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { useMachine } from '@xstate/react'
import AppStateContext from 'common/AppStateContext'
import audioMachine from 'common/audioMachine'
import { AUDIO_ERRORED, AUDIO_LOADED, AUDIO_STOPPED } from 'common/constants'

function AppStateProvider({ children }) {
  const [machine, send] = useMachine(audioMachine)
  const { player, src } = machine.context
  useEffect(() => {
    player.addEventListener('canplaythrough', () => {
      send(AUDIO_LOADED)
    })
    player.addEventListener('ended', () => {
      send(AUDIO_STOPPED, { src })
    })
    player.addEventListener('error', () => {
      send(AUDIO_ERRORED)
    })
  }, [player])

  return <AppStateContext.Provider value={{ audio: { machine, send } }}>{children}</AppStateContext.Provider>
}
// PROPTYPES
const { node } = PropTypes
AppStateProvider.propTypes = {
  children: node,
}

export default AppStateProvider
