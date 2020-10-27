import React from 'react'
import t from 'tcomb-form'
import selectn from 'selectn'

import SwapHorizIcon from '@material-ui/icons/SwapHoriz'
import FVButton from 'components/FVButton'

import AddMediaComponent from 'components/AddMediaComponent'
import SelectMediaComponent from 'components/SelectMediaComponent'
import Preview from 'components/Preview'
import FVLabel from 'components/FVLabel'

const expandedValues = []

/**
 * Define auto-suggest factory
 */
function renderInput(locals) {
  const _onRequestEdit = function _onRequestEdit() {
    locals.onChange(null)
  }

  const onComplete = function onComplete(fullValue) {
    locals.onChange(fullValue.uid)
    locals.setExpandedValue(fullValue, fullValue.uid)
  }

  const onCancel = function onCancel() {
    const initialValue = selectn('context.initialValues.' + locals.attrs.name, locals)

    if (initialValue) locals.onChange(initialValue)
  }

  let content = (
    <div>
      <Preview
        id={locals.value}
        expandedValue={selectn(locals.value, expandedValues)}
        type={locals.type}
        crop
        tagStyles={locals.type == 'FVPicture' ? { height: '200px' } : null}
      />
      <FVButton
        variant="text"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '0 0 0 10px',
          border: '1px dashed #dedede',
          paddingLeft: '5px',
          textAlign: 'center',
          borderTop: 0,
          borderRight: 0,
        }}
        onClick={_onRequestEdit}
      >
        <SwapHorizIcon style={{ verticalAlign: 'middle' }} className="material-icons" />
        <FVLabel transKey="replace" defaultStr="Replace" transform="first" />
      </FVButton>
    </div>
  )

  if (!locals.value) {
    content = (
      <div>
        <AddMediaComponent
          type={locals.type}
          label={
            locals.labelAddMediaComponent || (
              <FVLabel transKey="views.components.editor.upload_new" defaultStr="Upload New" />
            )
          }
          onComplete={onComplete}
          dialect={locals.context}
        />
        <SelectMediaComponent
          type={locals.type}
          label={
            locals.labelSelectMediaComponent || (
              <FVLabel transKey="views.components.editor.browse_existing" defaultStr="Browse Existing" />
            )
          }
          onComplete={onComplete}
          dialect={locals.context}
        />
        {selectn('context.initialValues.' + locals.attrs.name, locals) ? (
          <FVButton variant="text" onClick={onCancel}>
            <FVLabel transKey="cancel" defaultStr="Cancel" transform="first" />
          </FVButton>
        ) : (
          ''
        )}
      </div>
    )
  }

  return (
    <div style={{ width: '100%', border: '1px dashed #dedede', padding: '10px', position: 'relative' }}>{content}</div>
  )
}

const mediaTemplate = t.form.Form.templates.textbox.clone({ renderInput })

export default class MediaFactory extends t.form.Textbox {
  constructor(props) {
    super(props)
    this.state = Object.assign(this.state, { expandedValue: null })

    this.setExpandedValue = this.setExpandedValue.bind(this)
  }

  setExpandedValue(expandedValue, uid) {
    expandedValues[uid] = expandedValue
    this.setState({ expandedValue })
  }

  /*
      componentWillReceiveProps(props) {
        if (props.type !== this.props.type) {
          this.typeInfo = getTypeInfo(props.type)
        }
        const value = this.getTransformer().format(props.value)
        this.setState({ value })

        console.log(expandedValues[value]);
      }*/

  getLocals() {
    const locals = super.getLocals()
    locals.attrs = this.getAttrs()
    locals.setExpandedValue = this.setExpandedValue
    locals.attrs.expandedValue = this.state.expandedValue
    const localsOptions = this.props.options.locals || {}
    return { ...locals, ...localsOptions }
  }

  getTemplate() {
    return mediaTemplate
  }
}
