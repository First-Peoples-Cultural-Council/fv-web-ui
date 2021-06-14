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
function RegisterPresentation({ fvUserFields, fvUserOptions, formRef, formValue, onRequestSaveForm, serverResponse }) {
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
              <h1>Thank you for registering for a FirstVoices account!</h1>
              <p>
                You will be emailed a link to set your password. If you don&apos;t receive an email within a few
                minutes, please check your junk folder.
              </p>
              <p>Your registration is not complete until you have set your password.</p>
              <p>
                Go to our <Link href="/">home page</Link> or{' '}
                <Link href="/explore/FV/sections/Data/">explore our language sites</Link>.
              </p>
            </div>
          </div>
        )
      default: // NOTE: do nothing
    }
  }

  return (
    <div className="row" style={{ maxWidth: '968px', margin: '0 auto' }}>
      <div style={{ padding: '0.5em', textAlign: 'center' }}>
        <h1>Register for an account</h1>
        <p>
          Most language content on FirstVoices is already available to everyone without registration. You can browse
          public content for different languages <Link href="/explore/FV/sections/Data">here</Link>. With a registered
          FirstVoices account, you can request to join language sites as a member.
        </p>
      </div>
      <form onSubmit={(event) => onRequestSaveForm(event)}>
        <t.form.Form ref={formRef} type={t.struct(fvUserFields)} value={formValue} options={fvUserOptions} />
        {serverErrorMessage}
        <p style={{ marginLeft: '5px', marginTop: '5px' }}>
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
const { bool, func, object } = PropTypes
RegisterPresentation.propTypes = {
  fvUserFields: object.isRequired,
  fvUserOptions: object.isRequired,
  formRef: object.isRequired,
  formValue: object,
  isLoggedIn: bool,
  onRequestSaveForm: func.isRequired,
  serverResponse: object,
}

export default RegisterPresentation
