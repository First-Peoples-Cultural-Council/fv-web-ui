import PropTypes from 'prop-types'

// FPCC
import useIntl from 'DataSource/useIntl'
import useRoute from 'DataSource/useRoute'
import useWindowPath from 'DataSource/useWindowPath'

/**
 * @summary PublishDialogData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function PublishDialogData({ children }) {
  const { intl } = useIntl()
  const { routeParams } = useRoute()
  const { pushWindowPath } = useWindowPath()
  return children({
    intl,
    siteTheme: routeParams.siteTheme || '',
    pushWindowPath,
  })
}
// PROPTYPES
const { func } = PropTypes
PublishDialogData.propTypes = {
  children: func,
}

export default PublishDialogData
