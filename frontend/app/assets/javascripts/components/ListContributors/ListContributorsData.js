import PropTypes from 'prop-types'

/**
 * @summary ListContributorsData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function ListContributorsData({ children }) {
  return children({
    log: 'Output from ListContributorsData',
  })
}
// PROPTYPES
const { func } = PropTypes
ListContributorsData.propTypes = {
  children: func,
}

export default ListContributorsData
