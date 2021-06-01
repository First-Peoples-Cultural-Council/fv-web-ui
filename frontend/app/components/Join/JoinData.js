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
  const { requestMembership, computeMembershipCreate } = useUser()

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
    }
  }, [requestedSite])

  const fvUserFields = selectn('FVJoin', fields)
  const fvUserOptions = Object.assign({}, selectn('FVJoin', options))

  const _computeRequestMembership = ProviderHelpers.getEntry(computeMembershipCreate, userRequest)
  const requestMembershipResponse = selectn('response', _computeRequestMembership)

  useEffect(() => {
    const status = selectn('value.status', requestMembershipResponse)
    if (status === 400 || status === 200) {
      setServerResponse({
        status: status,
        message: selectn('response.value.entity', requestMembershipResponse),
      })
    }
  }, [requestMembershipResponse])

  useEffect(() => {
    if (selectn('success', computePortals)) {
      const response = selectn('response', computePortals)
      const portal = response.find((obj) => {
        return obj.uid === requestedSite
      })
      setRequestedSiteTitle(portal.title)
    }
  }, [computePortals])

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
