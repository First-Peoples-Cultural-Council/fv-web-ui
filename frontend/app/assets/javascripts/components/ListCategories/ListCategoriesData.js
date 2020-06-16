import PropTypes from 'prop-types'

/**
 * @summary ListCategoriesData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function ListCategoriesData({ children }) {
  return children({
    log: 'Output from ListCategoriesData',
  })
}
// PROPTYPES
const { func } = PropTypes
ListCategoriesData.propTypes = {
  children: func,
}

export default ListCategoriesData
