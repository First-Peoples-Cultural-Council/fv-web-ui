import React from 'react'
import PropTypes from 'prop-types'

// FPCC
import { getMediaUrl } from 'common/urlHelpers'
import AudioNative from 'components/AudioNative'
import EntryActions from 'components/EntryActions'
/**
 * @summary WordPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function WordPresentation({ actions, moreActions, entry }) {
  return (
    <section className="bg-white" data-testid="WordPresentation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="divide-y divide-gray-200">
          <div className="p-6">
            <div className="flow-root px-4 sm:-mt-8 sm:flex sm:items-end sm:px-6 lg:-mt-15">
              <div className="mt-6 sm:ml-6 sm:flex-1">
                <div className="inline-flex">
                  <h3 className="font-bold text-xl text-gray-900 sm:text-2xl">{entry.title}</h3>
                </div>
                <div className="mt-5 inline-flex flex-wrap items-center space-y-3 sm:space-y-0 sm:space-x-3">
                  <EntryActions.Container
                    documentId={entry.id}
                    documentTitle={entry.title}
                    actions={actions}
                    moreActions={moreActions}
                    withLabels
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="px-4 py-5 sm:px-0 sm:py-0">
            <dl className="space-y-8 sm:divide-y sm:divide-gray-200 sm:space-y-0">
              <div className="sm:flex sm:px-5 sm:py-5">
                {entry?.pictures
                  ? entry.audio.map((audioId, index) => (
                      <AudioNative.Container
                        key={`${audioId}_${index}`}
                        className="w-2/5 text-black"
                        src={getMediaUrl({ type: 'image', id: audioId })}
                      />
                    ))
                  : null}
              </div>
              <div className="sm:flex sm:px-6 sm:py-5">
                <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">Definition</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                  {entry?.translations?.length > 0
                    ? entry?.translations.map((translation, index) => (
                        <div key={index} className="flex items-center">
                          <h4 className="font-bold">{translation.language}</h4>
                          <p className="ml-4">{translation.translation}</p>
                        </div>
                      ))
                    : null}
                </dd>
              </div>
              <div className="sm:flex sm:px-6 sm:py-5">
                <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">Part of Speech</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">{entry?.partOfSpeech}</dd>
              </div>
              <div className="sm:flex sm:px-6 sm:py-5">
                <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">Pronunciation</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">{entry?.pronunciation}</dd>
              </div>
              <div className="sm:flex sm:px-6 sm:py-5">
                <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">Acknowledgement</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">{entry?.acknowledgement}</dd>
              </div>
              <div>
                {entry?.pictures
                  ? entry.pictures.map((picture, index) => (
                      <div
                        key={`${picture}_${index}`}
                        className="inline-flex rounded-lg overflow-hidden border-4 border-white"
                      >
                        <img
                          className="flex-shrink-0 h-40 lg:h-80"
                          src={getMediaUrl({ type: 'image', id: picture, viewName: 'Medium' })}
                        />
                      </div>
                    ))
                  : null}
                {entry?.videos
                  ? entry.videos.map((video, index) => (
                      <div
                        key={`${video}_${index}`}
                        className="inline-flex rounded-lg overflow-hidden border-4 border-white"
                      >
                        <video
                          className="flex-shrink-0 h-40 lg:h-80"
                          src={getMediaUrl({ type: 'video', id: video, viewName: 'Small' })}
                          controls
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ))
                  : null}
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
// PROPTYPES
const { array, object } = PropTypes
WordPresentation.propTypes = {
  actions: array,
  entry: object,
  moreActions: array,
}

export default WordPresentation
