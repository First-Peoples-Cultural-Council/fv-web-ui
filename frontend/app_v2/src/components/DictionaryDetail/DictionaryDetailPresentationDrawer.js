import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

// FPCC
import { getMediaUrl } from 'common/urlHelpers'
import useIcon from 'common/useIcon'
import AudioMinimal from 'components/AudioMinimal'
import ActionsMenu from 'components/ActionsMenu'
/**
 * @summary DictionaryDetailPresentationDrawer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function DictionaryDetailPresentationDrawer({ actions, moreActions, entry, sitename }) {
  const metaDataLableStyling = 'text-sm font-semibold uppercase text-fv-charcoal sm:w-40 sm:flex-shrink-0'
  const metaDataContentStyling = 'text-sm text-black sm:mt-0 sm:ml-6'
  const noMedia = entry?.pictures?.length < 1 || entry?.videos?.length < 1 ? true : false
  const shortTitle = entry?.title.length < 20
  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 md:mt-10 bg-white"
      data-testid="DictionaryDetailPresentationDrawer"
    >
      <div>
        <div id="WordDetails">
          <section>
            <div className="ml-3 md:flex items-top">
              <span className={`font-bold ${shortTitle ? 'text-2xl md:text-4xl' : 'text-xl md:text-2xl'}`}>
                {entry.title}
              </span>
              <div className="mt-1 ml-4">
                <ActionsMenu.Container
                  docId={entry.id}
                  docTitle={entry.title}
                  docType={entry.type}
                  actions={actions}
                  moreActions={moreActions}
                  withLabels
                  withConfirmation
                />
              </div>
            </div>

            <div className="ml-5">
              {/* Translations/Definitions */}
              {entry?.translations?.length > 0 && (
                <div className="px-3 mt-2">
                  <ol className="list-decimal">
                    {entry?.translations.map((translation, index) => (
                      <li key={index} className="p-0.5">
                        {translation.translation}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              {/* Literal Translations - WORD ONLY */}
              {entry?.literalTranslations?.length > 0 && (
                <div className="px-3 mt-2">
                  <h4 className="text-left font-semibold text-sm uppercase text-fv-charcoal">Literal translation</h4>
                  <ol className="list-decimal">
                    {entry?.literalTranslations.map((translation, index) => (
                      <li key={index} className="p-0.5">
                        {translation.translation}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
            {/* Audio */}
            {entry?.audio.length > 0 && (
              <div className="my-2 ml-3 text-fv-charcoal">
                {entry.audio.map((audioFile, index) => (
                  <AudioMinimal.Container
                    key={`${audioFile.uid}_${index}`}
                    icons={{
                      Play: useIcon('Play', 'fill-current h-6 w-6 md:w-4 md:h-4 mr-2'),
                      Pause: useIcon('Pause', 'fill-current h-6 w-6 md:w-4 md:h-4 mr-2'),
                      Error: useIcon('Exclamation', 'fill-current h-6 w-6 md:w-4 md:h-4 mr-2'),
                    }}
                    buttonStyling="bg-fv-charcoal-light text-white text-sm rounded-lg inline-flex items-center py-1.5 px-2 mr-2 mb-2"
                    label={audioFile.speaker}
                    src={getMediaUrl({ type: 'audio', id: audioFile.uid })}
                  />
                ))}
              </div>
            )}
          </section>

          <section>
            {/* Related Phrases */}
            {entry?.relatedPhrases?.length > 0 && (
              <div className="sm:flex p-2">
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
                            <Link to={`/${sitename}/phrases/${phrase.uid}`}>{phrase['dc:title']}</Link>
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
              <div className="sm:flex p-2">
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
                            <Link to={`/${sitename}/words/${asset.uid}`}>{asset['dc:title']}</Link>
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
                    <Link
                      key={category.uid}
                      to={`/${sitename}/categories/${category.uid}`}
                      className={`${
                        i === 0 ? 'ml-0' : ''
                      } m-1 p-1.5 inline-flex text-sm font-semibold rounded-lg bg-tertiaryA text-white`}
                    >
                      {category['dc:title']}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Pictures and Video */}
          {noMedia ? null : (
            <div id="WordMedia">
              <ul className="inline-flex">
                {entry?.pictures
                  ? entry.pictures.map((picture, index) => (
                      <li key={`${picture.uid}_${index}`} className="m-2">
                        <div className="inline-flex rounded-lg overflow-hidden">
                          <img
                            className="flex-shrink-0 w-full h-auto"
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
                      <li key={`${video.uid}_${index}`} className="m-2">
                        <div className="inline-flex rounded-lg overflow-hidden">
                          <video
                            className="flex-shrink-0 w-full"
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
          {/* Metadata */}
          <section className="p-3 mt-2">
            <h4 className="text-left mb-2 font-semibold text-lg uppercase text-fv-charcoal">Metadata</h4>
            {entry?.partOfSpeech && (
              <div className="sm:flex py-2">
                <dt className={metaDataLableStyling}>Part of Speech</dt>
                <dd className={metaDataContentStyling}>{entry?.partOfSpeech}</dd>
              </div>
            )}
            {entry?.pronunciation && (
              <div className="sm:flex py-2">
                <dt className={metaDataLableStyling}>Pronunciation</dt>
                <dd className={metaDataContentStyling}>{entry?.pronunciation}</dd>
              </div>
            )}
            {entry?.culturalNotes && (
              <div className="sm:flex py-2">
                <dt className={metaDataLableStyling}>Cultural notes</dt>
                {entry.culturalNotes.map((note, i) => (
                  <dd key={i} className={metaDataContentStyling}>
                    {note}
                  </dd>
                ))}
              </div>
            )}
            {entry?.generalNote && (
              <div className="sm:flex py-2">
                <dt className={metaDataLableStyling}>Notes</dt>
                <dd className={metaDataContentStyling} dangerouslySetInnerHTML={{ __html: entry?.generalNote }} />
              </div>
            )}
            {entry?.acknowledgement && (
              <div className="sm:flex py-2">
                <dt className={metaDataLableStyling}>Acknowledgement</dt>
                <dd className={metaDataContentStyling}>{entry?.acknowledgement}</dd>
              </div>
            )}
            {entry?.reference && (
              <div className="sm:flex py-2">
                <dt className={metaDataLableStyling}>Reference</dt>
                <dd className={metaDataContentStyling}>{entry?.reference}</dd>
              </div>
            )}
            {entry?.sources && (
              <div className="sm:flex py-2">
                <dt className={metaDataLableStyling}>Sources</dt>
                {entry.sources.map((source) => (
                  <dd key={source.uid} className={metaDataContentStyling}>
                    {source?.['dc:title']}
                  </dd>
                ))}
              </div>
            )}
            {entry?.created && (
              <div className="sm:flex py-2">
                <dt className={metaDataLableStyling}>Date added</dt>
                <dd className={metaDataContentStyling}>{entry?.created}</dd>
              </div>
            )}
            {entry?.modified && (
              <div className="sm:flex py-2">
                <dt className={metaDataLableStyling}>Last modified</dt>
                <dd className={metaDataContentStyling}>{entry?.modified}</dd>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
// PROPTYPES
const { array, object, string } = PropTypes
DictionaryDetailPresentationDrawer.propTypes = {
  actions: array,
  entry: object,
  moreActions: array,
  sitename: string,
}

export default DictionaryDetailPresentationDrawer
