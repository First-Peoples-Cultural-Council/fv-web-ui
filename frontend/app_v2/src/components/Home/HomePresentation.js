import React from 'react'
import PropTypes from 'prop-types'
import ContactUs from 'components/ContactUs'
import Topics from 'components/Topics'
import WidgetWotd from 'components/WidgetWotd'
import Hero from 'components/Hero'
import CircleImage from 'components/CircleImage'
import useIcon from 'common/useIcon'
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
  language,
}) {
  const widgets = data ? data.widgets : []
  // TODO: use a better fallback icon
  const fallBackIcon = useIcon(
    'PlayCircle',
    `
        fill-current
        w-56
        h-56
        lg:w-72
        lg:h-72
      `
  )
  return (
    <div className="Home">
      {widgets.length > 0 &&
        widgets.map(({ type, ...widgetProps }, index) => {
          if (type === WIDGET_HERO) {
            const { uid, background, variant } = widgetProps
            const foregroundIcon = language.logoUrl ? (
              <CircleImage.Presentation
                src={language.logoUrl}
                classNameWidth="w-56 lg:w-72"
                classNameHeight="h-56 lg:h-72"
                alt=""
              />
            ) : (
              fallBackIcon
            )
            return (
              <Hero.Presentation
                key={index}
                background={background}
                foreground={<h1 className="font-bold text-3xl">{language.title}</h1>}
                foregroundIcon={foregroundIcon}
                variant={variant}
                uid={uid}
                search={
                  <div
                    className={`
                    bg-white
                    flex
                    px-12
                    py-6
                    rounded-25
                    w-3/4
                  `}
                  >
                    <button type="button">
                      {useIcon(
                        'Search',
                        `
                          fill-current
                          h-12
                          text-black
                          w-12
                        `
                      )}
                    </button>
                    <input
                      className={`
                        ml-8
                        text-black
                        w-full
                        text-4xl
                      `}
                      type="text"
                      placeholder={`Search ${language.title}`}
                    />
                  </div>
                }
              />
            )
          }

          if (type === WIDGET_WELCOME) {
            return (
              <div key={index} className="px-6">
                <div key={index}>WIDGET_WELCOME</div>
              </div>
            )
          }

          if (type === WIDGET_LIST) {
            const { title, content } = widgetProps
            return (
              <div key={index} className="px-6">
                <Topics.Presentation key={index} topics={content} title={title} />
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
            const { contactText, contactEmail, dialectId, links, title } = widgetProps
            // console.log('WIDGET_CONTACT', widgetProps)
            return (
              <div key={index}>
                <ContactUs.Container
                  contactText={contactText}
                  contactEmail={contactEmail}
                  dialectId={dialectId}
                  links={links}
                  title={title}
                />
              </div>
            )
          }

          return (
            <div key={index} className="text-xs">
              <h2>Widget of unknown type</h2>
              <code>
                <pre>{JSON.stringify(widgetProps, null, 4)}</pre>
              </code>
            </div>
          )
        })}
    </div>
  )
}
// PROPTYPES
const { array, string, shape } = PropTypes
HomePresentation.propTypes = {
  data: shape({
    uid: string,
    pageTitle: string,
    widgets: array,
  }),
  language: shape({
    title: string,
    uid: string,
    path: string,
    logoUrl: string,
  }),
}

export default HomePresentation
