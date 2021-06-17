import React from 'react'
// import PropTypes from 'prop-types'
import JoinPresentation from 'components/Join/JoinPresentation'
import JoinData from 'components/Join/JoinData'

/**
 * @summary JoinContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function JoinContainer() {
  return (
    <JoinData>
      {({ fvUserFields, fvUserOptions, formRef, formValue, onRequestSaveForm, requestedSiteTitle, serverResponse }) => {
        return (
          <div>
            <JoinPresentation
              fvUserFields={fvUserFields}
              fvUserOptions={fvUserOptions}
              formRef={formRef}
              formValue={formValue}
              onRequestSaveForm={onRequestSaveForm}
              requestedSiteTitle={requestedSiteTitle}
              serverResponse={serverResponse}
            />
          </div>
        )
      }}
    </JoinData>
  )
}
// PROPTYPES
// const { string } = PropTypes
JoinContainer.propTypes = {
  //   something: string,
}

export default JoinContainer
