import PropTypes from 'prop-types'

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
  return children({
    log: 'Output from VisibilitySelectData',
    docId: docId,
    docState: docState,
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
