import PropTypes from 'prop-types'

/**
 * @summary ListData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function ListData({ children }) {
  return children({
    log: 'Output from ListData',
  })
}
// PROPTYPES
const { func } = PropTypes
ListData.propTypes = {
  children: func,
}

export default ListData
