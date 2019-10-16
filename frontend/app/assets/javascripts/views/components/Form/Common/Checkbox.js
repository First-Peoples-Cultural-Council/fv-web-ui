import React from 'react'
import PropTypes from 'prop-types'
const { string, number, bool, func, oneOfType, object } = PropTypes

export default class Checkbox extends React.Component {
  static propTypes = {
    id: string.isRequired,
    labelText: string.isRequired,
    name: string.isRequired,
    ariaDescribedby: string,
    className: string,
    selected: bool,
    handleChange: func,
    value: oneOfType([number, string, bool]),
    error: object,
    setRef: func,
  }
  static defaultProps = {
    className: 'Checkbox',
    value: true,
    handleChange: () => {},
    error: {},
    setRef: () => {},
  }

  state = {
    selected: this.props.selected,
  }

  render() {
    const { className, ariaDescribedby, id, labelText, name, value, setRef } = this.props
    const { message } = this.props.error
    return (
      <div className={`${className} Checkbox ${message ? 'Form__error' : ''}`}>
        <input
          aria-describedby={ariaDescribedby}
          className={`${className}__text Checkbox__text`}
          id={id}
          name={name}
          defaultChecked={this.state.selected}
          onChange={this._handleChange}
          value={value}
          type="checkbox"
          ref={setRef}
        />
        <label className={`${className}__label Checkbox__label`} htmlFor={id}>
          {labelText}
        </label>
        {message && (
          <div>
            <label className="Form__errorMessage" htmlFor={id}>
              {message}
            </label>
          </div>
        )}
      </div>
    )
  }
  _handleChange = () => {
    const newValue = !this.state.selected
    this.setState({ selected: newValue }, () => {
      this.props.handleChange(newValue, this.props.value)
    })
  }
}
