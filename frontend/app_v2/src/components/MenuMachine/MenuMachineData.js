import { useEffect } from 'react'
import { useMachine } from '@xstate/react'
import { useLocation } from 'react-router-dom'
// import { AUDIO_ERRORED, AUDIO_LOADED, AUDIO_STOPPED, PAGE_NAVIGATION } from 'common/constants'
import menuMachine from 'components/MenuMachine/menuMachine'
/**
 * @summary MenuMachineData
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function MenuMachineData() {
  const [machine, send] = useMachine(menuMachine)
  const { openMenu } = machine.context
  const location = useLocation()
  useEffect(() => {
    send('CLOSE')
  }, [location])
  return { machine, send }
}

export default MenuMachineData
