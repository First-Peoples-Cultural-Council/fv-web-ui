import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import t from 'tcomb-form'

import FVButton from 'components/FVButton'
import Link from 'components/Link'
/**
 * @summary JoinPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function JoinPresentation({
  fvUserFields,
  fvUserOptions,
  formRef,
  formValue,
  onRequestSaveForm,
  requestedSiteTitle,
  serverResponse,
}) {
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
      case 403:
        return (
          <div className="row" style={{ maxWidth: '968px', margin: '0 auto' }}>
            <div style={{ padding: '0.5em', textAlign: 'center', marginTop: '50px' }}>
              <div className={classNames('alert', 'alert-danger')} role="alert">
                {serverResponse?.message}
              </div>
              <p>
                <Link href="/explore/FV/sections/Data/">Go to public language sites</Link>.
              </p>
            </div>
          </div>
        )
      case 200:
        return (
          <div className="row" style={{ maxWidth: '968px', margin: '0 auto' }}>
            <div style={{ padding: '0.5em', textAlign: 'center' }}>
              <h1>Thank you for your request!</h1>
              <p>
                Thank you for requesting to join the {requestedSiteTitle} language site as a member! Your request has
                been sent to the {requestedSiteTitle} Language Team.
              </p>
              <p>
                <Link href="/explore/FV/sections/Data/">Go to public language sites</Link>.
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
        <h1>Join the {requestedSiteTitle} language site</h1>
        <p>
          Membership of the {requestedSiteTitle} language site is intended for people from the {requestedSiteTitle}{' '}
          language community. All requests to join are managed by the {requestedSiteTitle} Language Team.
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
            Request To Join
          </FVButton>
        </div>
      </form>
    </div>
  )
}
// PROPTYPES
const { func, object, string } = PropTypes
JoinPresentation.propTypes = {
  fvUserFields: object.isRequired,
  fvUserOptions: object.isRequired,
  formRef: object.isRequired,
  formValue: object,
  onRequestSaveForm: func.isRequired,
  requestedSiteTitle: string,
  serverResponse: object,
}

export default JoinPresentation
