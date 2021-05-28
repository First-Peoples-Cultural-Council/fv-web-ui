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
        isLoggedIn,
        onRequestSaveForm,
        requestedSiteTitle,
        requestedSite,
        serverResponse,
      }) => {
        return (
          <PromiseWrapper renderOnError computeEntities={computeEntities}>
            <JoinPresentation
              fvUserFields={fvUserFields}
              fvUserOptions={fvUserOptions}
              formRef={formRef}
              formValue={formValue}
              isLoggedIn={isLoggedIn}
              onRequestSaveForm={onRequestSaveForm}
              requestedSiteTitle={requestedSiteTitle}
              requestedSite={requestedSite}
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
