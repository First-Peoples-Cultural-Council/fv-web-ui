import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import t from 'tcomb-form'

import FVButton from 'components/FVButton'
import FVLabel from 'components/FVLabel'
import Link from 'components/Link'
/**
 * @summary RegisterPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function RegisterPresentation({
  fvUserFields,
  fvUserOptions,
  formRef,
  formValue,
  isLoggedIn,
  onRequestSaveForm,
  requestedSiteTitle,
  requestedSite,
  serverResponse,
}) {
  // Show success message
  let serverErrorMessage = ''
  if (serverResponse) {
    switch (serverResponse?.status) {
      case 400:
        serverErrorMessage = (
          <div className={classNames('alert', 'alert-danger')} role="alert">
            {serverResponse?.message}
          </div>
        )
        break

      case 200:
        return (
          <div className="row" style={{ marginTop: '15px' }}>
            <div className={classNames('col-xs-12')}>
              <h1>Thank you for your registration!</h1>
              <p>
                You should receive a confirmation email from us shortly asking you to validate your email address and
                create a password.
              </p>
              <p>
                If you do not see the email in a few minutes, please confirm it is not in your SPAM folder or contact us
                for support.
              </p>
              <p>
                Go to our <Link href="/">home page</Link> or{' '}
                <Link href="/explore/FV/sections/Data/">explore our community portals</Link>.
              </p>
            </div>
          </div>
        )
      default: // NOTE: do nothing
    }
  }

  const heading = isLoggedIn ? (
    <div style={{ padding: '0.5em', textAlign: 'center' }}>
      <h1>
        Request to join
        {` ${requestedSiteTitle}`}
      </h1>
      <p>
        Please include your reason for requesting to join this community site, and any information that supports that
        request in the comment field below.
      </p>
    </div>
  ) : (
    <div style={{ padding: '0.5em', textAlign: 'center' }}>
      <h1>
        <FVLabel transKey="register" defaultStr="Register" transform="first" />
        {requestedSite ? (
          <div style={{ marginTop: '10px' }}>
            <small>and request to join {requestedSiteTitle}</small>
          </div>
        ) : null}
      </h1>
      <h2>{requestedSite ? null : 'Are you a member of a language community?'}</h2>
      <p>
        Most language content is available <Link href="/explore/FV/sections/Data">here</Link> for everyone to access
        without registration. If you are a member of
        {requestedSite
          ? ` the ${requestedSiteTitle} language community`
          : ' a language community that is represented on FirstVoices'}
        , please register in order to access any content intended solely for members of your community.
      </p>
    </div>
  )

  return (
    <div className="row" style={{ maxWidth: '968px', margin: '0 auto' }}>
      {heading}
      <form onSubmit={(event) => onRequestSaveForm(event)}>
        <t.form.Form ref={formRef} type={t.struct(fvUserFields)} value={formValue} options={fvUserOptions} />
        {serverErrorMessage}
        <p>
          <small>Note: Fields marked with * are required</small>
        </p>
        <div className="form-group">
          <FVButton variant="contained" onClick={(event) => onRequestSaveForm(event)} color="primary">
            <FVLabel transKey="register" defaultStr="Register" />
          </FVButton>
        </div>
      </form>
    </div>
  )
}
// PROPTYPES
const { bool, func, object, string } = PropTypes
RegisterPresentation.propTypes = {
  fvUserFields: object.isRequired,
  fvUserOptions: object.isRequired,
  formRef: object.isRequired,
  formValue: object,
  isLoggedIn: bool,
  onRequestSaveForm: func.isRequired,
  requestedSiteTitle: string,
  requestedSite: bool,
  serverResponse: object,
}

export default RegisterPresentation
