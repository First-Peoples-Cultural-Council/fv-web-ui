import React from 'react'
// import PropTypes from 'prop-types'
import RegisterPresentation from 'components/Register/RegisterPresentation'
import RegisterData from 'components/Register/RegisterData'
import PromiseWrapper from 'components/PromiseWrapper'

/**
 * @summary RegisterContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function RegisterContainer() {
  return (
    <RegisterData>
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
            <RegisterPresentation
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
    </RegisterData>
  )
}
// PROPTYPES
// const { string } = PropTypes
RegisterContainer.propTypes = {
  //   something: string,
}

export default RegisterContainer
