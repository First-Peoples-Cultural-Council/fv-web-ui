import { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'

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
  const { selfregisterUser, computeUserSelfregister } = useUser()

  const formRef = useRef()
  const [formValue, setFormValue] = useState(null)
  const [userRequest, setUserRequest] = useState(null)
  const [serverResponse, setServerResponse] = useState(null)

  const fvUserFields = selectn('FVRegistration', fields)
  const fvUserOptions = Object.assign({}, selectn('FVRegistration', options))

  const _computeUserSelfregister = ProviderHelpers.getEntry(computeUserSelfregister, userRequest)
  const registrationResponse = selectn('response', _computeUserSelfregister)

  useEffect(() => {
    const status = selectn('value.status', registrationResponse)
    if (status === 400 || status === 200) {
      setServerResponse({
        status: status,
        message: selectn('value.entity', registrationResponse),
      })
    }
  }, [registrationResponse])

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
      const currentUserRequest = {
        'entity-type': 'document',
        type: 'FVUserRegistration',
        id: selectn('userinfo:email', properties),
        properties: properties,
      }
      selfregisterUser(currentUserRequest, null, null, null)
      setUserRequest(currentUserRequest)
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
    onRequestSaveForm,
    serverResponse,
  })
}
// PROPTYPES
const { func } = PropTypes
RegisterData.propTypes = {
  children: func,
}

export default RegisterData
