import React, { Component } from 'react'
import PropTypes from 'prop-types'

import selectn from 'selectn'
import t from 'tcomb-form'
import sanitize from 'common/Sanitize'

import Preview from 'components/Preview'
import StatusBar from 'components/StatusBar'

// Models
import { Document } from 'nuxeo'

// Schemas
import fields from 'common/schemas/fields'
import options from 'common/schemas/options'

import CircularProgress from '@material-ui/core/CircularProgress'
import Edit from '@material-ui/icons/Edit'

import './EditableComponentHelper.css'
import FVLabel from 'components/FVLabel'
import { connect } from 'react-redux'

const RenderRegular = (currentValue, preview, previewType, returnWrapper = 'span') => {
  let output = []
  let values = []

  if (!Array.isArray(currentValue)) {
    values[0] = currentValue
  } else {
    values = currentValue
  }

  output = values.map((value, i) => {
    // Note: https://eslint.org/docs/rules/no-prototype-builtins
    const id = value && Object.prototype.hasOwnProperty.call(value, 'uid') ? value.uid : value

    return preview ? (
      <Preview key={i} id={id} type={previewType} />
    ) : (
      React.createElement(returnWrapper, {
        key: i,
        dangerouslySetInnerHTML: {
          __html: sanitize(value),
        },
      })
    )
  })

  return output
}

const { array, bool, func, object, string } = PropTypes

class EditableComponentUnwrapped extends Component {
  static propTypes = {
    className: string,
    dataTestid: string,
    accessDenied: bool, // NOTE: not certain being used
    computeEntity: object.isRequired,
    context: object,
    isSection: bool,
    options: array, // NOTE: not certain being used
    previewType: string,
    property: string.isRequired,
    showPreview: bool,
    sectionProperty: string,
    updateEntity: func.isRequired,
    intl: object,
  }

  static defaultProps = {
    className: '',
    accessDenied: false,
    showPreview: false,
  }

  state = {
    editModeEnabled: false,
    savedValue: null,
  }

  shouldComponentUpdate(newProps, newState) {
    // eslint-disable-next-line
    if (newState != this.state || newProps.computeEntity.response != this.props.computeEntity.response) return true

    if (newProps.options !== null) return true

    return false
  }

  render() {
    return (
      <div
        data-testid={this.props.dataTestid}
        className={`EditableComponent ${this.props.className ? this.props.className : ''}`}
      >
        {this._editableElement()}
        <StatusBar message={selectn('message', this.props.computeEntity)} />
      </div>
    )
  }

