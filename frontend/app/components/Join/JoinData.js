import { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'

import usePortal from 'dataSources/usePortal'
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
  const { computeLogin } = useLogin()
  const { requestMembership, computeMembershipCreate, getMembershipStatus, computeMembershipFetch } = useUser()

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
      setFormValue({ siteId: requestedSite })
      getMembershipStatus({ siteId: requestedSite })
    }
    if (requestedSite === null) {
      window.location.href = '/explore/FV/sections/Data/'
    }
  }, [requestedSite])

  const fvUserFields = selectn('FVJoin', fields)
  const fvUserOptions = Object.assign({}, selectn('FVJoin', options))

  useEffect(() => {
    if (selectn('success', computePortals)) {
      const response = selectn('response', computePortals)
      const portal = response.find((obj) => {
        return obj.uid === requestedSite
      })
      setRequestedSiteTitle(portal?.title)
    }
  }, [computePortals])

  const responseMessage = selectn('message', computeMembershipCreate)
  const membershipStatus = selectn('message.membershipStatus', computeMembershipFetch)

  useEffect(() => {
    if (membershipStatus === 'pending') {
      setServerResponse({
        status: 403,
        message: 'You currently have a pending application to join this archive.',
      })
    }
    if (membershipStatus === 'joined') {
      setServerResponse({
        status: 403,
        message: 'You are already a member of this archive.',
      })
    }
  }, [membershipStatus])

  useEffect(() => {
    if (responseMessage?.status === 200) {
      setServerResponse({
        status: 200,
        message: 'Your request to join this dialect is now pending',
      })
    } else if (Number.isFinite(responseMessage?.status)) {
      setServerResponse({
        status: responseMessage?.status,
        message:
          'Unfortunately we are unable to process your request at this time. Please contact hello@firstvoices.com if this error persists.',
      })
    }
  }, [responseMessage])

  const onRequestSaveForm = (event) => {
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
    if (currentFormValue && isLoggedIn) {
      const currentUserRequest = {
        siteId: selectn('siteId', properties),
        interestReason: selectn('interestReason', properties),
        communityMember: selectn('communityMember', properties) || false,
        languageTeam: selectn('languageTeam', properties) || false,
        comment: selectn('comment', properties),
      }
      requestMembership(currentUserRequest)
      setUserRequest(currentUserRequest)
      window.scrollTo(0, 0)
    } else {
      window.scrollTo(0, 0)
    }
  }

  const computeEntities = ProviderHelpers.toJSKeepId([
    {
      id: userRequest,
      entity: computeMembershipCreate,
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
    serverResponse,
  })
}
// PROPTYPES
const { func } = PropTypes
JoinData.propTypes = {
  children: func,
}

export default JoinData
