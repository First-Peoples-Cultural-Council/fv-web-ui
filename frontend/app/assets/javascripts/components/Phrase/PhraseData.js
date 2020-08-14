import PropTypes from 'prop-types'

/**
 * @summary PhraseData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function PhraseData({ children }) {
  return children({
    log: 'Output from PhraseData',
  })
}
// PROPTYPES
const { func } = PropTypes
PhraseData.propTypes = {
  children: func,
}

export default PhraseData
