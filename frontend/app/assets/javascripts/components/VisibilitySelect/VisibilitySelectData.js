import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'

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
    const input = {
      docId: docId,
      event: event.target.value,
    }
    // eslint-disable-next-line
    console.log('input', input)
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
