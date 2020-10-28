import PropTypes from 'prop-types'

import useIntl from 'dataSources/useIntl'
import useWindowPath from 'dataSources/useWindowPath'

/**
 * @summary AdminMenuData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function AdminMenuData({ children }) {
  const { intl } = useIntl()
  const { pushWindowPath, windowPath } = useWindowPath()

  const tooltipTitle = intl.trans('views.pages.explore.dialect.more_options', 'More Options', 'words')

  const handleItemClick = (subdirectory, event) => {
    pushWindowPath(windowPath + subdirectory)
    event.preventDefault()
  }

  return children({
    handleItemClick,
    tooltipTitle,
  })
}
// PROPTYPES
const { func } = PropTypes
AdminMenuData.propTypes = {
  children: func,
}

export default AdminMenuData
