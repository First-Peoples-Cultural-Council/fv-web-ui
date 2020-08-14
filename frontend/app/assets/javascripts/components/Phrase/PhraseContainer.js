import React from 'react'
// import PropTypes from 'prop-types'
import PhrasePresentation from 'components/Phrase/PhrasePresentation'
import PhraseData from 'components/Phrase/PhraseData'

/**
 * @summary PhraseContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function PhraseContainer() {
  return (
    <PhraseData>
      {(PhraseDataOutput) => {
        // TODO FW-Phrase
        // eslint-disable-next-line
        console.log('PhraseDataOutput', PhraseDataOutput)
        return <PhrasePresentation />
      }}
    </PhraseData>
  )
}
// PROPTYPES
// const { string } = PropTypes
PhraseContainer.propTypes = {
  //   something: string,
}

export default PhraseContainer
