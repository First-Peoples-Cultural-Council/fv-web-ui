import PropTypes from 'prop-types'

/**
 * @summary ContentData
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function ContentData({ children }) {
  return children({
    log: 'Output from ContentData',
  })
}
// PROPTYPES
const { func } = PropTypes
ContentData.propTypes = {
  children: func,
}

export default ContentData
