import React, { useState } from 'react'
import PropTypes from 'prop-types'

// FPCC
import useIcon from 'common/useIcon'

/**
 * @summary Copy
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */

function Copy({ docId, docTitle, withLabels, withConfirmation, withTooltip }) {
  const [confirmation, setConfirmation] = useState(false)
  function clickCopyHandler() {
    // Create new element
    const el = document.createElement('textarea')
    // Set value (string to be copied)
    el.value = docTitle
    // Set non-editable to avoid focus and move outside of view
    el.setAttribute('readonly', '')
    el.style = { position: 'absolute', left: '-9999px' }
    document.body.appendChild(el)
    // Select text inside element
    el.select()
    // Copy text to clipboard
    document.execCommand('copy')
    // Remove temporary element
    document.body.removeChild(el)
    //Set tooltip confirmation with timeout
    if (withConfirmation) {
      setConfirmation(true)
      setTimeout(function timeout() {
        setConfirmation(false)
      }, 1000)
    }
  }
  return (
    <button
      id="CopyAction"
      className="relative inline-flex items-center p-2 text-sm font-medium text-fv-charcoal-light hover:text-fv-charcoal"
      onClick={() => clickCopyHandler()}
    >
      <span className="sr-only">Copy</span>
      {useIcon('Copy', 'fill-current h-8 w-8 md:h-6 md:w-6')}
      {withLabels ? (
        <>
          <span className="ml-2 font-semibold uppercase text-fv-charcoal-light">Copy</span>
          <span id={`copy-message-${docId}`} className={confirmation ? '' : 'hidden'}>
            <span className="absolute bottom-2 right-0 font-semibold uppercase bg-white text-fv-charcoal-light">
              Copied
            </span>
          </span>
        </>
      ) : null}
      {withTooltip ? (
        <>
          <span id={`copy-message-${docId}`} className={confirmation ? '' : 'hidden'}>
            <div className="absolute bottom-1 -right-1 w-auto p-1 text-sm bg-fv-charcoal-light text-white text-center rounded-lg shadow-lg ">
              Copied
            </div>
          </span>
        </>
      ) : null}
    </button>
  )
}
// PROPTYPES
const { bool, string } = PropTypes
Copy.propTypes = {
  docId: string,
  docTitle: string,
  withLabels: bool,
  withConfirmation: bool,
  withTooltip: bool,
}

export default Copy
