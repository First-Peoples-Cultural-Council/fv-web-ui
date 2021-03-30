import React from 'react'
import PropTypes from 'prop-types'

import Resource from 'components/Resource'

/**
 * @summary ResourceContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function ResourceContainer({ resourceId }) {
  const { content } = Resource.Data({ resourceId })

  return <Resource.Presentation body={content.body} bannerHeading={content.bannerHeading} />
}
// PROPTYPES
const { string } = PropTypes
ResourceContainer.propTypes = {
  resourceId: string,
}

export default ResourceContainer
