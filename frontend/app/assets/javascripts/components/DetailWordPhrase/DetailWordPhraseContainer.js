import React from 'react'
// import PropTypes from 'prop-types'
import DetailWordPhrasePresentation from 'components/DetailWordPhrase/DetailWordPhrasePresentation'
import DetailWordPhraseData from 'components/DetailWordPhrase/DetailWordPhraseData'

/**
 * @summary DetailWordPhraseContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function DetailWordPhraseContainer() {
  return (
    <DetailWordPhraseData>
      {(DetailWordPhraseDataOutput) => {
        // TODO FW-DetailWordPhrase
        // eslint-disable-next-line
        console.log('DetailWordPhraseDataOutput', DetailWordPhraseDataOutput)
        return <DetailWordPhrasePresentation />
      }}
    </DetailWordPhraseData>
  )
}
// PROPTYPES
// const { string } = PropTypes
DetailWordPhraseContainer.propTypes = {
  //   something: string,
}

export default DetailWordPhraseContainer
