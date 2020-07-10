import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'

//FPCC
import useVisibility from 'DataSource/useVisibility'

/**
 * @summary VisibilitySelectData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function VisibilitySelectData({ children, docId, docState }) {
  const { updateVisibilityToTeam, updateVisibilityToMembers, updateVisibilityToPublic } = useVisibility()
  const [visibility, setVisibility] = useState('')

  useEffect(() => {
    setVisibility(convertStateToVisibility(docState))
  }, [])

  function convertStateToVisibility(state) {
    switch (state) {
      case 'New':
        return 'team'
      case 'Disabled':
        return 'team'
      case 'Enabled':
        return 'members'
      case 'Published':
        return 'public'
      default:
        return ''
    }
  }

  const handleChange = (event) => {
    setVisibility(event.target.value)

    switch (event.target.value) {
      case 'team':
        return updateVisibilityToTeam(docId)
      case 'members':
        return updateVisibilityToMembers(docId)
      case 'public':
        return updateVisibilityToPublic(docId)
      default:
        return null
    }
  }

  return children({
    handleChange,
    visibility,
  })
}
// PROPTYPES
const { func, string } = PropTypes
VisibilitySelectData.propTypes = {
  children: func,
  docId: string.isRequired,
  docState: string.isRequired,
}

export default VisibilitySelectData
