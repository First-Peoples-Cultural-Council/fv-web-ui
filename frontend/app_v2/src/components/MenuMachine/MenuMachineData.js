import { useEffect } from 'react'
import { useMachine } from '@xstate/react'
import { useLocation } from 'react-router-dom'
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
  const location = useLocation()
  useEffect(() => {
    send('CLOSE')
  }, [location])
  return { machine, send }
}

export default MenuMachineData
