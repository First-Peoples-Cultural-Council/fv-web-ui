import { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'

import useDialect from 'dataSources/useDialect'
import useIntl from 'dataSources/useIntl'
import useLogin from 'dataSources/useLogin'
import useUser from 'dataSources/useUser'
import fields from 'common/schemas/fields'
import options from 'common/schemas/options'
import ProviderHelpers from 'common/ProviderHelpers'

/**
 * @summary RegisterData
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function RegisterData({ children }) {
  const { fetchDialect2, computeDialect2 } = useDialect()
  const { intl } = useIntl()
  const { computeLogin } = useLogin()
  const { selfregisterUser, computeUserSelfregister, requestJoin } = useUser()

  const isLoggedIn = computeLogin.success && computeLogin.isConnected

  const formRef = useRef()
  const [formValue, setFormValue] = useState(null)
  const [userRequest, setUserRequest] = useState(null)
  const [serverResponse, setServerResponse] = useState(null)
  const [requestedSiteTitle, setRequestedSiteTitle] = useState('')

  const requestedSite = new URLSearchParams(window.location.search).get('requestedSite')
    ? new URLSearchParams(window.location.search).get('requestedSite')
    : null

  useEffect(() => {
    if (requestedSite) {
      fetchDialect2(requestedSite)
      setFormValue({ 'fvuserinfo:requestedSpace': requestedSite })
    }
  }, [requestedSite])

  const fvUserFields = isLoggedIn ? selectn('FVUserJoin', fields) : selectn('FVUser', fields)
  const fvUserOptions = requestedSite
    ? Object.assign({}, selectn('FVUserPreselected', options))
    : Object.assign({}, selectn('FVUserRegistration', options))

  const registrationResponse = ProviderHelpers.getEntry(computeUserSelfregister, userRequest)
  const dialectResponse = ProviderHelpers.getEntry(computeDialect2, requestedSite)

  useEffect(() => {
    if (selectn('success', registrationResponse)) {
      const status = selectn('response.value.status', registrationResponse)
      if (status === 400 || status === 200) {
        setServerResponse({
          status: status,
          message: selectn('response.value.entity', registrationResponse),
        })
      }
    }
    if (selectn('success', dialectResponse)) {
      setRequestedSiteTitle(selectn('response.title', dialectResponse))
    }
  }, [registrationResponse, dialectResponse])

  const onRequestSaveForm = (event) => {
    // Prevent default behaviour
    event.preventDefault()
    const currentFormValue = formRef.current.getValue()
    const properties = {}
    for (const key in currentFormValue) {
      if (Object.prototype.hasOwnProperty.call(currentFormValue, key) && key) {
        if (currentFormValue[key] && currentFormValue[key] !== '') {
          properties[key] = currentFormValue[key]
        }
      }
    }

    setFormValue(properties)
    if (currentFormValue) {
      if (isLoggedIn) {
        requestJoin({
          siteId: selectn('fvuserinfo:requestedSpace', properties),
          interestReason: selectn('fvuserinfo:role', properties),
          communityMember: selectn('fvuserinfo:community_member', properties) || false,
          languageTeam: selectn('fvuserinfo:language_team_member', properties) || false,
          comment: selectn('fvuserinfo:comment', properties),
        })
      } else {
        const currentUserRequest = {
          'entity-type': 'document',
          type: 'FVUserRegistration',
          id: selectn('userinfo:email', properties),
          properties: properties,
        }
        selfregisterUser(
          currentUserRequest,
          null,
          null,
          intl.trans('views.pages.users.register.user_request_success', 'User request submitted successfully!')
        )
        setUserRequest(currentUserRequest)
      }
    } else {
      window.scrollTo(0, 0)
    }
  }

  const computeEntities = ProviderHelpers.toJSKeepId([
    {
      id: userRequest,
      entity: computeUserSelfregister,
    },
  ])

  return children({
    computeEntities,
    fvUserFields,
    fvUserOptions,
    formRef,
    formValue,
    isLoggedIn,
    onRequestSaveForm,
    requestedSiteTitle,
    requestedSite: requestedSite ? true : false,
    serverResponse,
  })
}
// PROPTYPES
const { func } = PropTypes
RegisterData.propTypes = {
  children: func,
}

export default RegisterData
