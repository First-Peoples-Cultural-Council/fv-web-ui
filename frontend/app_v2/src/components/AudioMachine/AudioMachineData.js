import { useEffect } from 'react'
import { useMachine } from '@xstate/react'
import { useLocation } from 'react-router-dom'
import { AUDIO_ERRORED, AUDIO_LOADED, AUDIO_STOPPED, PAGE_NAVIGATION } from 'common/constants'
import audioMachine from 'components/AudioMachine/audioMachine'
/**
 * @summary AudioMachineData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function AudioMachineData() {
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

  const location = useLocation()
  useEffect(() => {
    send(PAGE_NAVIGATION, { src })
  }, [location])
  return { machine, send }
}

export default AudioMachineData
