import { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'

import usePortal from 'dataSources/usePortal'
import useIntl from 'dataSources/useIntl'
import useLogin from 'dataSources/useLogin'
import useUser from 'dataSources/useUser'
import fields from 'common/schemas/fields'
import options from 'common/schemas/options'
import ProviderHelpers from 'common/ProviderHelpers'

/**
 * @summary JoinData
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function JoinData({ children }) {
  const { fetchPortals, computePortals } = usePortal()
  const { intl } = useIntl()
  const { computeLogin } = useLogin()
  const { selfregisterUser, computeUserSelfregister, requestMembership } = useUser()

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
      fetchPortals({ area: 'sections' })
      setFormValue({ 'fvuserinfo:requestedSpace': requestedSite })
    }
  }, [requestedSite])

  const fvUserFields = selectn('FVJoin', fields)
  const fvUserOptions = Object.assign({}, selectn('FVJoin', options))

  const registrationResponse = ProviderHelpers.getEntry(computeUserSelfregister, userRequest)

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
    if (selectn('success', computePortals)) {
      const response = selectn('response', computePortals)
      const portal = response.find((obj) => {
        return obj.uid === requestedSite
      })
      setRequestedSiteTitle(portal.title)
    }
  }, [registrationResponse, computePortals])

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
        requestMembership({
          siteId: selectn('siteId', properties),
          interestReason: selectn('interestReason', properties),
          communityMember: selectn('communityMember', properties) || false,
          languageTeam: selectn('languageTeam', properties) || false,
          comment: selectn('comment', properties),
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
JoinData.propTypes = {
  children: func,
}

export default JoinData
