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
function DictionaryListPresentation({ items, wholeDomain, actions }) {
  const typeColor = { FVWord: 'fv-turquoise', FVPhrase: 'fv-orange', FVBook: 'fv-red', story: 'fv-purple' }

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
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
                    <th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Language Site
                      </th>
                    </th>
                  ) : null}
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map(({ id, title, path, translations, audio, type, sitename }, index) => (
                  <tr key={id + index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4 mr-2">
                          <Link className="text-sm font-medium text-gray-900" to={path}>
                            {title}
                          </Link>
                        </div>
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
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{translations?.translation}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {' '}
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${typeColor[type]} text-white`}
                      >
                        {type}
                      </span>
                    </td>
                    {wholeDomain ? (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sitename}</td>
                    ) : null}
                    {/* Action buttons */}
                    {actions.map(({ actionTitle, iconName, clickHandler, confirmationMessage }, toolIndex) => (
                      <td key={toolIndex} className=" px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          className="relative text-fv-blue hover:text-fv-blue-dark"
                          onClick={() => clickHandler(title)}
                        >
                          <span className="sr-only">{actionTitle}</span>
                          {useIcon(iconName, 'fill-current w-6 h-6')}
                          <span id={`${actionTitle}-message-${title}`} className="hidden">
                            <div className="absolute bottom-0 right-0 w-auto p-1 text-xs bg-fv-purple text-white text-center rounded-lg shadow-lg ">
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
const { array, bool, func, shape, arrayOf, string } = PropTypes
DictionaryListPresentation.propTypes = {
  wholeDomain: bool,
  items: array,
  actions: arrayOf(
    shape({
      actionTitle: string,
      iconName: string,
      clickHandler: func,
      confirmationMessage: string,
    })
  ),
}

DictionaryListPresentation.defaultProps = {
  wholeDomain: false,
  actions: [],
}

export default DictionaryListPresentation
