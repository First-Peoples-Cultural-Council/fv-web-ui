import PropTypes from 'prop-types'

/**
 * @summary ApprovalNotesData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function ApprovalNotesData({ children }) {
  return children({
    log: 'Output from ApprovalNotesData',
  })
}
// PROPTYPES
const { func } = PropTypes
ApprovalNotesData.propTypes = {
  children: func,
}

export default ApprovalNotesData
