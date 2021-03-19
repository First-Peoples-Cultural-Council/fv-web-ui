import React from 'react'
import PropTypes from 'prop-types'

import Alphabet from 'components/Alphabet'
import ContactUs from 'components/ContactUs'
import Hero from 'components/Hero'
import Topics from 'components/Topics'
import Welcome from 'components/Welcome'
import WordOfTheDay from 'components/WordOfTheDay'
import SearchInput from 'components/SearchInput'

import CircleImage from 'components/CircleImage'
import useIcon from 'common/useIcon'
import {
  WIDGET_ALPHABET,
  WIDGET_CONTACT,
  WIDGET_GALLERY,
  WIDGET_HERO,
  WIDGET_LIST,
  WIDGET_SCHEDULE,
  WIDGET_STATS,
  WIDGET_WELCOME,
} from 'common/constants'

/**
 * @summary HomePresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function HomePresentation({ isLoading, error, data, language }) {
  const widgets = data ? data.widgets : []
  const fallBackIcon = useIcon('Spinner', 'fill-current w-56 h-56 lg:w-72 lg:h-72')
  if (isLoading) {
    return (
      <div className="flex justify-around p-10">
        <button
          type="button"
          className="bg-fv-orange border border-transparent items-center inline-flex px-5 py-2 rounded-md shadow-sm text-base text-white ease-in-out"
          disabled
        >
          {useIcon('Spinner', 'animate-spin h-5 w-5 mr-3 fill-current')}
          Loading
        </button>
      </div>
    )
  }
  if (error) {
    return (
      <div>
        <h1>Sorry, something went wrong!</h1>
        <p>Please check the url or report this error by emailing hello@firstvoices.com so that we can fix it.</p>
        <p>Include the link or action you took to get to this page.</p>
        <p>Thank You!</p>
      </div>
    )
  }
  return (
    <div>
      {widgets.length > 0 &&
        widgets.map(({ type, ...widgetProps }, index) => {
          if (type === WIDGET_HERO) {
            const { uid, background, variant } = widgetProps
            const foregroundIcon = language.logoUrl ? (
              <CircleImage.Presentation
                src={language.logoUrl}
                classNameWidth="w-40 lg:w-52"
                classNameHeight="h-40 lg:h-52"
                alt=""
              />
            ) : (
              fallBackIcon
            )
            return (
              <Hero.Presentation
                key={index}
                background={background}
                foreground={<h1 className="font-medium text-2xl">{language.title}</h1>}
                foregroundIcon={foregroundIcon}
                search={<SearchInput.Container />}
                variant={variant}
                uid={uid}
              />
            )
          }

          if (type === WIDGET_WELCOME) {
            const { audio, heading, title } = widgetProps
            return (
              <div key={index} className="px-6">
                <Welcome.Presentation audio={audio} heading={heading} title={title} />
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
              <div key={index} className="px-6 mb-8">
                <WordOfTheDay.Presentation
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
            return (
              <div key={index} className="px-6">
                <Alphabet.Container widgetView />
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
            const { contactText, contactEmail, siteId, links, title } = widgetProps
            // console.log('WIDGET_CONTACT', widgetProps)
            return (
              <div key={index}>
                <ContactUs.Container
                  contactText={contactText}
                  contactEmail={contactEmail}
                  siteId={siteId}
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
const { array, bool, oneOfType, string, shape } = PropTypes
HomePresentation.propTypes = {
  isLoading: bool,
  error: oneOfType([bool, array]),
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
