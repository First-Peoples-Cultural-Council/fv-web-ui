import React, {Component, PropTypes} from 'react';
import t from 'tcomb-form';
import classNames from 'classnames';
import AlloyEditorComponent from 'views/components/Editor/AlloyEditorComponent';

/**
* Custom textarea field for tcomb-form that uses alloy-editor
*/
function renderTextarea(locals) {

  const onContentChange = function (value) {
    locals.onChange(value);
  }

  return <AlloyEditorComponent content={locals.value} onContentChange={onContentChange} container={"editable" + locals.label.replace(' ', '_')} />
}

const textboxTemplate = t.form.Form.templates.textbox.clone({ renderTextarea })

export default class WysiwygFactory extends t.form.Textbox {

  getTemplate() {
    return textboxTemplate
  }

}