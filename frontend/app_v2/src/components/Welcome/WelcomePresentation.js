import React, { useContext, useRef } from 'react'
import PropTypes from 'prop-types'
import { NATIVE_AUDIO_PLAYING } from 'common/constants'

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
  const audioRef2 = useRef()
  const source2 =
    'https://dev.firstvoices.com/nuxeo/nxfile/default/15761975-8249-400c-a9e2-4a5357ca7ce9/file:content/sample1.mp3'
  const audioRef3 = useRef()
  const source3 =
    'https://dev.firstvoices.com/nuxeo/nxfile/default/15761975-8249-400c-a9e2-0a0000aa0aa0/file:content/BROKEN.mp3'
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
            onPlay={() => send(NATIVE_AUDIO_PLAYING, { src: source, ref: audioRef })}
          />
        )}
        <audio
          ref={audioRef2}
          className="w-7/12 text-black mx-auto"
          src={source2}
          controls
          onPlay={() => send(NATIVE_AUDIO_PLAYING, { src: source2, ref: audioRef2 })}
        />
        <audio
          ref={audioRef3}
          className="w-7/12 text-black mx-auto"
          src={source3}
          controls
          onPlay={() => send(NATIVE_AUDIO_PLAYING, { src: source3, ref: audioRef3 })}
        />
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
