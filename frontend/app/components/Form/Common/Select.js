import React from 'react'
import PropTypes from 'prop-types'
const { string, element, func } = PropTypes

export default class Select extends React.Component {
  static defaultProps = {
    className: 'Select',
    value: undefined,
    handleChange: () => {},
    // setRef: (_element) => {
    //   this.element = _element
    //   this.element.focus()
    // },
    setRef: () => {},
  }

  static propTypes = {
    id: string.isRequired,
    labelText: string.isRequired,
    name: string.isRequired,
    value: string.isRequired,
    className: string,
    ariaDescribedby: string,
    children: element,
    handleChange: func,
    setRef: func,
  }

  state = {
    value: this.props.value,
  }

  componentDidMount() {
    this.props.handleChange(this.state.value)
  }

  render() {
    const { className, ariaDescribedby, id, labelText, name, setRef } = this.props
    return (
      <div className={`${className} Select`}>
        <label className="Select__label" htmlFor={id}>
          {labelText}
        </label>
        <select
          aria-describedby={ariaDescribedby}
          className="Select__select"
          id={id}
          name={name}
          value={this.state.value}
          onChange={this._handleChange}
          ref={setRef}
        >
          {this.props.children}
        </select>
      </div>
    )
  }
  _handleChange = (event) => {
    this.setState({ value: event.target.value })
    this.props.handleChange(event.target.value)
  }
}
