import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

//FPCC
import AudioMinimal from 'components/AudioMinimal'
import useIcon from 'common/useIcon'
import { makePlural } from 'common/urlHelpers'
import { getMediaUrl } from 'common/urlHelpers'
import Loading from 'components/Loading'

/**
 * @summary DictionaryListPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */

function DictionaryListPresentation({ actions, infiniteScroll, isLoading, items, siteShortUrl, wholeDomain }) {
  const typeColor = { word: 'fv-turquoise', phrase: 'fv-orange', song: 'fv-red', story: 'fv-purple' }
  const { isFetchingNextPage, fetchNextPage, hasNextPage, loadButtonLabel, loadButtonRef } = infiniteScroll

  return (
    <Loading.Container isLoading={isLoading}>
      {items?.pages !== undefined && items?.pages?.length > 0 ? (
        <div className="flex flex-col">
          <div className="py-2 align-middle inline-block min-w-full">
            <div className="shadow-md overflow-hidden border-b border-gray-300 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Entry
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Translation
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Type
                    </th>
                    {wholeDomain ? (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Language Site
                      </th>
                    ) : null}
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-300">
                  {items.pages.map((page, index) => (
                    <React.Fragment key={index}>
                      {page.results.map(({ id, title, translations, audio, type, parentDialect }) => (
                        <tr key={id}>
                          <td className="px-6 py-4 flex items-center">
                            <Link
                              className="font-medium text-gray-900 mr-2"
                              to={`/${parentDialect?.shortUrl ? parentDialect.shortUrl : siteShortUrl}/${makePlural(
                                type
                              )}/${id}`}
                            >
                              {title}
                            </Link>
                            {audio.length > 0
                              ? audio.map((audioId, i) => (
                                  <AudioMinimal.Container
                                    key={i}
                                    src={getMediaUrl({ id: audioId, type: 'audio' })}
                                    icons={{
                                      Play: useIcon(
                                        'Audio',
                                        'fill-current text-fv-blue-dark hover:text-fv-blue-light m-1 h-8 w-8 md:h-6 md:w-6'
                                      ),
                                      Pause: useIcon(
                                        'PauseCircle',
                                        'fill-current text-fv-blue-dark hover:text-fv-blue-light m-1 h-8 w-8 md:h-6 md:w-6'
                                      ),
                                      Error: useIcon(
                                        'TimesCircle',
                                        'fill-current text-fv-blue-dark hover:text-fv-blue-light m-1 h-8 w-8 md:h-6 md:w-6'
                                      ),
                                    }}
                                  />
                                ))
                              : null}
                          </td>
                          <td className="px-6 py-4">
                            {translations ? (
                              <ol className="text-gray-900">
                                {translations.map((translation, i) => (
                                  <li key={i}>
                                    {translations.length > 1 ? `${i + 1}. ` : null} {translation}
                                  </li>
                                ))}
                              </ol>
                            ) : null}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${typeColor[type]} capitalize text-white`}
                            >
                              {type}
                            </span>
                          </td>
                          {wholeDomain ? (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <Link to={`/${parentDialect.shortUrl}`}>{parentDialect.name}</Link>
                            </td>
                          ) : null}
                          {/* Action buttons */}
                          {actions.map(({ actionTitle, iconName, clickHandler, confirmationMessage }, toolIndex) => (
                            <td key={toolIndex} className=" px-6 pt-4 text-right">
                              <button
                                className="relative text-fv-blue-dark hover:text-fv-blue-light"
                                onClick={() => clickHandler(title, id)}
                              >
                                <span className="sr-only">{actionTitle}</span>
                                {useIcon(iconName, 'fill-current h-8 w-8 md:h-6 md:w-6')}
                                <span id={`${actionTitle}-message-${id}`} className="hidden">
                                  <div className="absolute bottom-0 right-0 w-auto p-1 text-sm bg-fv-blue-dark text-white text-center rounded-lg shadow-lg ">
                                    {confirmationMessage}
                                  </div>
                                </span>
                              </button>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
              <div>
                <button
                  ref={loadButtonRef}
                  className={
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-fv-blue capitalize text-white'
                  }
                  onClick={() => fetchNextPage()}
                  disabled={!hasNextPage || isFetchingNextPage}
                >
                  {loadButtonLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="m-5 md:mx-20 md:my-10">Sorry, no results were found for this search.</div>
      )}
    </Loading.Container>
  )
}

// PROPTYPES
const { arrayOf, bool, func, object, shape, string } = PropTypes
DictionaryListPresentation.propTypes = {
  actions: arrayOf(
    shape({
      actionTitle: string,
      iconName: string,
      clickHandler: func,
      confirmationMessage: string,
    })
  ),
  infiniteScroll: object,
  isLoading: bool,
  items: object,
  siteShortUrl: string,
  wholeDomain: bool,
}

DictionaryListPresentation.defaultProps = {
  wholeDomain: false,
  actions: [],
}

export default DictionaryListPresentation
