import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
//FPCC
import useRoute from 'DataSource/useRoute'
import useVisibility from 'DataSource/useVisibility'

/**
 * @summary VisibilityInlineData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function VisibilityInlineData({ children, docId, docState }) {
  const { updateVisibilityToTeam, updateVisibilityToMembers, updateVisibilityToPublic } = useVisibility()
  const [docVisibility, setDocVisibility] = useState('')
  const { routeParams } = useRoute()
  const dialectName = routeParams.dialect_name

  useEffect(() => {
    setDocVisibility(convertStateToVisibility(docState))
  }, [])

  const handleVisibilityChange = (event) => {
    const newVisibility = event.target.value
    // Set visibility for local state
    setDocVisibility(newVisibility)
    // Send request to the server to set visibility on the document
    switch (newVisibility) {
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

  return children({
    handleVisibilityChange,
    docVisibility,
    dialectName,
  })
}
// PROPTYPES
const { func, string } = PropTypes
VisibilityInlineData.propTypes = {
  children: func,
  docId: string,
  docState: string,
}

export default VisibilityInlineData
