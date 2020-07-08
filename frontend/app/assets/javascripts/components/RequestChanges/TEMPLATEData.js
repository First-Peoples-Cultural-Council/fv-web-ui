import PropTypes from 'prop-types'

/**
 * @summary RequestChangesData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function RequestChangesData({children}) {
  return children({
    log: 'Output from RequestChangesData',
  })
}

// PROPTYPES
const {func} = PropTypes
RequestChangesData.propTypes = {
  children: func,
}

export default RequestChangesData