  /**
   * Allows an element to be rendered as regular text or as an editable form, derived from a larger type (e.g. fv-portal:about from FVPortal type)
   * Note: This will only work with 'properties' from the document as they are the only mutable fields.
   * @param {property} string - The property field id (used for Structs)
   * @param {entity} doc - The entitiy to derive current values from, Nuxeo doc object
   * @returns - Element to be rendered
   */
  _editableElement() {
    const { property } = this.props

    const entity = selectn('response', this.props.computeEntity)

    // If still computing, return spinner
    if (entity.isFetching) return <CircularProgress mode="indeterminate" size={20} />

    // Get current value for field from properties
    const currentValue = selectn(property, this.state.savedValue) || selectn('properties.' + property, entity)

    // Get all options for type from entity field definition
    const fieldFormOptions = selectn(entity.type, options)

    let toReturn = null

    // Handle edit mode
    if (this.state.editModeEnabled && !this.props.accessDenied) {
      const fieldFormValues = {}
      let fieldFormStruct
      let fieldFormFields = null

      // Get all fields for type from entity field definition
      fieldFormFields = selectn(entity.type, fields)

      // If fields and options found, try to create form our of field
      if (fieldFormFields && fieldFormOptions) {
        // If extended options enabled
        if (this.props.options && this.props.options.length > 0) {
          fieldFormOptions.fields[property].options = this.props.options
        }

        // Create a sub-structure for this field
        const newFieldFormSchema = {}

        // Set field to be new schema (note: selectn doesn't work with functions defined in maps)
        newFieldFormSchema[property] = fieldFormFields[property]

        if (newFieldFormSchema) {
          // Create a new sub-structure for schema
          fieldFormStruct = t.struct(newFieldFormSchema)

          // Set default value to current value
          fieldFormValues[property] = currentValue

          toReturn = (
            <form className="EditableComponent__form" onSubmit={(e) => this._onRequestSaveField(e, property)}>
              <t.form.Form
                ref={(element) => {
                  this['form_' + property] = element
                }}
                value={fieldFormValues}
                type={fieldFormStruct}
                context={selectn('response', this.props.context) || selectn('response', this.props.computeEntity)}
                options={fieldFormOptions}
              />
              <button type="submit" className="EditableComponent__btnSave FlatButton FlatButton--primary">
                <FVLabel transKey="save" defaultStr="Save" transform="first" />
              </button>
            </form>
          )
        }
      }
    } else {
      // Render regular field if not in edit mode
      /*
      <IconButton
            // iconClassName="material-icons"
            // iconStyle={{ fontSize: '20px' }}
            style={{
              verticalAlign: '-4px',
              margin: '0 5px 0 -5px',
              padding: '0px 5px',
              height: '22px',
              width: '22px',
              display: this.props.accessDenied ? 'none' : 'inline-block',
            }}
            onClick={this._onEditRequest.bind(this, property)}
            tooltip={intl.trans('edit', 'Edit', 'first')}
          >
            mode_edit
          </IconButton>
          */
      const editButton = this.props.accessDenied ? null : (
        <button
          type="button"
          className={'EditableComponent__btnEdit FlatButton FlatButton--compact'}
          data-testid="EditableComponent__edit"
          onClick={(e) => {
            e.preventDefault()
            this._onEditRequest()
          }}
        >
          <Edit className="FlatButton__icon" title={this.props.intl.trans('edit', 'Edit', 'first')} />
          <span className="FlatButton__label">
            <FVLabel transKey="edit" defaultStr="Edit" transform="first" />
          </span>
        </button>
      )
      toReturn = (
        <div>
          {RenderRegular(currentValue, this.props.showPreview, this.props.previewType)}
          {editButton}
        </div>
      )
    }

    return toReturn
  }

  _onRequestSaveField(e, property) {
    // Prevent default behaviour
    e.preventDefault()

    // TODO: Find better way to construct object then accessing internal function
    // Create new document rather than modifying the original document
    const newDocument = new Document(this.props.computeEntity.response, {
      repository: this.props.computeEntity.response._repository,
      nuxeo: this.props.computeEntity.response._nuxeo,
    })
    // Note: getValue() is tcomb-form
    const formValue = this['form_' + property].getValue()

    // Set new value property on document
    newDocument.set(formValue)

    // Save document
    this.props.updateEntity(
      newDocument,
      null,
      "'" +
        selectn('props.options.fields' + '.' + property + '.label', this['form_' + property]) +
        "' updated successfully!"
    )

    this.setState({
      editModeEnabled: false,
      savedValue: formValue,
    })
  }

  _onEditRequest(/*fieldToEdit*/) {
    this.setState({
      editModeEnabled: true,
    })
  }
}

export class EditableComponentHelper extends Component {
  static propTypes = {
    className: string,
    dataTestid: string,
    entity: object,
    isSection: bool,
    previewType: string,
    property: string.isRequired,
    showPreview: bool,
    sectionProperty: string,
  }
  static defaultProps = {
    className: '',
  }
  render() {
    let toReturn = null
    if (this.props.isSection) {
      toReturn = (
        <div>
          {RenderRegular(
            selectn(this.props.sectionProperty || 'properties.' + this.props.property, this.props.entity),
            this.props.showPreview,
            this.props.previewType,
            'div'
          )}
        </div>
      )
    } else {
      toReturn = <EditableComponent {...this.props} />
    }
    return (
      <div className={`EditableComponentHelper ${this.props.className ? this.props.className : ''}`}>{toReturn}</div>
    )
  }
}

const mapStateToProps = (state /*, ownProps*/) => {
  const { locale } = state

  const { intlService } = locale

  return {
    intl: intlService,
  }
}

const EditableComponent = connect(mapStateToProps)(EditableComponentUnwrapped)

export default EditableComponentHelper
