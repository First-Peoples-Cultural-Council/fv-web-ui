import PropTypes from 'prop-types'

/**
 * @summary WidgetWotdData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function WidgetWotdData({ children }) {
  const entry = {
    title: "adelht̲s̲'ine",
    definition:
      'the people sitting at a potlatch, that is, the members of the invited clans as opposed to the host clan.',
    audioFile: '',
  }
  return children({
    entry,
  })
}
// PROPTYPES
const { func } = PropTypes
WidgetWotdData.propTypes = {
  children: func,
}

export default WidgetWotdData
