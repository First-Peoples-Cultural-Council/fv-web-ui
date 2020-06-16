import PropTypes from 'prop-types'

/**
 * @summary PhraseBooksListData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function PhraseBooksListData({ children }) {
  return children({
    log: 'Output from PhraseBooksListData',
  })
}
// PROPTYPES
const { func } = PropTypes
PhraseBooksListData.propTypes = {
  children: func,
}

export default PhraseBooksListData
