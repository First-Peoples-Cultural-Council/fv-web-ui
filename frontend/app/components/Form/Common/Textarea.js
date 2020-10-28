import React from 'react'
import PropTypes from 'prop-types'

const { bool, string, func, object } = PropTypes

export default class Textarea extends React.Component {
  static propTypes = {
    ariaDescribedby: string,
    className: string,
    disabled: bool,
    error: object,
    handleChange: func,
    id: string.isRequired,
    labelText: string.isRequired,
    name: string.isRequired,
    setRef: func,
    value: string,
    wysiwyg: bool,
  }
  static defaultProps = {
    className: 'Textarea',
    disabled: false,
    error: {},
    handleChange: () => {},
    setRef: () => {},
    value: '',
    wysiwyg: false,
  }

  state = {
    value: this.props.value,
    TextElement: null,
  }

  async componentDidMount() {
    const { ariaDescribedby, className, disabled, id, name, setRef } = this.props

    const textComponent = this.props.wysiwyg ? (
      await import(/* webpackChunkName: "Editor" */ 'components/Editor').then((_module) => {
        const Editor = _module.default
        return (
          <Editor
            aria-describedby={ariaDescribedby}
            className={`${className} Textarea__textarea`}
            disabled={disabled}
            id={id}
            initialValue={this.state.value}
            name={name}
            onChange={(content /*, delta, source, editor*/) => {
              this._handleChange(content)
            }}
            setRef={setRef}
          />
        )
      })
    ) : (
      <textarea
        aria-describedby={ariaDescribedby}
        className={`${className} Textarea__textarea`}
        disabled={disabled}
        defaultValue={this.state.value}
        id={id}
        name={name}
        onChange={(event) => {
          this._handleChange(event.target.value)
        }}
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
      <div className={`${className} Textarea ${message ? 'Form__error' : ''}`}>
        <label onClick={labelClickHandler} className={`${className} Textarea__label`} htmlFor={id}>
          {labelText}
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
