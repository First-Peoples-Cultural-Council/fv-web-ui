import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import AudioMinimal from 'components/AudioMinimal'
import useIcon from 'common/useIcon'

/**
 * @summary DictionaryListPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function DictionaryListPresentation({ error, isLoading, items, wholeDomain, actions }) {
  const typeColor = { word: 'fv-turquoise', phrase: 'fv-orange', song: 'fv-red', story: 'fv-purple' }
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
      <div className="p-10">
        <h1>Sorry, something went wrong!</h1>
        <p>Please report this error by emailing hello@firstvoices.com so that we can fix it.</p>
        <p>Include the link or action you took to get to this page.</p>
        <p>Thank You!</p>
      </div>
    )
  }
  if (items === undefined || items?.length === 0) {
    return <div className="m-5 md:mx-20 md:my-10">Sorry, no results were found for this search.</div>
  }

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
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
                    <td className="px-6 py-4 align-center">
                      <Link className="font-medium text-gray-900" to={`/${parentDialect.name}/${type}/${id}`}>
                        {title}
                      </Link>
                      {audio[0] ? (
                        <AudioMinimal.Container
                          src={audio[0]}
                          icons={{
                            Play: useIcon('Audio', 'fill-current h-6 w-6 sm:w-8 sm:h-8'),
                            Pause: useIcon('PauseCircle', 'fill-current h-6 w-6 sm:w-8 sm:h-8'),
                            Error: useIcon('TimesCircle', 'fill-current h-6 w-6 sm:w-8 sm:h-8'),
                          }}
                        />
                      ) : null}
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
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${typeColor[type]} text-white`}
                      >
                        {type}
                      </span>
                    </td>
                    {wholeDomain ? (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{parentDialect.name}</td>
                    ) : null}
                    {/* Action buttons */}
                    {actions.map(({ actionTitle, iconName, clickHandler, confirmationMessage }, toolIndex) => (
                      <td key={toolIndex} className=" px-6 pt-4 text-right">
                        <button
                          className="relative text-fv-blue-dark hover:text-fv-blue-light"
                          onClick={() => clickHandler(title)}
                        >
                          <span className="sr-only">{actionTitle}</span>
                          {useIcon(iconName, 'fill-current w-7 h-7')}
                          <span id={`${actionTitle}-message-${title}`} className="hidden">
                            <div className="absolute bottom-0 right-0 w-auto p-1 text-sm bg-fv-blue-dark text-white text-center rounded-lg shadow-lg ">
                              {confirmationMessage}
                            </div>
                          </span>
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

// PROPTYPES
const { array, arrayOf, bool, func, object, shape, string } = PropTypes
DictionaryListPresentation.propTypes = {
  actions: arrayOf(
    shape({
      actionTitle: string,
      iconName: string,
      clickHandler: func,
      confirmationMessage: string,
    })
  ),
  error: object,
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
  wholeDomain: bool,
}

DictionaryListPresentation.defaultProps = {
  wholeDomain: false,
  actions: [],
}

export default DictionaryListPresentation
