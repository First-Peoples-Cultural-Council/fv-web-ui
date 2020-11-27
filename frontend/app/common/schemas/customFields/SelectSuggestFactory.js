import React from 'react'
import t from 'tcomb-form'
import selectn from 'selectn'

import IntlService from 'common/services/IntlService'

import AutoSuggestComponent from 'components/AutoSuggestComponent'
import BrowseComponent from 'components/BrowseComponent'
import Preview from 'components/Preview'
import DialogCreateForm from 'components/DialogCreateForm'

const intl = IntlService.instance

/**
 * Define auto-suggest factory
 */
function renderInput(locals) {
  const onChange = function renderInputOnChange(event, fullValue) {
    locals.onChange(fullValue.uid)
    locals.setExpandedValue(fullValue)
  }

  const onComplete = function renderInputOnComplete(fullValue) {
    locals.onChange(fullValue.uid)
    locals.setExpandedValue(fullValue)
  }

  const previewProps = selectn('attrs.previewProps', locals) || {}
  let content = (
    <div>
      <Preview
        id={locals.value}
        expandedValue={selectn('attrs.expandedValue', locals)}
        type={locals.type}
        {...previewProps}
      />
      {locals.attrs.allowEdit ? (
        <DialogCreateForm
          context={locals.context}
          value={locals.value}
          expandedValue={selectn('attrs.expandedValue', locals)}
          onChange={onChange}
          fieldAttributes={locals.attrs}
        />
      ) : (
        ''
      )}
    </div>
  )

  if (!locals.value) {
    content = (
      <div>
        <AutoSuggestComponent
          locals={locals}
          type={locals.type}
          value={locals.value || ''}
          provider={locals.attrs.page_provider}
          dialect={locals.context}
          onChange={onChange}
        />
        {locals.attrs.hideCreate ? (
          ''
        ) : (
          <DialogCreateForm context={locals.context} onChange={onChange} fieldAttributes={locals.attrs} />
        )}
        <BrowseComponent
          locals={locals}
          type={locals.type}
          label={
            locals.labelBrowseComponent ||
            intl.trans('views.components.editor.browse_existing', 'Browse Existing', 'words')
          }
          onComplete={onComplete}
          dialect={locals.context}
          containerType={locals.attrs.containerType}
        />
      </div>
    )
  }

  return <div>{content}</div>
}

const selectSuggestTemplate = t.form.Form.templates.textbox.clone({ renderInput })

export default class SelectSuggestFactory extends t.form.Textbox {
  constructor(props) {
    super(props)
    this.state = Object.assign(this.state, { expandedValue: null })

    this.setExpandedValue = this.setExpandedValue.bind(this)
  }

  setExpandedValue(expandedValue) {
    this.setState({ expandedValue })
  }

  getLocals() {
    const locals = super.getLocals()
    locals.attrs = this.getAttrs()
    locals.setExpandedValue = this.setExpandedValue
    locals.attrs.expandedValue = this.state.expandedValue
    const localsOptions = this.props.options.locals || {}
    return { ...locals, ...localsOptions }
  }

  getTemplate() {
    return selectSuggestTemplate
  }
}
