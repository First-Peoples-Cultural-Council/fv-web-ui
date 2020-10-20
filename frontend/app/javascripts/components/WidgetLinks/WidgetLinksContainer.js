import React from 'react'
import WidgetLinksPresentation from 'components/WidgetLinks/WidgetLinksPresentation'
import WidgetLinksData from 'components/WidgetLinks/WidgetLinksData'

/**
 * @summary WidgetLinksContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function WidgetLinksContainer() {
  return (
    <WidgetLinksData>
      {({ links }) => {
        return <WidgetLinksPresentation links={links} />
      }}
    </WidgetLinksData>
  )
}

export default WidgetLinksContainer
