import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

//FPCC
import AudioMinimal from 'components/AudioMinimal'
import useIcon from 'common/useIcon'
import { makePlural } from 'common/urlHelpers'
import { getMediaUrl } from 'common/urlHelpers'
import ActionsMenu from 'components/ActionsMenu'
import Loading from 'components/Loading'

/**
 * @summary DictionaryListPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function DictionaryListPresentation({ actions, isLoading, items, moreActions, sitename, wholeDomain }) {
  return (
    <Loading.Container isLoading={isLoading}>
      {items !== undefined && items?.length > 0 ? (
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
                  {items.map(({ id, title, translations, audio, type, parentDialect }, index) => (
                    <tr key={id + index}>
                      <td className="px-6 py-4 flex items-center">
                        <Link
                          className="font-medium text-gray-900 mr-2"
                          to={`/${parentDialect?.shortUrl ? parentDialect.shortUrl : sitename}/${makePlural(
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
                                    'fill-current text-fv-charcoal-light hover:text-fv-charcoal m-1 h-8 w-8 md:h-6 md:w-6'
                                  ),
                                  Pause: useIcon(
                                    'PauseCircle',
                                    'fill-current text-fv-charcoal-light hover:text-fv-charcoal m-1 h-8 w-8 md:h-6 md:w-6'
                                  ),
                                  Error: useIcon(
                                    'TimesCircle',
                                    'fill-current text-fv-charcoal-light hover:text-fv-charcoal m-1 h-8 w-8 md:h-6 md:w-6'
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
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${type} capitalize text-white`}
                        >
                          {type}
                        </span>
                      </td>
                      {wholeDomain ? (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <Link to={`/${parentDialect.shortUrl}`}>{parentDialect.name}</Link>
                        </td>
                      ) : null}
                      <td className="text-right px-6">
                        <ActionsMenu.Container
                          docId={id}
                          docTitle={title}
                          docType={type}
                          actions={actions}
                          moreActions={moreActions}
                          withConfirmation
                          withTooltip
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
const { array, arrayOf, bool, shape, string } = PropTypes
DictionaryListPresentation.propTypes = {
  actions: array,
  isLoading: bool,
  items: arrayOf(
    shape({
      id: string,
      title: string,
      path: string,
      translations: array,
      audio: array,
      type: string,
      sitename: string,
    })
  ),
  moreActions: array,
  sitename: string,
  wholeDomain: bool,
}

DictionaryListPresentation.defaultProps = {
  wholeDomain: false,
  actions: [],
  moreActions: [],
}

export default DictionaryListPresentation
