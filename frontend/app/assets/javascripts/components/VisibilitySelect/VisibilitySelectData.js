import PropTypes from 'prop-types'
//FPCC
import { useState, useEffect } from 'react'

/**
 * @summary VisibilitySelectData - uses the state of a document to determine its visibility and handles the LOCAL state of the VisibilitySelect component.
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 * @param {string} props.docId
 * @param {string} props.docState
 * @param {function} props.handleVisibilityChange
 *
 */
function VisibilitySelectData({ children, docId, docState, handleVisibilityChange }) {
  const [visibility, setVisibility] = useState('')

  useEffect(() => {
    setVisibility(convertStateToVisibility(docState))
  }, [])

  const handleChange = (event) => {
    const newVisibility = event.target.value
    setVisibility(newVisibility)
    handleVisibilityChange(newVisibility, docId)
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
    handleChange,
    visibility,
  })
}
// PROPTYPES
const { func, string } = PropTypes
VisibilitySelectData.propTypes = {
  children: func,
  docId: string,
  docState: string,
  handleVisibilityChange: func,
}

export default VisibilitySelectData
