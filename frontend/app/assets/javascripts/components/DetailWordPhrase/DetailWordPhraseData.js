import PropTypes from 'prop-types'

/**
 * @summary DetailWordPhraseData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function DetailWordPhraseData({ children }) {
  return children({
    log: 'Output from DetailWordPhraseData',
  })
}
// PROPTYPES
const { func } = PropTypes
DetailWordPhraseData.propTypes = {
  children: func,
}

export default DetailWordPhraseData
