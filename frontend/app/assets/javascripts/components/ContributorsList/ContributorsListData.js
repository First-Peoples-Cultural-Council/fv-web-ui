import PropTypes from 'prop-types'

/**
 * @summary ContributorsListData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function ContributorsListData({ children }) {
  return children({
    log: 'Output from ContributorsListData',
  })
}
// PROPTYPES
const { func } = PropTypes
ContributorsListData.propTypes = {
  children: func,
}

export default ContributorsListData
