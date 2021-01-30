import React from 'react'
import PropTypes from 'prop-types'
import SharePresentation from 'components/Share/SharePresentation'
import ShareData from 'components/Share/ShareData'

/**
 * @summary ShareContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function ShareContainer({ url, title }) {
  return (
    <ShareData>
      {() => {
        return <SharePresentation url={url} title={title} />
      }}
    </ShareData>
  )
}
// PROPTYPES
const { string } = PropTypes
ShareContainer.propTypes = {
  url: string,
  title: string,
}

export default ShareContainer
