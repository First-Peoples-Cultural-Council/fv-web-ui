import React from 'react'
import PropTypes from 'prop-types'

import '!style-loader!css-loader!./Text.css'

const { bool, string, func, object } = PropTypes

export default class Text extends React.Component {
  static propTypes = {
    ariaDescribedby: string,
    className: string,
    disabled: bool,
    error: object,
    handleChange: func,
    id: string.isRequired,
    isRequired: bool,
    labelText: string.isRequired,
    name: string.isRequired,
    setRef: func,
    value: string,
    wysiwyg: bool,
  }
  static defaultProps = {
    className: 'Text',
    disabled: false,
    error: {},
    handleChange: () => {},
    isRequired: false,
    setRef: () => {},
    value: '',
    wysiwyg: false,
  }

  state = {
    value: this.props.value,
    TextElement: null,
  }

  async componentDidMount() {
    const { ariaDescribedby, disabled, id, name, setRef } = this.props

    const textComponent = this.props.wysiwyg ? (
      await import(/* webpackChunkName: "Editor" */ 'components/Editor').then((_module) => {
        const Editor = _module.default
        return (
          <Editor
            aria-describedby={ariaDescribedby}
            className="Text__text"
            disabled={disabled}
            id={id}
            initialValue={this.state.value}
            name={name}
            onChange={(content /*, delta, source, editor*/) => {
              this._handleChange(content /*, delta, source, editor*/)
            }}
            setRef={setRef}
          />
        )
      })
    ) : (
      <input
        aria-describedby={ariaDescribedby}
        className="Text__text"
        disabled={disabled}
        id={id}
        name={name}
        defaultValue={this.state.value}
        onChange={(event) => {
          this._handleChange(event.target.value)
        }}
        type="text"
        ref={setRef}
      />
    )
    this.setState({
      TextElement: textComponent,
    })
  }
  render() {
    const { message } = this.props.error
    const { className, id, labelText, wysiwyg } = this.props
    const { TextElement } = this.state

    const labelClickHandler = wysiwyg
      ? () => {
        if (this.state.wysiwygRef) {
          this.state.wysiwygRef.focus()
        }
      }
      : () => {}
    return (
      <div className={`${className} Text ${message ? 'Form__error Text--error' : ''}`}>
        <label onClick={labelClickHandler} className="Text__label" htmlFor={id}>
          {labelText} {this.props.isRequired ? '*' : ''}
        </label>
        {TextElement}
        {message && (
          <label onClick={labelClickHandler} className="Form__errorMessage" htmlFor={id}>
            {message}
          </label>
        )}
      </div>
    )
  }
  _handleChange = (value) => {
    this.setState({ value })
    this.props.handleChange(value)
  }
}
