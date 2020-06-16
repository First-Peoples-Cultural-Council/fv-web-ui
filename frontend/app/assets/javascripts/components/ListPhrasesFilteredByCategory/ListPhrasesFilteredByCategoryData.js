import PropTypes from 'prop-types'

/**
 * @summary ListPhrasesFilteredByCategoryData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function ListPhrasesFilteredByCategoryData({ children }) {
  return children({
    log: 'Output from ListPhrasesFilteredByCategoryData',
  })
}
// PROPTYPES
const { func } = PropTypes
ListPhrasesFilteredByCategoryData.propTypes = {
  children: func,
}

export default ListPhrasesFilteredByCategoryData
