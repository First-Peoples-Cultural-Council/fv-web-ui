import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactQuill from 'react-quill'
import '!style-loader!css-loader!react-quill/dist/quill.snow.css'
import '!style-loader!css-loader!./Editor.css'
const { bool, string, func } = PropTypes

export class Editor extends Component {
  static propTypes = {
    ariaDescribedby: string,
    className: string,
    disabled: bool,
    id: string,
    initialValue: string,
    name: string,
    onChange: func,
    setRef: func,
  }

  static defaultProps = {
    ariaDescribedby: '',
    className: '',
    disabled: false,
    id: '',
    initialValue: '',
    name: '',
    onChange: () => {},
    error: {},
    setRef: () => {},
  }

  // https: //quilljs.com/docs/modules/toolbar/
  modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'video'],
      ['clean'],
    ],
  }

  // Note: aware we are ignoring prop updates (the text shouldn't change anyway)
  state = { text: this.props.initialValue }
  quillRef = null // Quill instance
  reactQuillRef = null // ReactQuill component

  componentDidMount() {
    this.attachQuillRefs()
  }

  render() {
    const { ariaDescribedby, disabled, id, name, setRef } = this.props
    return (
      <div>
        <input
          id={id}
          type="text"
          className="visually-hidden"
          onFocus={() => {
            this.quillRef.focus()
          }}
          name={name}
          value={this.state.text}
          onChange={() => {}} // Note: ReactQuill sets this input
          ref={setRef}
        />
        <ReactQuill
          readOnly={disabled}
          aria-describedby={ariaDescribedby} // TODO: check if this works
          value={this.state.text}
          onChange={this.handleChange}
          ref={(el) => {
            this.reactQuillRef = el
          }}
          modules={this.modules}
        />
      </div>
    )
  }

  handleChange = (value) => {
    this.setState({ text: value }, () => {
      this.props.onChange(value)
    })
  }

  attachQuillRefs = () => {
    if (typeof this.reactQuillRef.getEditor !== 'function') return
    this.quillRef = this.reactQuillRef.getEditor()
  }
}

export default Editor
