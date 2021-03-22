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
import selectn from 'selectn'
import React from 'react'
import StringHelpers from 'common/StringHelpers'
export default {
  // Get properties from form value
  getProperties: (form) => {
    const properties = {}
    const formValue = form.getValue()

    for (const key in formValue) {
      // Treat valued checkboxes differently. Always have value, so skip if unchecked.
      // getComponent does not work with input names that have '.' in them. Access directly.
      // valuedCheckbox = selectn('form.refs.input.refs[\'' + key + '\'].refs.valued_checkbox', form);

      let valuedCheckbox = null

      // Ensure Input for Form Ref is defined
      if (form.inputRef.childRefs && form.inputRef.childRefs[key]) {
        // Checking to see if the input has it's own ref set (from within valued-checkbox.js)
        valuedCheckbox = selectn('valued_checkbox.current', form.inputRef.childRefs[key])
      }

      if (valuedCheckbox) {
        if (valuedCheckbox.checked === false) {
          continue
        }
      }
      if (Object.prototype.hasOwnProperty.call(formValue, key) && key) {
        if (formValue[key] && formValue[key] !== '') {
          properties[key] = formValue[key]
        }
      }
    }

    return properties
  },
  prepareFilters: (filters, options, optionsKey) => {
    const preparedFilters = {}

    // Test each of the filters against item
    for (const filterKey in filters) {
      const filterOptions = selectn([optionsKey, 'fields', filterKey], options)

      // Add options to returned filter object

      // Filter not prepared
      if (!Object.prototype.hasOwnProperty.call(filters[filterKey], 'appliedFilter')) {
        preparedFilters[filterKey] = {
          appliedFilter: filters[filterKey],
          filterOptions: filterOptions,
        }
      } else {
        preparedFilters[filterKey] = filters[filterKey]
      }
    }

    return preparedFilters
  },
}

/*
Get FormData from `form`

formReference = Pass in a reference to a `form`
toParse = Optionally provide regex of field names that should be converted to js objects (via `JSON.parse()`)
checkoxes = array of checkbox names. Used to return boolean of checkboxes

Example

getFormData({
  formReference: this.form,
  toParse: [
    /^fv:literal_translation/,
    /^fv:definitions/,
    /^fv:related_audio/,
    /^fv:related_pictures/,
    /^fv:cultural_note/,
    /^fvm:source/,
    /^fv-word:related_phrases/,
  ],
  checkboxes: ['idNameOfCheckbox', 'secondIdNameOfCheckbox', ...]
})

TODO: try to get rid of `toParse` & `checkboxes` by using either:
 - the yup validation object (assuming we can figure out what needs to be `JSON.parse`d or converted into a boolean (checkboxes))
 - or by providing a form object that's similar to the yup obj that will help us figure out the `toParse`/`checkboxes`
 eg:
  const parallelFormValidationObject = {
    'dc:title': {type: 'text'},
    'fv:literal_translation': {type: 'text', parse: true},
    'fv:available_in_childrens_archive': {type: 'checkbox'},
  }
*/
export const getFormData = ({ formReference, toParse = [], checkboxes = [] }) => {
  const formDataFormatted = {}

  // Set form data using "current" only if it exists to allow for Callback refs
  const formData = new FormData(formReference.current || formReference)

  const checkboxesAsBooleans = {}
  if (checkboxes.length > 0) {
    for (let index = 0; index < checkboxes.length; index++) {
      checkboxesAsBooleans[checkboxes[index]] = false
    }
  }

  for (const value of formData.entries()) {
    const name = value[0]
    const data = value[1]

    // Parse any stringify-ed array/objects
    const shouldParse = toParse.some((regex) => {
      return regex.test(name)
    })
    if (shouldParse) {
      formDataFormatted[name] = JSON.parse(data)
      continue
    }

    // Update any checked checkboxes
    if (checkboxes.includes(name)) {
      checkboxesAsBooleans[name] = true
    }

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
      // console.log('data', data)
      if (data.name) {
        formDataFormatted[name] = [...fileData, data]
      }
      continue
    }

    formDataFormatted[name] = data
  }

  return Object.assign(formDataFormatted, checkboxesAsBooleans)
}

/*

Validates a form

1) Provide FormData object of form and yup schema, optional: abortEarly boolean

Example

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

Example

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

Return

{
  valid: boolean,
  [yup error?]: [?]
}
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

// TODO: valid/invalid aren't super clear on their purpose.
// perhaps: onValid & onInvalid
export const handleSubmit = async ({ validator, formData, valid, invalid }) => {
  const formValidation = await validateForm({ formData, validator })

  if (formValidation.valid) {
    valid()
  } else {
    invalid({
      errors: formValidation.errors,
    })
  }
}

// TODO: don't construct jsx in here. Either:
// - return a conveniently formatted object
// - or pass in a template prop
export const getErrorFeedback = ({ errors = [] }) => {
  let errorFeedback = null
  if (errors.length !== 0) {
    if (errors.length > 0) {
      const li = errors.map((error, i) => {
        return (
          <li key={i}>
            <label className="Form__errorFeedbackItemLabel" htmlFor={StringHelpers.clean(error.path, 'CLEAN_ID')}>
              {error.message}
            </label>
          </li>
        )
      })

      const intro = `Could you review the following ${errors.length > 1 ? 'items' : 'item'}?`
      errorFeedback = (
        <div className="Form__errorFeedback">
          {intro}
          <ul className="Form__errorFeedbackItems">{li}</ul>
        </div>
      )
    }
  }
  return errorFeedback
}
