import React, { useContext, useRef } from 'react'
import PropTypes from 'prop-types'
import { NATIVE_AUDIO_PLAYING, NATIVE_AUDIO_PAUSED } from 'common/constants'

import AppStateContext from 'common/AppStateContext'

/**
 * @summary WelcomePresentation
 * @component
 *
 * @param {object} props
 * @param {string} audio - audio src.
 * @param {string} title - title of the widget
 * @param {string} heading - the main text
 *
 * @returns {node} jsx markup
 */
function WelcomePresentation({ audio: source, heading, title }) {
  const { audio } = useContext(AppStateContext)
  const { send } = audio
  const audioRef = useRef()
  return (
    <section key={title} className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="mb-12 text-3xl text-fv-blue font-bold sm:text-4xl">{heading}</h2>
        {audio && (
          <audio
            ref={audioRef}
            className="w-7/12 text-black mx-auto"
            src={source}
            controls
            onPause={() => send(NATIVE_AUDIO_PAUSED)}
            onPlay={() => send(NATIVE_AUDIO_PLAYING, { src: source, ref: audioRef })}
          />
        )}
      </div>
    </section>
  )
}
// PROPTYPES
const { string, node } = PropTypes
WelcomePresentation.propTypes = {
  audio: node,
  heading: string,
  title: string,
}

export default WelcomePresentation
