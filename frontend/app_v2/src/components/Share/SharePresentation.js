import React from 'react'
import useIcon from 'common/useIcon'
import PropTypes from 'prop-types'
/**
 * @summary SharePresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function SharePresentation({ url, title }) {
  return (
    <div>
      <ul className="flex wrap align-center">
        {navigator.share ? (
          <li>
            <button
              onClick={() =>
                navigator.share({
                  title: title,
                  url: url,
                })
              }
            >
              {useIcon('WebShare', 'fill-current h-8 w-8')}
            </button>
          </li>
        ) : null}
        <li>
          <a href={`https://twitter.com/intent/tweet?url=${url}&text=${title}`}>
            {useIcon('Twitter', 'fill-current h-8 w-8')}
          </a>
        </li>
        <li>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}>
            {useIcon('Facebook', 'fill-current h-8 w-8')}
          </a>
        </li>
        <li>
          <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`}>
            {useIcon('LinkedIn', 'fill-current h-8 w-8')}
          </a>
        </li>
        <li>
          <a href={`mailto:?subject=${title}&body=${url}`}>{useIcon('Mail', 'fill-current h-8 w-8')}</a>
        </li>
      </ul>
    </div>
  )
}
// PROPTYPES
const { string } = PropTypes
SharePresentation.propTypes = {
  url: string,
  title: string,
}

export default SharePresentation
