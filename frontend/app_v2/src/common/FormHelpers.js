/*
Copyright 2016 First People's Cultural Council

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/*
Get FormData from `form`
- formReference = Pass in a reference to a `form`
*/
export const getFormData = ({ formReference }) => {
  const formDataFormatted = {}
  // Set form data using "current" only if it exists to allow for Callback refs
  const formData = new FormData(formReference.current || formReference)
  for (const value of formData.entries()) {
    const name = value[0]
    const data = value[1]

    // Handle file
    const isFile = data instanceof File
    if (isFile) {
      // Create empty array if needed:
      if (formDataFormatted[name] === undefined) {
        formDataFormatted[name] = []
      }
      // Get file array data:
      const fileData = formDataFormatted[name]
      // Update file array data only if a file exists:
      if (data.name) {
        formDataFormatted[name] = [...fileData, data]
      }
      continue
    }
    formDataFormatted[name] = data
  }
  return Object.assign(formDataFormatted)
}

/*
Validates a form
- Provide FormData (object of form), and validator (yup schema), optional: abortEarly boolean

--- Example ---
const validator = yup.object().shape({
      'dc:title': yup
        .string()
        .label('Name')
        .required()
    })
const formData = getFormData({
  formReference: this.refToForm,
})
const formValidation = await validateForm({formData, validator})
*/
export const validateForm = async ({ formData, abortEarly = false, validator }) => {
  // Note: When `abortEarly === true` then `{ path, type } = invalid` is defined.
  // When `abortEarly === false` then `{ path, type } = invalid` is not defined! Data is found in `invalid.errors[]`.
  const validation = await validator.validate(formData, { abortEarly }).then(
    () => {
      return {
        valid: true,
        errors: [],
      }
    },
    (invalid) => {
      const { inner } = invalid
      const errors = inner.map((error) => {
        const { message, path, type } = error
        return {
          message,
          path,
          type,
        }
      })
      return {
        valid: false,
        errors,
      }
    }
  )
  return validation
}
/*
Determines if a field is valid. Returns object.
--- Example ---
const validator = yup.object().shape({
      'dc:title': yup
        .string()
        .label('Name')
        .required()
    })
const formData = getFormData({
  formReference: this.refToForm,
})
const formValidation = await validateForm({name: 'dc:title', formData, validator}})

Returns { valid: boolean, [yup error?]: [?] }
*/
export const validateField = async ({ name, formData, validator }) => {
  const results = await this._validateForm({ formData, validator })
  const { valid, errors } = results

  if (valid === false) {
    const fieldErrored = errors.filter((error) => {
      return error.path === name
    })
    if (fieldErrored.length !== 0) {
      const fieldData = fieldErrored[0]
      fieldData.valid = false
      return fieldData
    }
  }
  return {
    valid: true,
  }
}

/*
Returns a field's error message from yup validation
--- Example ---
const validator = yup.object().shape({
  'dc:title': yup
    .string()
    .label('Name')
    .required(),
})
const formData = getFormData({
  formReference: this.refToForm,
})
const formValidation = await validateForm({ formData, validator })
if (formValidation.valid === false) {
  const errorForTitleField = getError({ errors: formValidation.errors, fieldName: 'dc:title' })
}
 */
export const getError = ({ errors = [], fieldName }) => {
  const error = errors.filter((errorItem) => {
    return errorItem.path === fieldName
  })
  if (error.length === 1) {
    return error[0]
  }
  return {}
}
