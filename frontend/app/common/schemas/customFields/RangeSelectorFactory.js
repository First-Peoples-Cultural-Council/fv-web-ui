import React from 'react'
import t from 'tcomb-form'

function renderInput(locals) {
  const onChange = (event) => {
    locals.onChange(event.target.value)
  }

  return (
    <div>
      {locals.value}
      <input onChange={onChange} value={locals.value} type="range" min="10" max="4000" step="10" />
    </div>
  )
}

const rangeTemplate = t.form.Form.templates.textbox.clone({ renderInput })

export default class RangeSelectorFactory extends t.form.Textbox {
  getTemplate() {
    return rangeTemplate
  }
}
