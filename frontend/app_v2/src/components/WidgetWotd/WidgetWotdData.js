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
    title: "ali'wadzāgwis",
    definition:
      'the people sitting at a potlatch, that is, the members of the invited clans as opposed to the host clan.',
    audioFile: '',
    url:
      'https://www.firstvoices.com/explore/FV/sections/Data/Athabascan/Yekooche/Yekooche/learn/words/167adc92-020c-4fa8-94a3-3cdf18ac05ae',
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
