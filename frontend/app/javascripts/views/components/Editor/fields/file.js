import React, { Component } from 'react'
import PropTypes from 'prop-types'
import t from 'tcomb-form'
import selectn from 'selectn'

import Preview from 'views/components/Editor/Preview'

/**
 * Define auto-suggest factory
 */
const renderInput = function renderInput(locals) {
  const fileObj = selectn('context.otherContext.file', locals)
  const type = 'FVPicture'

  const content = (
    <div>
      <Preview
        expandedValue={fileObj}
        type={type}
        crop
        minimal={!fileObj ? false : true}
        tagStyles={type == 'FVPicture' ? { height: '200px' } : null}
      />
    </div>
  )

  return (
    <div style={{ width: '100%', border: '1px dashed #dedede', padding: '10px', position: 'relative' }}>{content}</div>
  )
}

const textboxTemplate = t.form.Form.templates.textbox.clone({ renderInput })
const textboxTemplateDefault = t.form.Form.templates.textbox

export default class FileFactory extends t.form.Textbox {
  getTemplate() {
    const locals = this.getLocals()
    const fileObj = selectn('context.otherContext.file', locals)

    if (fileObj) {
      return textboxTemplate
    }
    return textboxTemplateDefault
  }
}
