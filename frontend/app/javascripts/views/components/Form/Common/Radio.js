import React from 'react'
import PropTypes from 'prop-types'
const { string, func } = PropTypes

export default class Radio extends React.Component {
  static defaultProps = {
    className: 'Radio',
    value: '',
    handleChange: () => {},
  }

  static propTypes = {
    id: string.isRequired,
    labelText: string.isRequired,
    name: string.isRequired,
    ariaDescribedby: string,
    className: string,
    value: string,
    handleChange: func,
  }

  state = {
    value: this.props.value,
  }

  render() {
    const { className, ariaDescribedby, id, labelText, name } = this.props
    return (
      <div className={`${className} Radio`}>
        <label className={`${className}__label Radio__label`} htmlFor={id}>
          {labelText}
        </label>
        <input
          aria-describedby={ariaDescribedby}
          className={`${className}__text Radio__text`}
          id={id}
          name={name}
          defaultValue={this.state.value}
          onChange={this._handleChange}
          type="text"
        />
      </div>
    )
  }
  _handleChange = (event) => {
    const value = event.target.value
    this.setState({ value })
    this.props.handleChange(value)
  }
}
