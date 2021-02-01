import React from 'react'
// import PropTypes from 'prop-types'
import WidgetWotdPresentation from 'components/WidgetWotd/WidgetWotdPresentation'
import WidgetWotdData from 'components/WidgetWotd/WidgetWotdData'

/**
 * @summary WidgetWotdContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function WidgetWotdContainer() {
  return (
    <WidgetWotdData>
      {({ entry, onAudioClick }) => {
        return <WidgetWotdPresentation entry={entry} onAudioClick={onAudioClick} />
      }}
    </WidgetWotdData>
  )
}
// PROPTYPES
// const { string } = PropTypes
WidgetWotdContainer.propTypes = {
  //   something: string,
}

export default WidgetWotdContainer
