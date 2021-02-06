import React from 'react'
import PropTypes from 'prop-types'
import WidgetWotd from 'components/WidgetWotd'
import Topics from 'components/Topics'

import {
  WIDGET_HERO,
  WIDGET_SCHEDULE,
  WIDGET_LIST,
  // WIDGET_LIST_WORD,
  // WIDGET_LIST_PHRASE,
  // WIDGET_LIST_SONG,
  // WIDGET_LIST_STORY,
  // WIDGET_LIST_MIXED,
  // WIDGET_LIST_GENERIC,
  WIDGET_WELCOME,
  WIDGET_ALPHABET,
  WIDGET_STATS,
  WIDGET_GALLERY,
  WIDGET_CONTACT,
} from 'common/constants'

/**
 * @summary HomePresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function HomePresentation({
  // isLoading,
  // error,
  data,
  // dataOriginal,
}) {
  const widgets = data ? data.widgets : []

  return (
    <div className="Home">
      {widgets.length > 0 &&
        widgets.map(({ type, ...widgetProps }, index) => {
          if (type === WIDGET_HERO) {
            // console.log('WIDGET_HERO props', widgetProps)
            return <div key={index}>WIDGET_HERO</div>
          }

          if (type === WIDGET_WELCOME) {
            return (
              <div key={index} className="px-6">
                <div key={index}>WIDGET_WELCOME</div>
              </div>
            )
          }

          if (type === WIDGET_LIST) {
            // console.log('WIDGET_LIST', widgetProps)
            return (
              <div key={index} className="px-6">
                <Topics.Container key={index} />
              </div>
            )
          }

          if (type === WIDGET_SCHEDULE) {
            const { audio, hasShare, heading, subheading, title, url } = widgetProps
            return (
              <div key={index} className="px-6">
                <WidgetWotd.Presentation
                  audio={audio}
                  hasShare={hasShare}
                  heading={heading}
                  subheading={subheading}
                  title={title}
                  url={url}
                />
              </div>
            )
          }

          if (type === WIDGET_ALPHABET) {
            // console.log('WIDGET_ALPHABET', widgetProps)
            return (
              <div key={index} className="px-6">
                <div>WIDGET_ALPHABET</div>
              </div>
            )
          }

          if (type === WIDGET_STATS) {
            // console.log('WIDGET_STATS', widgetProps)
            return <div key={index}>WIDGET_STATS</div>
          }

          if (type === WIDGET_GALLERY) {
            // console.log('WIDGET_GALLERY', widgetProps)
            return <div key={index}>WIDGET_GALLERY</div>
          }

          if (type === WIDGET_CONTACT) {
            // console.log('WIDGET_CONTACT', widgetProps)
            return <div key={index}>WIDGET_CONTACT</div>
          }

          return <div key={index}>Widget: {type}</div>
        })}
    </div>
  )
}
// PROPTYPES
const { object } = PropTypes
HomePresentation.propTypes = {
  data: object,
}

export default HomePresentation
