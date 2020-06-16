import PropTypes from 'prop-types'

/**
 * @summary ListPhraseBooksData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function ListPhraseBooksData({ children }) {
  return children({
    log: 'Output from ListPhraseBooksData',
  })
}
// PROPTYPES
const { func } = PropTypes
ListPhraseBooksData.propTypes = {
  children: func,
}

export default ListPhraseBooksData
