import React from 'react'
import t from 'tcomb-form'
import StringHelpers, { CLEAN_ID } from 'common/StringHelpers'

function renderInput(locals) {
  const onChange = function virtualKeyboardOnChange(event) {
    locals.onChange(event.target.value)
  }
  return (
    <div>
      <input
        type="text"
        label={locals.label}
        name={locals.attrs.name}
        value={locals.value}
        onChange={onChange}
        style={{ display: 'none' }}
      />
      <input
        type="text"
        data-testid={StringHelpers.clean(locals.attrs.name, CLEAN_ID)}
        id={'virtual-keyboard-helper-' + StringHelpers.clean(locals.attrs.name, CLEAN_ID)}
        value={locals.value}
        className="form-control"
        label={locals.label}
        onChange={onChange}
        onBlur={onChange}
      />
    </div>
  )
}

const textboxTemplate = t.form.Form.templates.textbox.clone({ renderInput })

export default class VirtualKeyboardFactory extends t.form.Textbox {
  getTemplate() {
    return textboxTemplate
  }
}
