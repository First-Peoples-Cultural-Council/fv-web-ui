import classNames from 'classnames'

import FVButton from 'components/FVButton'
import FVLabel from 'components/FVLabel'
import Link from 'components/Link'
import PropTypes from 'prop-types'
import React from 'react'
import t from 'tcomb-form'

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
                                onRequestSaveForm,
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

  return (
    <div className="row" style={{ maxWidth: '968px', margin: '0 auto' }}>
      <div style={{ padding: '0.5em', textAlign: 'center' }}>
        <h1>
          <FVLabel transKey="register" defaultStr="Register" transform="first" />
        </h1>
      </div>
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
  onRequestSaveForm: func.isRequired,
  serverResponse: object,
}

export default RegisterPresentation
