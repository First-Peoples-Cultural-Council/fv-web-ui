import React from 'react'
import t from 'tcomb-form'
import AlloyEditorComponent from 'views/components/Editor/AlloyEditorComponent'

/**
 * Custom textarea field for tcomb-form that uses alloy-editor
 */
function renderTextarea(locals) {
  const onContentChange = (value) => {
    locals.onChange(value)
  }

  return (
    <div data-testId="Wysiwyg">
      <AlloyEditorComponent
        content={locals.value}
        onContentChange={onContentChange}
        container={'editable' + locals.label.replace(' ', '_')}
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
