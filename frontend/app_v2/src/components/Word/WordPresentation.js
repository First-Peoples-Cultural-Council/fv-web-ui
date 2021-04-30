import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

// FPCC
import { getMediaUrl } from 'common/urlHelpers'
import AudioNative from 'components/AudioNative'
import ActionsMenu from 'components/ActionsMenu'
/**
 * @summary WordPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function WordPresentation({ actions, moreActions, entry, siteShortUrl }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white" data-testid="WordPresentation">
      <div className="grid grid-cols-6 gap-4">
        <div id="WordDetails" className="col-span-6 sm:col-span-4">
          <div className="flow-root">
            <div className="w-full sm:flex items-center mt-5 px-6">
              <h3 className="sm:inline-flex sm:flex-1 font-bold text-xl sm:text-2xl">{entry.title}</h3>
              <div className="sm:inline-flex">
                <ActionsMenu.Container
                  documentId={entry.id}
                  documentTitle={entry.title}
                  actions={actions}
                  moreActions={moreActions}
                  withLabels
                  withConfirmation
                />
              </div>
            </div>
          </div>
          <div className="px-4 pb-2 sm:px-0 sm:py-0">
            <div className="sm:flex sm:px-5 sm:py-5">
              {entry?.audio
                ? entry.audio.map((audioFile, index) => (
                    <AudioNative.Container
                      key={`${audioFile.uid}_${index}`}
                      className="w-2/5 text-black"
                      src={getMediaUrl({ type: 'audio', id: audioFile.uid })}
                    />
                  ))
                : null}
            </div>
            <div className="sm:px-3 sm:py-3">
              {entry?.translations?.length > 0
                ? entry?.translations.map((translation, index) => (
                    <div key={index} className="">
                      {index === 0 ? (
                        <h4 className="text-left font-semibold text-lg uppercase text-fv-charcoal">
                          {translation.language}
                        </h4>
                      ) : null}
                      <p>
                        {index + 1}. {translation.translation}
                      </p>
                    </div>
                  ))
                : null}
            </div>
            <div className="sm:flex sm:px-3 sm:py-3">
              {entry?.relatedPhrases?.length > 0 && (
                <>
                  <table className="w-4/5">
                    <thead>
                      <tr>
                        <th colSpan="2" className="pb-2 text-left font-semibold text-lg uppercase text-fv-charcoal">
                          Related Phrases
                        </th>
                      </tr>
                      <tr>
                        <th className=" hidden">Title</th>
                        <th className="hidden">Definitions</th>
                      </tr>
                    </thead>
                    <tbody className="py-2 px-10">
                      {entry.relatedPhrases.map((phrase, index) => {
                        const zebraStripe = index % 2 === 0 ? 'bg-gray-100' : ''
                        return (
                          <tr key={index} className={zebraStripe}>
                            <td className="py-2 pl-5">
                              <Link to={`/${siteShortUrl}/phrases/${phrase.uid}`}>{phrase['dc:title']}</Link>
                            </td>
                            <td className="py-2 pr-5">
                              <span>{phrase?.['fv:definitions']?.[0].translation}</span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </>
              )}
            </div>
            <div className="sm:flex sm:px-3 sm:py-3">
              {entry?.relatedAssets?.length > 0 && (
                <>
                  <table className="w-4/5">
                    <thead>
                      <tr>
                        <th colSpan="2" className="pb-2 text-left font-semibold text-lg uppercase text-fv-charcoal">
                          Related Words
                        </th>
                      </tr>
                      <tr>
                        <th className=" hidden">Title</th>
                        <th className="hidden">Definitions</th>
                      </tr>
                    </thead>
                    <tbody className="py-2 px-10">
                      {entry.relatedAssets.map((asset, index) => {
                        const zebraStripe = index % 2 === 0 ? 'bg-gray-100' : ''
                        return (
                          <tr key={index} className={zebraStripe}>
                            <td className="py-2 pl-5">
                              <Link to={`/${siteShortUrl}/words/${asset.uid}`}>{asset['dc:title']}</Link>
                            </td>
                            <td className="py-2 pr-5">
                              <span>{asset?.['fv:definitions']?.[0].translation}</span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </>
              )}
            </div>
            <div className="sm:flex sm:px-3 sm:py-3">
              <dt className="text-base font-medium text-fv-charcoal-light sm:w-40 sm:flex-shrink-0 lg:w-48">
                Part of Speech
              </dt>
              <dd className="mt-1 text-base sm:mt-0 sm:ml-6 sm:col-span-2">{entry?.partOfSpeech}</dd>
            </div>
            <div className="sm:flex sm:px-3 sm:py-3">
              <dt className="text-base font-medium text-fv-charcoal-light sm:w-40 sm:flex-shrink-0 lg:w-48">
                Pronunciation
              </dt>
              <dd className="mt-1 text-base sm:mt-0 sm:ml-6 sm:col-span-2">{entry?.pronunciation}</dd>
            </div>
            <div className="sm:flex sm:px-3 sm:py-3">
              <dt className="text-base font-medium text-fv-charcoal-light sm:w-40 sm:flex-shrink-0 lg:w-48">
                Acknowledgement
              </dt>
              <dd className="mt-1 text-base sm:mt-0 sm:ml-6 sm:col-span-2">{entry?.acknowledgement}</dd>
            </div>
            <div className="sm:flex sm:px-3 sm:py-3">
              <dt className="text-base font-medium text-fv-charcoal-light sm:w-40 sm:flex-shrink-0 lg:w-48">
                Categories
              </dt>
              <dd className="mt-1 text-base sm:mt-0 sm:ml-6 sm:col-span-2">
                {entry?.categories?.length > 0
                  ? entry.categories.map((category) => (
                      <span
                        key={category.uid}
                        className="px-2 inline-flex text-sm leading-5 font-semibold rounded-full bg-fv-turquoise capitalize text-white"
                      >
                        {category['dc:title']}
                      </span>
                    ))
                  : null}
              </dd>
            </div>
          </div>
        </div>
        <div id="WordMedia" className="col-span-6 sm:col-span-2 p-5 sm:mt-12">
          {' '}
          {entry?.pictures
            ? entry.pictures.map((picture, index) => (
                <div
                  key={`${picture.uid}_${index}`}
                  className="inline-flex rounded-lg overflow-hidden border-4 border-white"
                >
                  <img
                    className="flex-shrink-0 w-40 lg:w-full"
                    src={getMediaUrl({ type: 'image', id: picture.uid, viewName: 'Medium' })}
                  />
                </div>
              ))
            : null}
          {entry?.videos
            ? entry.videos.map((video, index) => (
                <div
                  key={`${video.uid}_${index}`}
                  className="inline-flex rounded-lg overflow-hidden border-4 border-white"
                >
                  <video
                    className="flex-shrink-0 w-40 lg:w-full"
                    src={getMediaUrl({ type: 'video', id: video.uid, viewName: 'Small' })}
                    controls
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              ))
            : null}
        </div>
      </div>
    </section>
  )
}
// PROPTYPES
const { array, object, string } = PropTypes
WordPresentation.propTypes = {
  actions: array,
  entry: object,
  moreActions: array,
  siteShortUrl: string,
}

export default WordPresentation
