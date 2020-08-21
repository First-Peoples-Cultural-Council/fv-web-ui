import React from 'react'
import PropTypes from 'prop-types'
import PublishDialogPresentation from 'components/PublishDialog/PublishDialogPresentation'
import PublishDialogData from 'components/PublishDialog/PublishDialogData'

/**
 * @summary PublishDialogContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function PublishDialogContainer({ data }) {
  return (
    <PublishDialogData>
      {({ intl, pushWindowPath, siteTheme }) => {
        return (
          <PublishDialogPresentation intl={intl} data={data} pushWindowPath={pushWindowPath} siteTheme={siteTheme} />
        )
      }}
    </PublishDialogData>
  )
}
// PROPTYPES
const { object } = PropTypes
PublishDialogContainer.propTypes = {
  data: object,
}

export default PublishDialogContainer
