import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import AudioMinimal from 'components/AudioMinimal'

/**
 * @summary SearchListLargeScreen
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function SearchListLargeScreen({ items }) {
  return (
    <div className="p-2">
      <table>
        <thead>
          <tr className="bg-gray-300 text-lg text-bold text-left">
            <th>
              <div className="p-5">Entry</div>
            </th>
            <th>
              <div className="p-5">Translation</div>
            </th>
            <th>
              <div className="p-5">Audio</div>
            </th>
            <th>
              <div className="p-5">Type</div>
            </th>
            <th>
              <div className="p-5">Language Site</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map(({ id, title, path, translations, audio, type, sitename }, index) => (
            <tr key={id} className={`border-b-2 border-dotted ${index % 2 ? 'bg-gray-300' : 'bg-white'}`}>
              <td component="th" scope="row">
                <Link className="p-5 text-lg" to={path}>
                  {title}
                </Link>
              </td>
              <td className="p-5">{translations?.translation}</td>
              <td className="p-5">
                {audio[0] ? (
                  <AudioMinimal.Container
                    className="p-5"
                    iconStyling="fill-current h-6 w-6 sm:w-8 sm:h-8"
                    src={audio[0]}
                  />
                ) : null}
              </td>
              <td className="p-5">{type}</td>
              <td className="p-5">{sitename ? sitename : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
// PROPTYPES
const { array, bool, object } = PropTypes
SearchListLargeScreen.propTypes = {
  intl: object,
  isDialect: bool,
  items: array,
}

export default SearchListLargeScreen
