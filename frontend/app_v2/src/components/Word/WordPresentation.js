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
  const metaDataTitleStyling = 'text-left font-semibold text-xs uppercase text-fv-charcoal sm:w-40 sm:flex-shrink-0'
  const metaDataContentStyling = 'mt-1 text-sm sm:mt-0 sm:ml-6 sm:col-span-2'
  const noMedia = entry?.pictures?.length < 1 || entry?.videos?.length < 1 ? true : false
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white" data-testid="WordPresentation">
      <div className="grid grid-cols-8 gap-4">
        <div id="WordDetails" className={`col-span-8 md:col-span-5 ${noMedia ? 'md:col-start-3' : ''}`}>
          <div className="flow-root">
            <div className="w-full sm:flex items-center mt-2 md:mt-10 px-6">
              <h3 className="md:inline-flex font-bold text-xl md:text-2xl">{entry.title}</h3>
              <div className="md:inline-flex py-2 md:py-0 md:ml-2 items-center">
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
          {/* Audio */}
          <div className="px-4 pb-2 sm:px-0 sm:py-0">
            {entry?.audio.length > 0 && (
              <div className="sm:flex sm:px-5 sm:py-5">
                {entry.audio.map((audioFile, index) => (
                  <AudioNative.Container
                    key={`${audioFile.uid}_${index}`}
                    className="w-full md:w-2/5 text-black"
                    src={getMediaUrl({ type: 'audio', id: audioFile.uid })}
                  />
                ))}
              </div>
            )}
            {/* Translations/Definitions */}
            {entry?.translations?.length > 0 && (
              <div className="p-3">
                <h4 className="text-left font-semibold text-sm uppercase text-fv-charcoal">
                  {entry?.translations[0].language} translation
                </h4>
                <ol className="list-decimal mx-8">
                  {entry?.translations.map((translation, index) => (
                    <li key={index} className="p-0.5">
                      {translation.translation}
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {/* Literal Translations */}
            {entry?.literalTranslations?.length > 0 && (
              <div className="p-3">
                <h4 className="text-left font-semibold text-sm uppercase text-fv-charcoal">Literal translation</h4>
                <ol className="list-decimal mx-8">
                  {entry?.literalTranslations.map((translation, index) => (
                    <li key={index} className="p-0.5">
                      {translation.translation}
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {/* Related Phrases */}
            {entry?.relatedPhrases?.length > 0 && (
              <div className="sm:flex p-3">
                <table className="w-full">
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
                  <tbody>
                    {entry.relatedPhrases.map((phrase, index) => {
                      const zebraStripe = index % 2 === 0 ? 'bg-gray-100' : ''
                      return (
                        <tr key={index} className={zebraStripe}>
                          <td className="py-2 pl-5 pr-2">
                            <Link to={`/${siteShortUrl}/phrases/${phrase.uid}`}>{phrase['dc:title']}</Link>
                          </td>
                          <td className="py-2 pr-5 pl-2">
                            <span>{phrase?.['fv:definitions']?.[0].translation}</span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
            {/* Related Words */}
            {entry?.relatedAssets?.length > 0 && (
              <div className="sm:flex p-3">
                <table className="w-full">
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
              </div>
            )}
            {/* Categories */}
            {entry?.categories?.length > 0 && (
              <div className="p-3">
                <h4 className="text-left font-semibold text-lg uppercase text-fv-charcoal">Categories</h4>
                <div>
                  {entry.categories.map((category, i) => (
                    <div
                      key={category.uid}
                      className={`${
                        i === 0 ? 'ml-0' : ''
                      } m-1 p-1.5 inline-flex text-sm font-semibold rounded-md bg-fv-turquoise text-white`}
                    >
                      {category['dc:title']}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Metadata */}
            <section className="my-5">
              {entry?.partOfSpeech && (
                <div className="sm:flex p-2">
                  <dt className={metaDataTitleStyling}>Part of Speech</dt>
                  <dd className={metaDataContentStyling}>{entry?.partOfSpeech}</dd>
                </div>
              )}
              {entry?.pronunciation && (
                <div className="sm:flex p-2">
                  <dt className={metaDataTitleStyling}>Pronunciation</dt>
                  <dd className={metaDataContentStyling}>{entry?.pronunciation}</dd>
                </div>
              )}
              {entry?.culturalNotes && (
                <div className="sm:flex p-2">
                  <dt className={metaDataTitleStyling}>Cultural notes:</dt>
                  {entry.culturalNotes.map((note, i) => (
                    <dd key={i} className={metaDataContentStyling}>
                      {note}
                    </dd>
                  ))}
                </div>
              )}
              {entry?.generalNote && (
                <div className="sm:flex p-2">
                  <dt className={metaDataTitleStyling}>General note</dt>
                  <dd className={metaDataContentStyling} dangerouslySetInnerHTML={{ __html: entry?.generalNote }} />
                </div>
              )}
              {entry?.acknowledgement && (
                <div className="sm:flex p-2">
                  <dt className={metaDataTitleStyling}>Acknowledgement</dt>
                  <dd className={metaDataContentStyling}>{entry?.acknowledgement}</dd>
                </div>
              )}
              {entry?.reference && (
                <div className="sm:flex p-2">
                  <dt className={metaDataTitleStyling}>Reference:</dt>
                  <dd className={metaDataContentStyling}>{entry?.reference}</dd>
                </div>
              )}
              {entry?.sources && (
                <div className="sm:flex p-2">
                  <dt className={metaDataTitleStyling}>Sources:</dt>
                  {entry.sources.map((source) => (
                    <dd key={source.uid} className={metaDataContentStyling}>
                      {source?.['dc:title']}
                    </dd>
                  ))}
                </div>
              )}
              {entry?.created && (
                <div className="sm:flex p-2">
                  <dt className={metaDataTitleStyling}>Added to FirstVoices:</dt>
                  <dd className={metaDataContentStyling}>{entry?.created}</dd>
                </div>
              )}
              {entry?.modified && (
                <div className="sm:flex p-2">
                  <dt className={metaDataTitleStyling}>Last modified:</dt>
                  <dd className={metaDataContentStyling}>{entry?.modified}</dd>
                </div>
              )}
              {entry?.version && (
                <div className="sm:flex p-2">
                  <dt className={metaDataTitleStyling}>version:</dt>
                  <dd className={metaDataContentStyling}>{entry?.version}</dd>
                </div>
              )}
            </section>
          </div>
        </div>
        {/* Pictures and Video */}
        {noMedia ? null : (
          <div id="WordMedia" className="col-span-8 md:col-span-3 p-5 md:mt-12">
            <ul>
              {entry?.pictures
                ? entry.pictures.map((picture, index) => (
                    <li key={`${picture.uid}_${index}`} className="my-2">
                      <div className="inline-flex rounded-lg overflow-hidden">
                        <img
                          className="flex-shrink-0 w-40 h-auto lg:w-full"
                          src={getMediaUrl({ type: 'gifOrImg', id: picture.uid })}
                        />
                      </div>
                      <p className="ml-4 inline-flex text-sm font-medium text-gray-900 truncate">
                        {picture?.['dc:title']}
                      </p>
                      <p className="ml-2 inline-flex text-sm font-medium text-gray-500">
                        - {picture?.['dc:description']}
                      </p>
                    </li>
                  ))
                : null}
              {entry?.videos
                ? entry.videos.map((video, index) => (
                    <li key={`${video.uid}_${index}`} className="my-2">
                      <div className="inline-flex rounded-lg overflow-hidden">
                        <video
                          className="flex-shrink-0 w-40 lg:w-full"
                          src={getMediaUrl({ type: 'video', id: video.uid, viewName: 'Small' })}
                          controls
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                      <p className="ml-4 inline-flex text-sm font-medium text-gray-900 truncate">
                        {video?.['dc:title']}
                      </p>
                      <p className="ml-2 inline-flex text-sm font-medium text-gray-500">
                        - {video?.['dc:description']}
                      </p>
                    </li>
                  ))
                : null}
            </ul>
          </div>
        )}
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
