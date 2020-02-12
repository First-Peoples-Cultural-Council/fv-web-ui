import React from 'react'
import t from 'tcomb-form'
import StringHelpers, { CLEAN_ID } from 'common/StringHelpers'

function renderInput(locals) {
  const onChange = function renderInputOnChange(event) {
    locals.onChange(event.target.value)
  }
  return (
    <input
      className="form-control"
      data-testid={StringHelpers.clean(locals.attrs.name, CLEAN_ID)}
      id={locals.attrs.id}
      label={locals.label}
      name={locals.attrs.name}
      onChange={onChange}
      type="text"
      value={locals.value}
    />
  )
}

const textboxTemplate = t.form.Form.templates.textbox.clone({ renderInput })

export default class dataTestId extends t.form.Textbox {
  getTemplate() {
    return textboxTemplate
  }
}
