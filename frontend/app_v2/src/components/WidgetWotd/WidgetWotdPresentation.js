import React from 'react'
import PropTypes from 'prop-types'
import useIcon from 'common/useIcon'
import Share from 'components/Share'
/**
 * @summary WidgetWotdPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {object} entry - the document to be featured: should include title, url, definition, and optional audio src.
 * @param {function} onAudioClick - audio icon click handler
 *
 * @returns {node} jsx markup
 */
function WidgetWotdPresentation({ entry, onAudioClick }) {
  return (
    <section className="mx-6 py-12 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="mb-12 text-4xl text-fv-blue font-bold uppercase sm:text-5xl">Word of the Day</h2>
        <div className="mt-2 max-w-2xl inline-flex items-center text-4xl font-bold text-black md:mx-auto sm:text-5xl">
          <a href={entry.url}>{entry.title}</a>
          {entry.audioSrc ? (
            <button onClick={() => onAudioClick()} className="ml-4 inline">
              {useIcon('Audio', 'h-9 w-9 sm:w-12 sm:h-12')}
            </button>
          ) : null}
        </div>
        <p className="mt-4 max-w-2xl text-2xl text-gray-500 md:mx-auto sm:text-3xl">{entry.definition}</p>
        <h3 className="mt-8 max-w-2xl text-lg text-fv-red md:mx-auto sm:text-xl">Share on:</h3>
        <Share.Container url={entry.url} title={entry.title} />
      </div>
    </section>
  )
}
// PROPTYPES
const { func, object } = PropTypes
WidgetWotdPresentation.propTypes = {
  entry: object,
  onAudioClick: func,
}

export default WidgetWotdPresentation
