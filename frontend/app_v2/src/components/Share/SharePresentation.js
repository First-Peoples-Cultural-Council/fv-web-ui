import React from 'react'
import useIcon from 'common/useIcon'
import PropTypes from 'prop-types'
/**
 * @summary SharePresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function SharePresentation({ url, title }) {
  return (
    <ul className="flex align-center justify-center">
      {navigator.share ? (
        <li>
          <button
            className="my-2 mx-1 h-9 w-9 inline-flex items-center align-center justify-center rounded text-white bg-fv-purple"
            onClick={() =>
              navigator.share({
                title: title,
                url: url,
              })
            }
          >
            {useIcon('WebShare', 'fill-current h-7 w-7')}
          </button>
        </li>
      ) : null}
      <li>
        <a
          className="my-2 mx-1 h-9 w-9 inline-flex align-center justify-center rounded text-blue-300"
          href={`https://twitter.com/intent/tweet?url=${url}&text=${title}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {useIcon('Twitter', 'fill-current h-9 w-9')}
        </a>
      </li>
      <li>
        <a
          className="my-2 mx-1 h-9 w-9 inline-flex items-center align-center justify-center rounded text-blue-900"
          href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {useIcon('Facebook', 'fill-current h-9 w-9')}
        </a>
      </li>
      <li>
        <a
          className="my-2 mx-1 h-9 w-9 inline-flex items-center align-center justify-center rounded text-blue-700"
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {useIcon('LinkedIn', 'fill-current h-9 w-9')}
        </a>
      </li>
      <li>
        <a
          className="my-2 mx-1 h-9 w-9 inline-flex items-center align-center justify-center rounded text-white bg-fv-red"
          href={`mailto:?subject=${title}&body=${url}`}
        >
          {useIcon('Mail', 'fill-current h-7 w-7')}
        </a>
      </li>
    </ul>
  )
}
// PROPTYPES
const { string } = PropTypes
SharePresentation.propTypes = {
  url: string,
  title: string,
}

export default SharePresentation
