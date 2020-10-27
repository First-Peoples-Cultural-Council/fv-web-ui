import React /*, { Component, PropTypes }*/ from 'react'
import t from 'tcomb-form'
import Editor from 'components/Editor'
import selectn from 'selectn'
/**
 * Custom textarea field for tcomb-form that uses Quill
 */
function renderTextarea(locals) {
  const dataTestId = selectn(['attrs', 'dataTestId'], locals) || 'wysiwyg'
  const id = selectn(['attrs', 'idAlt'], locals) || selectn(['attrs', 'id'], locals) || 'wysiwygId'
  const name = selectn(['attrs', 'nameAlt'], locals) || selectn(['attrs', 'name'], locals) || 'wysiwygName'
  return (
    <div data-testid={dataTestId}>
      <Editor
        id={id}
        initialValue={locals.value}
        name={name}
        onChange={(content /*, delta, source, editor*/) => {
          locals.onChange(content)
        }}
      />
    </div>
  )
}

const textboxTemplate = t.form.Form.templates.textbox.clone({ renderTextarea })

export default class WysiwygFactory extends t.form.Textbox {
  getTemplate() {
    return textboxTemplate
  }
}
