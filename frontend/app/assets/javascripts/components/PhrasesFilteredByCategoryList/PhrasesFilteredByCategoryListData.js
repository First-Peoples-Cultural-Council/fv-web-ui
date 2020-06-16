import PropTypes from 'prop-types'

/**
 * @summary PhrasesFilteredByCategoryListData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function PhrasesFilteredByCategoryListData({ children }) {
  return children({
    log: 'Output from PhrasesFilteredByCategoryListData',
  })
}
// PROPTYPES
const { func } = PropTypes
PhrasesFilteredByCategoryListData.propTypes = {
  children: func,
}

export default PhrasesFilteredByCategoryListData
