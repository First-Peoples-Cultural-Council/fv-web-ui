import PropTypes from 'prop-types'

/**
 * @summary CategoriesListData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function CategoriesListData({ children }) {
  return children({
    log: 'Output from CategoriesListData',
  })
}
// PROPTYPES
const { func } = PropTypes
CategoriesListData.propTypes = {
  children: func,
}

export default CategoriesListData
