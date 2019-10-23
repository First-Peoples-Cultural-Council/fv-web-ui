import React from 'react'
import t from 'tcomb-form'

export default class ValuedCheckboxFactory extends t.form.Textbox {
  constructor(props) {
    super(props)
    this.valued_checkbox = React.createRef()
  }
  /**
   * Manually reset element
   */
  forceReset = () => {
    if (this.valued_checkbox) {
      this.valued_checkbox.current.checked = false
    }
  }

  inputRender = (locals) => {
    const onChange = (event) => {
      if (event.target.checked) {
        locals.onChange(locals.context[locals.attrs.name])
      } else {
        locals.onChange(null)
      }
    }

    return (
      <label style={{ fontWeight: 'normal' }}>
        <input
          type="checkbox"
          ref={this.valued_checkbox}
          id={'virtual-keyboard-helper-' + locals.attrs.name}
          value={locals.context[locals.attrs.name]}
          name={locals.attrs.name}
          onChange={onChange}
          checked={locals.value === locals.context[locals.attrs.name]}
        />
        <span>&nbsp;</span>
        <span>{locals.label}</span>
      </label>
    )
  }

  getTemplate = () => {
    const template = t.form.Form.templates.textbox.clone({ renderInput: this.inputRender })
    return template
  }
}
