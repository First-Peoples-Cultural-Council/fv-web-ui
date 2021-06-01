import React from 'react'
// import PropTypes from 'prop-types'
import JoinPresentation from 'components/Join/JoinPresentation'
import JoinData from 'components/Join/JoinData'
import PromiseWrapper from 'components/PromiseWrapper'

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
      {({
        computeEntities,
        fvUserFields,
        fvUserOptions,
        formRef,
        formValue,
        onRequestSaveForm,
        requestedSiteTitle,
        serverResponse,
      }) => {
        return (
          <PromiseWrapper renderOnError computeEntities={computeEntities}>
            <JoinPresentation
              fvUserFields={fvUserFields}
              fvUserOptions={fvUserOptions}
              formRef={formRef}
              formValue={formValue}
              onRequestSaveForm={onRequestSaveForm}
              requestedSiteTitle={requestedSiteTitle}
              serverResponse={serverResponse}
            />
          </PromiseWrapper>
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
