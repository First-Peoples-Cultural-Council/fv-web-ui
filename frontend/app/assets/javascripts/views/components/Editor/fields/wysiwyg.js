import React /*, { Component, PropTypes }*/ from 'react'
import t from 'tcomb-form'

import AlloyEditorComponent from 'views/components/Editor/AlloyEditorComponent'
// import Editor from 'views/components/Editor'
import selectn from 'selectn'
/**
 * Custom textarea field for tcomb-form that uses Quill
 */
function renderTextarea(locals) {
  const onContentChange = (value) => {
    locals.onChange(value)
  }
  // const id = selectn(['attrs', 'idAlt'], locals) || selectn(['attrs', 'id'], locals) || 'wysiwygId'
  // const name = selectn(['attrs', 'nameAlt'], locals) || selectn(['attrs', 'name'], locals) || 'wysiwygName'
  const dataTestId = selectn(['attrs', 'dataTestId'], locals) || 'wysiwyg'
  return (
    <div data-testid={dataTestId}>
      <AlloyEditorComponent
        content={locals.value}
        onContentChange={onContentChange}
        container={'editable' + locals.label.replace(' ', '_')}
      />
      {/* <Editor
        // aria-describedby={ariaDescribedby}
        // className="Text__text"
        // disabled={disabled}
        id={id}
        initialValue={locals.value}
        name={name}
        onChange={(content, delta, source, editor) => {
          // this._handleChange(content, delta, source, editor)
          // onContentChange(content)
          console.log('! onChange', { content, delta, source, editor })
          // event.target.value
          // locals.onChange(content)
        }}
        // setRef={setRef}
      /> */}
    </div>
  )
}

const textboxTemplate = t.form.Form.templates.textbox.clone({ renderTextarea })

export default class WysiwygFactory extends t.form.Textbox {
  getTemplate() {
    return textboxTemplate
  }
}
